#!/usr/bin/env node

const { program } = require("commander");
const main = require("./main");
const { version, name, description } = require("../package.json");

program
  .name(name)
  .description(description)
  .version(`${name} v${version}`, "-v, --version")
  .option("-o, --outputFile <filename>", "specify filename to write output to")
  .option("-t, --token-usage", "report token usage")
  .option("-s, --stream", "stream the response")
  .argument("<output-language>", "language to transform code to")
  .argument("<input-files...>", "source files to read")
  .action(async (outputLang, inputFiles) => {
    main(program.opts(), outputLang, inputFiles);
  });

program.parse(process.argv);
