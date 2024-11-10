const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const toml = require("smol-toml");

const homeDir = os.homedir();
const configFilePath = path.join(homeDir, ".codeshift.toml");

/**
 * Loads the user configuration from a TOML file located in the home directory.
 *
 * This function attempts to read and parse a `.codeshift.toml` configuration file.
 * If the file exists and is valid, it returns the settings object. If the file is missing,
 * it fails silently. If an error occurs while reading or parsing the file, the process
 * terminates with an error message and exit code 1.
 *
 * @async
 * @function loadConfig
 * @returns {Promise<Object|undefined>} - A Promise that resolves to the `settings` object from the TOML file,
 * or `undefined` if the file is not found.
 * @throws Will terminate the process with exit code 1 if the config file exists but cannot be read or parsed.
 */
async function loadConfig() {
  try {
    const fileContent = await fs.readFile(configFilePath, "utf-8");
    const parsedConfig = toml.parse(fileContent);
    return parsedConfig.settings;
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error(
        `Error reading or parsing the TOML config file: ${err.message}`,
      );
      process.exit(1); // Exit with an error message if the file exists but is invalid
    }
  }
}

module.exports = loadConfig;
