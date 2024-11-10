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

let model = process.env.MODEL;

if (!model) {
  // Check if supplied baseURL belongs to a supported provider
  const provider = Object.values(supportedProviders).find((supportedProvider) =>
    process.env.BASE_URL.startsWith(supportedProvider.baseURL),
  );

  if (!provider) {
    throw new Error(
      `Unsupported provider for BASE_URL ${process.env.BASE_URL}. Please set a valid MODEL environment variable.`,
    );
  }

  model = provider.defaultModel;
}

module.exports = model;
