#!/usr/bin/env node

require("dotenv").config();
const fs = require("node:fs/promises");
const { program } = require("commander");
const { version, name, description } = require("../package.json");
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Set up program details for -h and -v options
program
  .name(name)
  .description(description)
  .version(`${name} v${version}`, "-v, --version")
  .option("-o, --output <filename>", "specify filename to write output to")
  .option("-t, --token-usage", "report token usage")
  .argument("<output-language>", "language to transform code to")
  .argument("<input-files...>", "source files to read")
  .action(async (outputLang, inputFiles) => {
    if (!process.env.GROQ_API_KEY) {
      throw new Error(`missing expected env var: "GROQ_API_KEY"`);
    }

    const outputFilePath = program.opts().output;
    const tokenUsageRequested = program.opts().tokenUsage;

    let promptTokens = 0;
    let completionTokens = 0;
    let totalTokens = 0;

    let prompt = `Convert the following source code files to ${outputLang}. 
          Do not include any sentences in your response. Your response must consist entirely of the requested code.
          Do not use backticks (\`) to enclose the code in your response.\n\n`;
    let response = "";

    // Loop through input files and add them to prompt
    for (const inputFilePath of inputFiles) {
      const inputFileContent = await fs.readFile(inputFilePath, {
        encoding: "utf8",
      });
      prompt = prompt.concat(`${inputFilePath}:\n`, `\`\`\`\n${inputFileContent}\`\`\`\n`);
    }

    // Send request to Groq
    const responseStream = await getGroqChatStream(prompt);

    // Write to either output file or stdout
    if (outputFilePath) {
      // Read response stream chunk by chunk
      for await (const chunk of responseStream) {
        // Concatenate chunk to response
        response += chunk.choices[0]?.delta?.content || "";
        // Aggregate token count
        if (chunk?.x_groq?.usage) {
          promptTokens += chunk.x_groq.usage.prompt_tokens;
          completionTokens += chunk.x_groq.usage.completion_tokens;
          totalTokens += chunk.x_groq.usage.total_tokens;
        }
      }
      fs.writeFile(outputFilePath, `${response}`);
    } else {
      // Read response stream chunk by chunk
      for await (const chunk of responseStream) {
        // Write chunk to stdout
        process.stdout.write(chunk.choices[0]?.delta?.content || "");
        if (chunk?.x_groq?.usage) {
          // Aggregate token count
          promptTokens += chunk.x_groq.usage.prompt_tokens;
          completionTokens += chunk.x_groq.usage.completion_tokens;
          totalTokens += chunk.x_groq.usage.total_tokens;
        }
      }
      process.stdout.write("\n");
    }

    if (tokenUsageRequested) {
      console.error(
        "\nToken Usage Report:\n",
        `Prompt tokens: ${promptTokens}\n`,
        `Completion tokens: ${completionTokens}\n`,
        `Total tokens: ${totalTokens}`
      );
    }
  });

// Set up call to Groq API
async function getGroqChatStream(prompt) {
  return groq.chat.completions.create({
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
    model: "llama3-8b-8192",
    max_tokens: 1024,
    stream: true,
  });
}

program.parse();
