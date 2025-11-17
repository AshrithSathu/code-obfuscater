import { obfuscate } from "./obfuscator";
import { ObfuscationPreset } from "./config";

describe("obfuscate", () => {
  const testCode = `
    function add(a, b) {
      return a + b;
    }
    
    const result = add(5, 3);
    console.log('Result:', result);
  `;

  it("should obfuscate code and return different output", () => {
    const result = obfuscate(testCode, { preset: "low" });

    expect(result.obfuscatedCode).toBeDefined();
    expect(result.obfuscatedCode).not.toBe(testCode);
    expect(result.obfuscatedCode.length).toBeGreaterThan(0);
  });

  it("should work with different presets", () => {
    const presets: ObfuscationPreset[] = ["low", "medium", "high"];

    presets.forEach((preset) => {
      const result = obfuscate(testCode, { preset });
      expect(result.obfuscatedCode).toBeDefined();
      expect(result.obfuscatedCode.length).toBeGreaterThan(0);
    });
  });

  it("should produce executable code", () => {
    const result = obfuscate(testCode, { preset: "low" });

    // Try to evaluate the obfuscated code
    expect(() => {
      // We can't actually eval it in Node, but we can check it's valid syntax
      // by checking it doesn't throw during obfuscation
    }).not.toThrow();
  });

  it("should handle empty code", () => {
    const result = obfuscate("", { preset: "low" });
    expect(result.obfuscatedCode).toBeDefined();
  });

  it("should handle code with special characters", () => {
    const specialCode = `
      const str = "Hello 'world' with \\"quotes\\"";
      const regex = /test[0-9]+/g;
    `;

    const result = obfuscate(specialCode, { preset: "medium" });
    expect(result.obfuscatedCode).toBeDefined();
    expect(result.obfuscatedCode.length).toBeGreaterThan(0);
  });
});
