import { parseArgs } from "util";
import { version } from "../package.json";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    version: {
      type: "boolean",
    },
    v: {
      type: "boolean",
    },
    help: {
      type: "boolean",
    },
    h: {
      type: "boolean",
    },
  },
  strict: true,
  allowPositionals: true,
});

// Print help message when no args supplied or when using help flags
if (Bun.argv.length === 2 || values.help === true || values.h === true) {
  console.log(
    "Usage: codeshift.exe [options] [desired language] [file paths]\n"
  );
  console.log(
    "Codeshift takes source files in one programming language and converts them to another.\n"
  );
  console.log("Options:");
  console.log("-v, --version: print Codeshift version");
  console.log("-h, --help: print Codeshift command line options");
  process.exit();
}

// Print version when using version flags
if (values.version === true || values.v === true) {
  console.log(`v${version}`);
  process.exit();
}

// Get desired language
const desiredLanguage = positionals[2];

// Get file paths
const filePaths = positionals.slice(3);

// Loop through files, pass them to Groq, and return the response
for (let filePath of filePaths) {
  const file = Bun.file(filePath);

  if (await file.exists()) {
    const fileContent = await file.text();
    const stream = await getGroqChatStream(fileContent);
    for await (const chunk of stream) {
      process.stdout.write(chunk.choices[0]?.delta?.content || "");
    }
    process.stdout.write("\n");
  } else {
    process.stderr.write(`File not found: ${filePath}`);
  }
}

export async function getGroqChatStream(fileContent: string) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant. You will receive source code files and must convert them to the desired language.",
      },
      {
        role: "user",
        content: `Convert the following code to ${desiredLanguage}.
        
        ${fileContent}`,
      },
    ],
    model: "llama3-8b-8192",
    max_tokens: 1024,
    stream: true,
  });
}
