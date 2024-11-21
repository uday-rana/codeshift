const config = require("./config");

// Define supported providers, their base URLs, and their default models
const supportedProviders = {
  openai: {
    baseURL: "https://api.openai.com/v1",
    defaultModel: "gpt-4o-mini",
  },
  openrouter: {
    baseURL: "https://openrouter.ai/api/v1",
    defaultModel: "meta-llama/llama-3-8b-instruct:free",
  },
  groq: {
    baseURL: "https://api.groq.com/openai/v1",
    defaultModel: "llama3-8b-8192",
  },
};

/**
 * The LLM model to be used by the program.
 * @type {string}
 */
let model = config.model;

if (!model) {
  // Check if supplied base URL belongs to a supported provider
  const provider = Object.values(supportedProviders).find((supportedProvider) =>
    config.baseUrl.startsWith(supportedProvider.baseURL),
  );

  if (!provider) {
    throw new Error(
      `Unsupported provider for base URL ${config.baseUrl}. Please set a valid model in the config.`,
    );
  }

  model = provider.defaultModel;
}
module.exports = model;
