describe("Model selection", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("Should return model from env var if provider supported", () => {
    jest.mock("../../src/config", () => ({
      baseUrl: "https://openrouter.ai/api/v1",
      model: "someCustomModel",
    }));

    const model = require("../../src/model");

    expect(model).toBe("someCustomModel");
  });

  test("Should return model from env var if provider not supported", () => {
    jest.mock("../../src/config", () => ({
      baseUrl: "someUnsupportedProvider",
      model: "someCustomModel",
    }));

    const model = require("../../src/model");

    expect(model).toBe("someCustomModel");
  });

  test("Should return default model if model env var not set but provider supported", () => {
    jest.mock("../../src/config", () => ({
      baseUrl: "https://openrouter.ai/api/v1",
    }));

    const model = require("../../src/model");

    expect(model).toBe("meta-llama/llama-3-8b-instruct:free");
  });

  test("Should throw if model env var not set and provider not supported", () => {
    jest.mock("../../src/config", () => ({
      baseUrl: "someUnsupportedProvider",
    }));

    expect(() => {
      require("../../src/model");
    }).toThrow();
  });
});
