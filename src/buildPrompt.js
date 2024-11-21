const fsPromises = require("node:fs/promises");

/**
 * Constructs a prompt by reading the content of input files and formatting it for code conversion.
 *
 * This function reads the provided source files, concatenates their content into a structured
 * prompt, and returns it. The prompt is designed to request code conversion into the specified
 * output language. If any file cannot be read, the process is terminated with an error message.
 *
 * @async
 * @function buildPrompt
 * @param {string} outputLang - The target programming language for the conversion (e.g., "Python", "JavaScript").
 * @param {string[]} inputFiles - Array of file paths to source code files to include in the prompt.
 * @returns {string} - A formatted prompt string ready for use in a chat completion request.
 * @throws Will terminate the process with exit code 21 if reading any input file fails.
 */
async function buildPrompt(outputLang, inputFiles) {
  let prompt = `Convert the following source code files to ${outputLang}. \
Do not include any sentences in your response. Your response must consist entirely of the requested code. \
Do not use backticks (\`) to enclose the code in your response.\n\n`;

  try {
    // Loop through input files and add them to prompt
    for (const inputFilePath of inputFiles) {
      const inputFileContent = await fsPromises.readFile(inputFilePath, {
        encoding: "utf8",
      });

      prompt = prompt.concat(
        `${inputFilePath}:\n`,
        `\`\`\`\n${inputFileContent}\`\`\`\n`,
      );
    }

    return prompt;
  } catch (error) {
    console.error(`error reading input files: ${error}`);
    process.exit(1);
  }
}

module.exports = buildPrompt;
