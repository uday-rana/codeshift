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

const baseURL = process.env.BASE_URL || supportedProviders.openrouter.baseURL;
let model = process.env.MODEL;

// Find match in supportedProviders based on baseURL
const provider = Object.values(supportedProviders).find((supportedProvider) =>
  baseURL.startsWith(supportedProvider.baseURL),
);

if (!model) {
  if (!provider) {
    throw new Error(
      `Unsupported provider for BASE_URL ${process.env.BASE_URL}. Please set a valid MODEL environment variable.`,
    );
  }
  model = provider.defaultModel;
}

module.exports = model;
