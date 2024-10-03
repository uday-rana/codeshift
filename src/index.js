#!/usr/bin/env node

require("dotenv").config();
const fs = require("node:fs/promises");
const { program } = require("commander");
const { version, name, description } = require("../package.json");
const OpenAI = require("openai");
const toml = require("smol-toml");
const path = require("path");
const os = require("os");

const configFilePath = path.join(__dirname, "../.codeshift.toml");

const openai = new OpenAI({
  baseURL: process.env.BASE_URL,
  apiKey: process.env.API_KEY,
});

// Define supported providers, their base URLs, and their default models
const providers = {
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

// default values
let defaultConfig = {};

// Try to read TOML config file
async function loadConfig() {
  try {
    if (await fs.stat(configFilePath)) {
      const fileContent = await fs.readFile(configFilePath, "utf-8");
      const parsedConfig = toml.parse(fileContent);
      defaultConfig = parsedConfig.settings;
    }
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error(
        `Error reading or parsing the TOML config file: ${err.message}`
      );
      process.exit(1); // Exit with an error message if the file exists but is invalid
    }
  }
}
async function runApp() {
  await loadConfig();
  // Set up program details for -h and -v options
  program
    .name(name)
    .description(description)
    .version(`${name} v${version}`, "-v, --version")
    .option(
      "-o, --output <filename>",
      "specify filename to write output to",
      defaultConfig?.output
    )
    .option(
      "-t, --token-usage",
      "report token usage",
      defaultConfig?.tokenUsage
    )
    .argument("<output-language>", "language to transform code to")
    .argument("<input-files...>", "source files to read")
    .action(async (outputLang, inputFiles) => {
      if (!process.env.API_KEY) {
        console.error(`missing expected env var: "API_KEY"`);
        process.exit(20);
      }

      if (!process.env.BASE_URL) {
        console.error(`missing expected env var: "BASE_URL"`);
        process.exit(20);
      }

      // Check if provider is supported
      let isProviderSupported = false;
      let defaultModel;

      for (const providerKey in providers) {
        if (process.env.BASE_URL.startsWith(providers[providerKey].baseURL)) {
          isProviderSupported = true;
          defaultModel = providers[providerKey].defaultModel;
          break;
        }
      }

      if (!isProviderSupported) {
        console.warn(`Unsupported provider (BASE_URL). May cause errors.`);
      }

      let model = process.env.MODEL;
      if (!model) {
        if (!isProviderSupported) {
          throw new Error(`Unsupported BASE_URL requires env var: "MODEL"`);
        }
        model = defaultModel;
      }

      const outputFilePath = program.opts().output;
      const tokenUsageRequested = program.opts().tokenUsage;

      let prompt = `Convert the following source code files to ${outputLang}. 
          Do not include any sentences in your response. Your response must consist entirely of the requested code.
          Do not use backticks (\`) to enclose the code in your response.\n\n`;

      try {
        // Loop through input files and add them to prompt
        for (const inputFilePath of inputFiles) {
          const inputFileContent = await fs.readFile(inputFilePath, {
            encoding: "utf8",
          });
          prompt = prompt.concat(
            `${inputFilePath}:\n`,
            `\`\`\`\n${inputFileContent}\`\`\`\n`
          );
        }
      } catch (error) {
        console.error(`error reading input files: ${error}`);
        process.exit(21);
      }

      let completion;
      try {
        // Send request to AI provider
        completion = await getAIChatStream(prompt, model);
      } catch (error) {
        console.error(`error getting response from provider: ${error}`);
        process.exit(22);
      }

      let promptTokensUsed = 0;
      let completionTokensUsed = 0;
      let totalTokensUsed = 0;
      try {
        // Write to either output file or stdout
        if (outputFilePath) {
          let response = "";
          // Read response stream chunk by chunk
          for await (const chunk of completion) {
            // Concatenate chunk to response
            response += chunk.choices[0]?.delta?.content || "";
            if (chunk?.usage) {
              promptTokensUsed = chunk.usage.prompt_tokens;
              completionTokensUsed = chunk.usage.completion_tokens;
              totalTokensUsed = chunk.usage.total_tokens;
            }
            if (chunk?.x_groq?.usage) {
              promptTokensUsed = chunk.x_groq.usage.prompt_tokens;
              completionTokensUsed = chunk.x_groq.usage.completion_tokens;
              totalTokensUsed = chunk.x_groq.usage.total_tokens;
            }
          }
          fs.writeFile(outputFilePath, `${response}`);
        } else {
          // Read response stream chunk by chunk
          for await (const chunk of completion) {
            // Write chunk to stdout
            process.stdout.write(chunk.choices[0]?.delta?.content || "");
            if (chunk?.usage) {
              promptTokensUsed = chunk.usage.prompt_tokens;
              completionTokensUsed = chunk.usage.completion_tokens;
              totalTokensUsed = chunk.usage.total_tokens;
            }
            if (chunk?.x_groq?.usage) {
              promptTokensUsed = chunk.x_groq.usage.prompt_tokens;
              completionTokensUsed = chunk.x_groq.usage.completion_tokens;
              totalTokensUsed = chunk.x_groq.usage.total_tokens;
            }
          }
          process.stdout.write("\n");
        }
      } catch (error) {
        console.error(`error reading response stream: ${error}`);
        process.exit(23);
      }

      if (tokenUsageRequested) {
        if (
          promptTokensUsed == 0 &&
          completionTokensUsed == 0 &&
          totalTokensUsed == 0
        ) {
          console.error(`\n No Token Usage returned by model.`);
        }
        console.error(
          `\nToken Usage Report:\n`,
          `Prompt tokens: ${promptTokensUsed}\n`,
          `Completion tokens: ${completionTokensUsed}\n`,
          `Total tokens: ${totalTokensUsed}`
        );
      }
    });

  program.parse(process.argv);
}
runApp();

// Set up call to provider API
async function getAIChatStream(prompt, model) {
  return openai.chat.completions.create({
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
    stream: true,
    stream_options: {
      include_usage: true,
    },
  });
}
