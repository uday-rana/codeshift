# codeshift

Command-line tool that transforms source code files into any language.

## Features

- Accepts multiple input files
- Can output to specified file
- Streams responses to `stdout`
- Evaluates source files individually (Does not support shared context... yet)

## Installation

- Install [Node.js](https://nodejs.org/en)
- Get a [Groq API key](https://console.groq.com/keys)
- Clone repo with [Git](https://git-scm.com/) or download as a .zip
- Within the repo directory containing `package.json`, run `npm install`
  - (Optional) Run `npm install -g .` to install the package globally (to let you run it without prefixing `node`)
- Create a file called `.env` and add your Groq API key: `GROQ_API_KEY=API_KEY_HERE`

## Usage

`codeshift [-o <output-filename>] <output-language> <input-files...>`

Example: `codeshift -o index.ts typescript examples\index.js`

### Options

- `-o, --output`: Specify filename to write output to
- `-h, --help`: Display help for a command
- `-v, --version`: Output the version number

### Arguments

- `<output-language>`: The desired language to convert source files to.
- `<input-files...>`: Paths to the source files, separated by spaces
