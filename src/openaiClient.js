const OpenAI = require("openai");

const openai = new OpenAI({
  baseURL: process.env.BASE_URL,
  apiKey: process.env.API_KEY,
});

module.exports = openai;
