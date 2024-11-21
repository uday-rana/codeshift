const fs = require("node:fs");
const path = require("node:path");
const toml = require("smol-toml");

const configFilePath = path.join(process.cwd(), ".codeshift.config.toml");

const defaultConfig = `[settings]
baseUrl="xxxxxxxxxxxxxxxxxx"
apiKey="sk-xxxxxxxxxxx"
outputFile="xxxxxxxxxxx"
model="xxxxxxxxxxxx"
tokenUsage=false
stream=true
`;

let parsedConfig;

try {
  const fileContent = fs.readFileSync(configFilePath, "utf-8");
  parsedConfig = toml.parse(fileContent);
} catch (err) {
  // If config file is missing, create it
  if (err.code == "ENOENT") {
    fs.writeFileSync(configFilePath, defaultConfig);
    console.error(
      "Existing config not found. Created .codeshift.config.toml. Please set config options.",
    );
    process.exit(1);
  } else {
    console.error(`error reading or parsing the config file: ${err.message}`);
    process.exit(1); // Exit with an error message if the file exists but is invalid
  }
}

module.exports = parsedConfig.settings;
