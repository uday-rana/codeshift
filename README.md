# codeshift

Command-line tool that transforms source code files into any language.

![Made with VHS](https://vhs.charm.sh/vhs-3WycnrVtNVBvM390BxtKUc.gif)

## Features

- Accepts multiple file input
- Streams output to `stdout`
- Can choose output language
- Can specify file path to write output to file

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

- `<output-language>`: The desired language to convert source files to
- `<input-files...>`: Paths to the source files, separated by spaces
