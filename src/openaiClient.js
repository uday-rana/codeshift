const OpenAI = require("openai");
const config = require("./config");

const openai = new OpenAI({
  baseURL: config.baseUrl,
  apiKey: config.apiKey,
});

module.exports = openai;
