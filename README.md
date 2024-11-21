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

- Run `npm install -g @uday-rana/codeshift`.

- Run `npx codeshift`. This will generate a `.codeshift.config.toml` file in your current directory.

- In `.codeshift.config.toml`, set the base URL for your preferred provider and add your API key. It should look something like this:

  ```toml
  # .codeshift.config.toml

  [settings]
  baseUrl="https://openrouter.ai/api/v1"
  apiKey="sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  outputFile="xxxxxxxxxxx"
  model=""
  tokenUsage=true
  stream=true
  ```

  - The following base URLs are supported. Others may be used but are not supported and may cause errors:
    - OpenAI: `https://api.openai.com/v1`
    - OpenRouter: `https://openrouter.ai/api/v1`
    - Groq: `https://api.groq.com/openai/v1`.
  - For a list of models for supported providers, see:
    - [OpenAI models](https://platform.openai.com/docs/models)
    - [OpenRouter models](https://openrouter.ai/models)
    - [Groq models](https://console.groq.com/docs/models)

## Usage

```bash
npx codeshift [options] <output-language> <input-files...>
```

### Arguments

- `<output-language>`: The desired language to convert source files to
- `<input-files...>`: Paths to the source files, separated by spaces

### Options

- `-o, --output-file`: Specify filename to write output to
- `-t, --token-usage`: Display the number of tokens used by the AI for processing
- `-s, --stream`: Stream the response from the LLM.
- `-h, --help`: Display the help message explaining usage, options, and arguments
- `-v, --version`: Display the program name and version number

### Example

```bash
# Converts a JavaScript file (index.js) to Go, saving the output in index.go
npx codeshift -o index.go go examples/index.js
```

![codeshift file output demo](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tqlkq2d1495e6qps5wz3.gif)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.
