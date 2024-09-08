#!/usr/bin/env node

require("dotenv").config();
const fs = require("node:fs/promises");
const { program } = require("commander");
const { version } = require("../package.json");
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

program
  .name("codeshift")
  .description("Transform code from one language to another")
  .version(`v${version}`, "-v, --version");

program
  .command("run", { isDefault: true })
  .description("default command")
  .option("-o, --output <filename>", "specify filename to output to")
  .argument("<output-language>", "language to transform code to")
  .argument("<input-files...>", "source files to read")
  .action(async (outputLang, inputFiles, options) => {
    for (let filePath of inputFiles) {
      try {
        const fileContent = await fs.readFile(filePath, { encoding: "utf8" });
        const reponseStream = await getGroqChatStream(
          fileContent,
          outputLang,
          options
        );
        if (options.output) {
          let response = "";
          for await (const chunk of reponseStream) {
            const chunkContent = chunk.choices[0]?.delta?.content || "";
            process.stdout.write(chunkContent);
            response += chunkContent;
          }
          await fs.writeFile(options.output, response);
        } else {
          for await (const chunk of reponseStream) {
            const chunkContent = chunk.choices[0]?.delta?.content || "";
            process.stdout.write(chunkContent);
          }
        }
        process.stdout.write("\n");
      } catch (error) {
        console.error(error);
      }
    }
  });

async function getGroqChatStream(fileContent, outputLang) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You will receive source code files and must convert them to the desired language."
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
