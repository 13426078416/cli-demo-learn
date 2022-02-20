#!/usr/bin/env node
const { program } = require("commander");
const inquirer = require("inquirer");
const path = require("path");
const Metalsmith = require("metalsmith");
const ejs = require("ejs");

const genFiles = (options) => {
  const temPath = path.resolve(__dirname, `./templates/${options.temple}`);
  const destination = options.destination
    ? options.destination
    : path.resolve(process.cwd(), options.name);
  Metalsmith(__dirname)
    .source(temPath)
    .destination(destination)
    .use((files) => {
      Object.keys(files).forEach((key) => {
        const file = files[key];
        const content = file.contents.toString();
        const newContent = JSON.stringify(
          {
            ...JSON.parse(content),
            ...options,
          },
          null,
          4
        );
        file.contents = Buffer.from(newContent);
      });
    })
    .build((error) => {
      console.error(error);
    });
};
const handleCreate = (params, options) => {
  console.log("handleCreate", params, options);
  inquirer
    .prompt([
      {
        type: "name",
        name: "author",
        message: "author name?",
      },
      {
        type: "list",
        name: "temple",
        message: "choose a temple",
        choices: ["tpl-1", "tpl-2", "tpl-3"],
      },
    ])
    .then((answers) => {
      genFiles({ ...answers, ...params, ...options });
    })
    .catch((error) => {
      console.error(error);
    });
};

program
  .version("0.0.3")
  .command("create <name>")
  .option("-d, --destination", "input destination")
  .option("-p, --pizza-type <type>", "flavour of pizza")
  .allowUnknownOption()
  .description("create a project")
  .action((name, opt, p) => {
    handleCreate({ name }, p.opts());
  });

const e = program.parse(process.argv);
