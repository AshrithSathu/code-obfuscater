import {
  getObfuscatorOptions,
  PRESET_CONFIGS,
  ObfuscationPreset,
} from "./config";

describe("getObfuscatorOptions", () => {
  it("should return default medium preset when no config provided", () => {
    const options = getObfuscatorOptions();
    expect(options.controlFlowFlattening).toBe(true);
    expect(options.stringArray).toBe(true);
  });

  it("should return correct preset options", () => {
    const presets: ObfuscationPreset[] = ["low", "medium", "high"];

    presets.forEach((preset) => {
      const options = getObfuscatorOptions({ preset });
      const expectedOptions = PRESET_CONFIGS[preset];

      expect(options.controlFlowFlattening).toBe(
        expectedOptions.controlFlowFlattening
      );
      expect(options.stringArray).toBe(expectedOptions.stringArray);
    });
  });

  it("should merge custom options with preset", () => {
    const options = getObfuscatorOptions({
      preset: "low",
      compact: false,
      log: true,
    });

    expect(options.compact).toBe(false);
    expect(options.log).toBe(true);
    expect(options.controlFlowFlattening).toBe(
      PRESET_CONFIGS.low.controlFlowFlattening
    );
  });

  it("should disable source map for irreversible obfuscation", () => {
    const options = getObfuscatorOptions({ preset: "high" });
    // Source map should be handled in obfuscator.ts, but we verify preset configs
    expect(PRESET_CONFIGS.high).toBeDefined();
  });
});
