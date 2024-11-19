# codeshift

Codeshift is a command-line tool to translate and transform source code files between programming languages.

![codeshift tool demo: translating an express.js server to rust](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/1bphaoatr4iig56ac2z4.gif)

## Features

- Select output language to convert source code into
- Support for multiple input files
- Output results to a file or stream directly to `stdout`
- Customize model and provider selection for optimal performance
- Supports leading AI providers:
  - [OpenAI](https://platform.openai.com/)
  - [OpenRouter](https://openrouter.ai/)
  - [Groq](https://console.groq.com/docs/quickstart)

## Requirements

- [Node.js](https://nodejs.org/en) (Requires Node.js 20.17.0+)
- An API key from any of the following providers:
  - [OpenAI](https://platform.openai.com/)
  - [OpenRouter](https://openrouter.ai/)
  - [Groq](https://console.groq.com/docs/quickstart)
  - any other AI provider compatible with OpenAI's chat completions API endpoint

## Installation

- Clone the repository with [Git](https://git-scm.com/):

  ```bash
  git clone https://github.com/uday-rana/codeshift.git
  ```

  - Alternatively, download the repository as a .zip from the GitHub page and extract it

- In the repository's root directory (where `package.json` is located), run `npm install`:

  ```bash
  cd codeshift/
  npm install
  ```

- To be able to run the program without prefixing `node`, run `npm install -g .` or `npm link` within the project directory:

  ```bash
  npm install -g .
  ```

- Create a file called `.env` by copying the `.env.example` file

- Add your API key, preferred base URL, and preferred model. It should look similar to the example below:

  - For OpenAI, use the base URL `https://api.openai.com/v1`
  - For OpenRouter, use the base URL `https://openrouter.ai/api/v1`
  - For Groq, use the base URL `https://api.groq.com/openai/v1`.
  - For a list of models for each provider, see:

    - [OpenAI models](https://platform.openai.com/docs/models)
    - [OpenRouter models](https://openrouter.ai/models)
    - [Groq models](https://console.groq.com/docs/models)

    ```bash
    # .env

    API_KEY=YOUR_API_KEY_HERE
    BASE_URL=https://api.groq.com/openai/v1
    MODEL=llama3-8b-8192
    ```

## Usage

```bash
codeshift [options] <output-language> <input-files...>
```

### Arguments

- `<output-language>`: The desired language to convert source files to
- `<input-files...>`: Paths to the source files, separated by spaces

### Options

- `-o, --output`: Specify filename to write output to
- `-t, --token-usage`: Display the number of tokens used by the AI for processing
- `-h, --help`: Display the help message explaining usage, options, and arguments
- `-v, --version`: Display the program name and version number

### Example

```bash
# Converts a JavaScript file (index.js) to Go, saving the output in index.go
codeshift -o index.go go examples/index.js
```

![codeshift file output demo](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tqlkq2d1495e6qps5wz3.gif)

## Configuration File

Certain options can be set in a TOML file located in your home directory: `~/.codeshift.toml`. Supported options are:

- `--output`
- `--token-usage`

### Example

```toml
[settings]
output="output.go"
tokenUsage=true
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.
