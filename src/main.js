const model = require("./model");
const config = require("./config");
const buildPrompt = require("./buildPrompt");
const getChatCompletion = require("./getChatCompletion");
const writeOutput = require("./writeOutput");

/**
 * Main entry point for processing input files and generating output based on chat completion.
 *
 * This function validates mandatory config settings, constructs a prompt from the provided
 * input files and language, retrieves a chat completion using the specified model, and writes
 * the result to an output file. It also supports tracking token usage if requested.
 *
 * @async
 * @function main
 * @param {Object} options - CLI options
 * @param {string} outputLang - The language for the output content (e.g., "typescript", "python").
 * @param {string[]} inputFiles - List of paths to input files to be processed.
 * @throws Will terminate the process with exit code 20 if required config options
 * (`apiKey` or `baseUrl`) are missing.
 */
async function main(options, outputLang, inputFiles) {
  if (!config?.baseUrl) {
    console.error(`missing expected config option: "baseUrl"`);
    process.exit(1);
  }

  if (!config?.apiKey) {
    console.error(`missing expected config option: "apiKey"`);
    process.exit(1);
  }

  const outputFilePath = options.outputFile ?? config.outputFile;
  const toPrintTokenUsage = options.tokenUsage ?? config.tokenUsage;
  const toStream = options.stream ?? config.stream;

  const prompt = await buildPrompt(outputLang, inputFiles);
  const completion = await getChatCompletion(prompt, model, toStream);

  await writeOutput(completion, outputFilePath, toPrintTokenUsage, toStream);
}

module.exports = main;
