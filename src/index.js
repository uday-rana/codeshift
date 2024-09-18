#!/usr/bin/env node

require("dotenv").config();
const fs = require("node:fs/promises");
const { program } = require("commander");
const { version, name } = require("../package.json");
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Set up program details for -h and -v options
program
  .name("codeshift")
  .description("Transform code from one language to another")
  .version(`${name} v${version}`, "-v, --version")
  .option("-o, --output <filename>", "specify filename to write output to")
  .option("-t, --token-usage", "report token usage")
  .argument("<output-language>", "language to transform code to")
  .argument("<input-files...>", "source files to read")
  .action(async (outputLang, inputFiles) => {
    const outputFile = program.opts().output;
    const reportToken = program.opts().tokenUsage;
    let prompt_tokens, completion_tokens, total_tokens;

    if (!process.env.GROQ_API_KEY) {
      console.error(`Missing environment variable "GROQ_API_KEY"`);
      process.exit(1);
    }

    // Loop through file path args
    for (let filePath of inputFiles) {
      try {
        const fileContent = await fs.readFile(filePath, { encoding: "utf8" });
        const responseStream = await getGroqChatStream(fileContent, outputLang);
        // Check if --output flag was used
        if (outputFile) {
          let response = "";
          // Read response stream one chunk at a time
          // Store chunks in `response` for writing to output file
          for await (const chunk of responseStream) {
            const chunkContent = chunk.choices[0]?.delta?.content || "";
            response += chunkContent;
            // Record tokens if token-usage flag passed
            if (reportToken && chunk?.x_groq?.usage !== undefined) {
              prompt_tokens = chunk.x_groq.usage.prompt_tokens;
              completion_tokens = chunk.x_groq.usage.completion_tokens;
              total_tokens = chunk.x_groq.usage.total_tokens;
            }
          }
          await fs.writeFile(outputFile, `${response}\n`);
        } else {
          // If no output file specified, read stream without storing to a variable
          for await (const chunk of responseStream) {
            const chunkContent = chunk.choices[0]?.delta?.content || "";
            process.stdout.write(chunkContent);
            // Record tokens if token-usage flag passed
            if (reportToken && chunk?.x_groq?.usage !== undefined) {
              prompt_tokens = chunk.x_groq.usage.prompt_tokens;
              completion_tokens = chunk.x_groq.usage.completion_tokens;
              total_tokens = chunk.x_groq.usage.total_tokens;
            }
          }
        }
        // Output recorded tokens if token-usage flag passed
        if (reportToken) {
          console.error(
            "\nToken Usage Report:\n",
            `Prompt tokens: ${prompt_tokens}\n`,
            `Completion tokens: ${completion_tokens}\n`,
            `Total tokens: ${total_tokens}`
          );
        }
        process.stdout.write("\n");
      } catch (error) {
        console.error(error);
      }
    }
  });

// Set up call to Groq API
async function getGroqChatStream(fileContent, outputLang) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You will receive source code files and must convert them to the desired language.
          Do not include any sentences in your response. Your response must consist entirely of the requested code.
          Do not enclose your response in a codeblock.`,
      },
      {
        role: "user",
        content: `Convert the following code to ${outputLang}.
			
			${fileContent}`,
      },
    ],
    model: "llama3-8b-8192",
    max_tokens: 1024,
    stream: true,
  });
}

program.parse();
