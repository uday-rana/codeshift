#!/usr/bin/env node

require("dotenv").config();
const { program } = require("commander");
const main = require("./main");
const loadConfig = require("./loadConfig");
const { version, name, description } = require("../package.json");

const config = (async () => await loadConfig())();

program
  .name(name)
  .description(description)
  .version(`${name} v${version}`, "-v, --version")
  .option(
    "-o, --output <filename>",
    "specify filename to write output to",
    config?.output,
  )
  .option("-t, --token-usage", "report token usage", config?.tokenUsage)
  .argument("<output-language>", "language to transform code to")
  .argument("<input-files...>", "source files to read")
  .action(async (outputLang, inputFiles) => {
    main(program.opts(), outputLang, inputFiles);
  });

program.parse(process.argv);
