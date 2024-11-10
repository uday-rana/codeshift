describe("Model selection", () => {
  let model;

  beforeEach(() => {
    jest.resetModules();
    delete process.env.BASE_URL;
    delete process.env.MODEL;
  });

  test("Should return model from env var if provider supported", () => {
    process.env.BASE_URL = "https://openrouter.ai/api/v1";
    process.env.MODEL = "someCustomModel";
    model = require("../../src/model");

    expect(model).toBe("someCustomModel");
  });

  test("Should return model from env var if provider not supported", () => {
    process.env.BASE_URL = "someUnsupportedProvider";
    process.env.MODEL = "someCustomModel";
    model = require("../../src/model");

    expect(model).toBe("someCustomModel");
  });

  test("Should return default model if model env var not set but provider supported", () => {
    process.env.BASE_URL = "https://openrouter.ai/api/v1";

    model = require("../../src/model");

    expect(model).toBe("meta-llama/llama-3-8b-instruct:free");
  });

  test("Should throw if model env var not set and provider not supported", () => {
    process.env.BASE_URL = "someUnsupportedProvider";

    expect(() => {
      require("../../src/model");
    }).toThrow();
  });
});
