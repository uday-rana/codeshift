const openai = require("./openaiClient");

/**
 * Sends a chat completion request to an LLM to convert code based on the provided prompt.
 *
 * This function uses an LLM to generate a language conversion of the input code.
 * It sends a series of chat messages, including system instructions and the user-provided prompt,
 * and streams the response with token usage tracking enabled.
 *
 * @async
 * @function getChatCompletion
 * @param {string} prompt - The prompt containing source code to be converted.
 * @param {string} model - The name of the large language model to be used (e.g., "gpt-3.5-turbo").
 * @param {boolean} streamResponseRequested - Whether to return the response as a stream.
 * @returns {Promise<Object>} - A Promise that resolves to a chat completion response.
 * @throws {Error} - Throws an error if the API call fails.
 */
async function getChatCompletion(prompt, model, streamResponseRequested) {
  try {
    return await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You will receive source code files and must convert them to the desired language.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: model,
      max_tokens: 1024,
      stream: streamResponseRequested || false,
      stream_options: {
        include_usage: true,
      },
    });
  } catch (error) {
    console.error(`error generating response:`, error);
    process.exit(1);
  }
}

module.exports = getChatCompletion;
