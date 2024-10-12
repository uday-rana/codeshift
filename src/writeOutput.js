const fs = require("node:fs/promises");

/**
 * Writes the completion result to the specified output file or standard output.
 *
 * This function processes the completion stream and writes the result to either a file or stdout.
 * If token usage tracking is requested, it also displays the token usage statistics.
 *
 * @async
 * @function writeOutput
 * @param {AsyncIterable<Object>} completion - The stream of completion response chunks from the API.
 * @param {string} [outputFilePath] - Path to the output file where the result will be saved. If not provided, writes to stdout.
 * @param {boolean} tokenUsageRequested - Whether to display token usage statistics after processing the completion stream.
 */
async function writeOutput(completion, outputFilePath, tokenUsageRequested) {
  let tokenUsage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

  await processCompletionStream(
    completion,
    outputFilePath,
    tokenUsageRequested,
    tokenUsage,
  );

  if (tokenUsageRequested) {
    displayTokenUsage(tokenUsage);
  }
}

/**
 * Processes the completion response stream and writes the content to the output destination.
 *
 * This function iterates over the completion stream, writing each chunk to the specified
 * output file or stdout. If token usage tracking is requested, it accumulates token usage
 * statistics from the response chunks.
 *
 * @async
 * @function processCompletionStream
 * @param {AsyncIterable<Object>} completion - The stream of completion response chunks from the API.
 * @param {string} [outputFilePath] - Path to the output file. If not provided, writes to stdout.
 * @param {boolean} tokenUsageRequested - Whether to track and accumulate token usage statistics.
 * @param {Object} tokenUsage - An object to accumulate token usage data.
 * @param {number} tokenUsage.prompt_tokens - Number of tokens used in the prompt.
 * @param {number} tokenUsage.completion_tokens - Number of tokens generated in the completion.
 * @param {number} tokenUsage.total_tokens - Total number of tokens used.
 * @throws Will terminate the process with exit code 23 if an error occurs while reading the response stream.
 */
async function processCompletionStream(
  completion,
  outputFilePath,
  tokenUsageRequested,
  tokenUsage,
) {
  const writeFunction = outputFilePath
    ? async (completionChunk) =>
        await fs.appendFile(
          outputFilePath,
          completionChunk.choices[0]?.delta?.content || "",
        )
    : (completionChunk) => {
        process.stdout.write(completionChunk.choices[0]?.delta?.content || "");
      };

  try {
    for await (const chunk of completion) {
      await writeFunction(chunk);

      if (tokenUsageRequested) {
        const usage = chunk?.x_groq?.usage ?? chunk?.usage;

        if (usage) {
          tokenUsage.prompt_tokens += usage.prompt_tokens || 0;
          tokenUsage.completion_tokens += usage.completion_tokens || 0;
          tokenUsage.total_tokens += usage.total_tokens || 0;
        }
      }
    }

    if (outputFilePath) {
      await fs.appendFile(outputFilePath, "\n");
    } else {
      process.stdout.write("\n");
    }
  } catch (error) {
    console.error(`error reading response stream: ${error}`);
    process.exit(23);
  }
}

/**
 * Displays a report of token usage statistics.
 *
 * This function logs the token usage data to the console. If no token usage data is available,
 * it logs a message indicating that the model did not return token usage.
 *
 * @function displayTokenUsage
 * @param {Object} tokenUsage - An object containing token usage statistics.
 * @param {number} tokenUsage.prompt_tokens - Number of tokens used in the prompt.
 * @param {number} tokenUsage.completion_tokens - Number of tokens generated in the completion.
 * @param {number} tokenUsage.total_tokens - Total number of tokens used.
 */
function displayTokenUsage({ prompt_tokens, completion_tokens, total_tokens }) {
  if (prompt_tokens == 0 && completion_tokens == 0 && total_tokens == 0) {
    console.error(`\n No Token Usage returned by model.`);
  }

  console.error(
    `\nToken Usage Report:\n`,
    `Prompt tokens: ${prompt_tokens}\n`,
    `Completion tokens: ${completion_tokens}\n`,
    `Total tokens: ${total_tokens}`,
  );
}

module.exports = writeOutput;
