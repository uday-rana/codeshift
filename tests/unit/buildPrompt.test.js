const fs = require("node:fs/promises");
const buildPrompt = require("../../src/buildPrompt");

jest.mock("node:fs/promises");

describe("buildPrompt() function", () => {
  const inputFiles = ["file1.js", "file2.js"];
  const fileContents = ["const a = 1;", "const b = 2;"];
  const expectedPrompt = `Convert the following source code files to TypeScript. \
Do not include any sentences in your response. Your response must consist entirely of the requested code. Do not use backticks (\`) to enclose the code in your response.\
\n\n\
file1.js:\
\n\`\`\`\n\
const a = 1;\
\`\`\`\n\
file2.js:\
\n\`\`\`\n\
const b = 2;\
\`\`\`\n\
`;
  test("Should build prompt correctly when files are read successfully", async () => {
    fs.readFile
      .mockResolvedValueOnce(fileContents[0])
      .mockResolvedValueOnce(fileContents[1]);

    const result = await buildPrompt("TypeScript", inputFiles);
    expect(result).toBe(expectedPrompt);
  });

  test("Should call process.exit() when a file cannot be read", async () => {
    fs.readFile.mockRejectedValueOnce(new Error("File read error"));
    const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {});

    await buildPrompt("TypeScript", inputFiles);
    expect(exitSpy).toHaveBeenCalledWith(21);

    exitSpy.mockRestore();
  });
});
