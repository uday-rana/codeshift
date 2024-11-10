const fs = require("node:fs/promises");
const loadConfig = require("../../src/loadConfig");

jest.mock("node:fs/promises");

describe("loadConfig() function", () => {
  const configData = `[settings]
output="output.go"
tokenUsage=true
streamResponse=false
`;

  test("Should parse data correctly when in TOML format", async () => {
    fs.readFile.mockResolvedValueOnce(configData);

    const parsedSettings = await loadConfig();
    expect(parsedSettings).toEqual({
      output: "output.go",
      tokenUsage: true,
      streamResponse: false,
    });
  });

  test("Should call process.exit() when data is incorrectly formatted", async () => {
    fs.readFile.mockResolvedValueOnce("bad data");

    const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {});

    await loadConfig();
    expect(exitSpy).toHaveBeenCalledWith(1);

    exitSpy.mockRestore();
  });

  test("Should return undefined when file is not found", async () => {
    fs.readFile.mockRejectedValueOnce({ code: "ENOENT" });

    const result = await loadConfig();

    expect(result).toBeUndefined();
  });
});
