# codeshift

Command-line tool that transforms source code files into any language.

![codeshift tool demo: translating an express.js server to rust](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/1bphaoatr4iig56ac2z4.gif)

## Features

- Accepts multiple input files
- Streams output to `stdout`
- Can choose output language
- Can specify file path to write output to file
- Can use custom API key in `.env`

## Installation

- Install [Node.js](https://nodejs.org/en)
- Get a [Groq API key](https://console.groq.com/docs/quickstart)
- Clone repo with [Git](https://git-scm.com/) or download as a .zip
- Within the repo directory containing `package.json`, run `npm install`
- To run the program without prefixing `node`, within the project directory, run `npm install -g .` or `npm link`
- Create a file called `.env` and add your Groq API key: `GROQ_API_KEY=API_KEY_HERE`

## Usage

```bash
codeshift [-o <output-filename>] <output-language> <input-files...>
```

### Example

```bash
codeshift -o index.go go examples/index.js
```

![codeshift file output demo](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tqlkq2d1495e6qps5wz3.gif)

### Options

- `-o, --output`: Specify filename to write output to
- `-h, --help`: Display help for a command
- `-v, --version`: Output the version number
- `-t, --token-usage`: Output the number of tokens used

### Arguments

- `<output-language>`: The desired language to convert source files to
- `<input-files...>`: Paths to the source files, separated by spaces
