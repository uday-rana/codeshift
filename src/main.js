const model = require("./model");
const buildPrompt = require("./buildPrompt");
const getChatCompletion = require("./getChatCompletion");
const writeOutput = require("./writeOutput");
/**
 * Main entry point for processing input files and generating output based on chat completion.
 *
 * This function validates necessary environment variables, constructs a prompt from the provided
 * input files and language, retrieves a chat completion using the specified model, and writes
 * the result to an output file. It also supports tracking token usage if requested.
 *
 * @async
 * @function main
 * @param {Object} options - Configuration options for the process.
 * @param {string} options.output - Path to the output file where results will be saved.
 * @param {boolean} [options.tokenUsage=false] - Whether to track and log token usage statistics.
 * @param {string} outputLang - The language for the output content (e.g., "en", "fr").
 * @param {string[]} inputFiles - List of paths to input files to be processed.
 * @throws Will terminate the process with exit code 20 if required environment variables
 * (`API_KEY` or `BASE_URL`) are missing.
 */
async function main(options, outputLang, inputFiles) {
  if (!process.env.API_KEY) {
    console.error(`missing expected env var: "API_KEY"`);
    process.exit(20);
  }

  if (!process.env.BASE_URL) {
    console.error(`missing expected env var: "BASE_URL"`);
    process.exit(20);
  }

  const outputFilePath = options.output;
  const tokenUsageRequested = options.tokenUsage;

  const prompt = await buildPrompt(outputLang, inputFiles);
  const completion = await getChatCompletion(prompt, model);
  await writeOutput(completion, outputFilePath, tokenUsageRequested);
}

module.exports = main;
