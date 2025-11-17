import JavaScriptObfuscator from "javascript-obfuscator";
import { ObfuscatorOptions } from "javascript-obfuscator";
import { getObfuscatorOptions, ObfuscatorConfig } from "./config";

export interface ObfuscateResult {
  obfuscatedCode: string;
  sourceMap?: string;
}

/**
 * Obfuscates JavaScript code with irreversible transformations
 * @param code - The JavaScript code to obfuscate
 * @param config - Obfuscation configuration
 * @returns Obfuscated code and optional source map
 */
export function obfuscate(
  code: string,
  config: ObfuscatorConfig = {}
): ObfuscateResult {
  const baseOptions = getObfuscatorOptions(config);

  // Ensure source map is disabled for production (irreversible obfuscation)
  const options: ObfuscatorOptions = {
    ...baseOptions,
    sourceMap: false,
  };

  const obfuscationResult = JavaScriptObfuscator.obfuscate(code, options);

  return {
    obfuscatedCode: obfuscationResult.getObfuscatedCode(),
    sourceMap: obfuscationResult.getSourceMap(),
  };
}

/**
 * Obfuscates JavaScript code from a file
 * @param filePath - Path to the JavaScript file
 * @param config - Obfuscation configuration
 * @returns Obfuscated code and optional source map
 */
export async function obfuscateFile(
  filePath: string,
  config: ObfuscatorConfig = {}
): Promise<ObfuscateResult> {
  const fs = await import("fs/promises");
  const code = await fs.readFile(filePath, "utf-8");
  return obfuscate(code, config);
}
