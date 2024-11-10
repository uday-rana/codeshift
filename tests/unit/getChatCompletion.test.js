const getChatCompletion = require("../../src/getChatCompletion");

// Mock before importing so the OpenAI client doesn't get instantiated
jest.mock("../../src/openaiClient", () => ({
  chat: {
    completions: {
      create: jest.fn(),
    },
  },
}));

const openai = require("../../src/openaiClient");

describe("getChatCompletion() function", () => {
  const prompt = `Convert the following source code files to C++. \
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
  const model = "gpt-3.5-turbo";
  const streamResponse = false;

  it("Should call openai.chat.completions.create with correct parameters", async () => {
    openai.chat.completions.create.mockResolvedValue({
      choices: [{ message: { content: "Converted code" } }],
    });

    const result = await getChatCompletion(prompt, model, streamResponse);

    expect(openai.chat.completions.create).toHaveBeenCalledWith({
      messages: [
        {
          role: "system",
          content:
            "You will receive source code files and must convert them to the desired language.",
        },
        { role: "user", content: prompt },
      ],
      model: model,
      max_tokens: 1024,
      stream: streamResponse,
      stream_options: { include_usage: true },
    });

    expect(result.choices[0].message.content).toEqual("Converted code");
  });

  test("Should throw an error if the API call fails", async () => {
    openai.chat.completions.create.mockRejectedValue(new Error("API error"));

    await expect(getChatCompletion(prompt, model, false)).rejects.toThrow(
      "API error",
    );
  });
});
