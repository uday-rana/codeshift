const fsPromises = require("node:fs/promises");
const writeOutput = require("../../src/writeOutput");
jest.mock("node:fs/promises");

describe("writeOutput() function", () => {
  const outputFilePath = "output.txt";
  test("Should write response to file if outputFilePath is provided", async () => {
    const completion = {
      choices: [{ message: { content: "Generated content" } }],
    };

    await writeOutput(completion, outputFilePath, false, false);

    expect(fsPromises.writeFile).toHaveBeenCalledWith(
      outputFilePath,
      completion.choices[0].message.content,
    );
  });

  test("Should write response to stdout if no outputFilePath is provided", async () => {
    const completion = {
      choices: [{ message: { content: "Generated content" } }],
    };

    const stdoutSpy = jest.spyOn(process.stdout, "write").mockImplementation();

    await writeOutput(completion, undefined, false, false);

    expect(process.stdout.write).toHaveBeenCalledWith(
      completion.choices[0].message.content,
    );

    stdoutSpy.mockRestore();
  });

  test("Should write response to file in chunks when response is a stream", async () => {
    const completion = [
      { choices: [{ delta: { content: "Chunk 1" } }] },
      { choices: [{ delta: { content: "Chunk 2" } }] },
    ];

    fsPromises.appendFile.mockResolvedValue();

    await writeOutput(completion, outputFilePath, false, true);

    expect(fsPromises.appendFile).toHaveBeenCalledTimes(3);
    expect(fsPromises.appendFile).toHaveBeenCalledWith(
      outputFilePath,
      "Chunk 1",
    );
    expect(fsPromises.appendFile).toHaveBeenCalledWith(
      outputFilePath,
      "Chunk 2",
    );
    expect(fsPromises.appendFile).toHaveBeenCalledWith(outputFilePath, "\n");
  });

  test("Should write response to stdout in chunks when response is a stream", async () => {
    const completion = [
      { choices: [{ delta: { content: "Chunk 1" } }] },
      { choices: [{ delta: { content: "Chunk 2" } }] },
    ];

    const stdoutSpy = jest.spyOn(process.stdout, "write").mockImplementation();

    await writeOutput(completion, undefined, false, true);

    expect(process.stdout.write).toHaveBeenCalledTimes(3);
    expect(process.stdout.write).toHaveBeenCalledWith(
      completion[0].choices[0].delta.content,
    );
    expect(process.stdout.write).toHaveBeenCalledWith(
      completion[1].choices[0].delta.content,
    );
    expect(process.stdout.write).toHaveBeenCalledWith("\n");

    stdoutSpy.mockRestore();
  });

  test("Should output token usage if requested and response is a stream", async () => {
    const completion = [
      {
        choices: [{ delta: { content: "Content chunk 1" } }],
        usage: { prompt_tokens: 5, completion_tokens: 10, total_tokens: 15 },
      },
      {
        choices: [{ delta: { content: "Content chunk 2" } }],
        usage: { prompt_tokens: 3, completion_tokens: 7, total_tokens: 10 },
      },
    ];

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    await writeOutput(completion, outputFilePath, true, true);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `\nToken Usage Report:\n`,
      `Prompt tokens: 8\n`,
      `Completion tokens: 17\n`,
      `Total tokens: 25`,
    );

    consoleErrorSpy.mockRestore();
  });

  test("Should output token usage if requested and response is not a stream", async () => {
    const completion = {
      choices: [{ message: { content: "Generated content" } }],
      usage: { prompt_tokens: 5, completion_tokens: 10, total_tokens: 15 },
    };

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    await writeOutput(completion, outputFilePath, true, false);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `\nToken Usage Report:\n`,
      `Prompt tokens: 5\n`,
      `Completion tokens: 10\n`,
      `Total tokens: 15`,
    );

    consoleErrorSpy.mockRestore();
  });

  test("Should output error if token usage requested but not returned in response", async () => {
    const completion = {
      choices: [{ message: { content: "Generated content" } }],
    };

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    await writeOutput(completion, outputFilePath, true, false);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `\n No token usage data returned by model.`,
    );

    consoleErrorSpy.mockRestore();
  });

  test("Should throw if error occurs reading response stream", async () => {
    const errorCompletion = (async function* () {
      yield new Error("Stream error");
    })();

    const exitSpy = jest.spyOn(process, "exit").mockImplementation();

    await writeOutput(errorCompletion, "output.txt", true, true);

    expect(exitSpy).toHaveBeenCalledWith(1);

    exitSpy.mockRestore();
  });

  test("Should handle Groq-specific token usage format in stream response", async () => {
    const completion = [
      {
        choices: [{ delta: { content: "Content chunk" } }],
        x_groq: {
          usage: { prompt_tokens: 5, completion_tokens: 10, total_tokens: 15 },
        },
      },
    ];

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    await writeOutput(completion, outputFilePath, true, true);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `\nToken Usage Report:\n`,
      `Prompt tokens: 5\n`,
      `Completion tokens: 10\n`,
      `Total tokens: 15`,
    );

    consoleErrorSpy.mockRestore();
  });

  test("Should handle empty content in stream response chunks", async () => {
    const completion = [
      { choices: [{ delta: {} }] },
      { choices: [{ delta: { content: "Valid content" } }] },
      { choices: [{ delta: { content: "" } }] },
    ];

    const stdoutSpy = jest.spyOn(process.stdout, "write").mockImplementation();

    await writeOutput(completion, undefined, false, true);

    expect(process.stdout.write).toHaveBeenCalledTimes(4);
    expect(process.stdout.write).toHaveBeenCalledWith(""); // First empty chunk
    expect(process.stdout.write).toHaveBeenCalledWith("Valid content");
    expect(process.stdout.write).toHaveBeenCalledWith(""); // Third empty chunk
    expect(process.stdout.write).toHaveBeenCalledWith("\n");

    stdoutSpy.mockRestore();
  });
});
