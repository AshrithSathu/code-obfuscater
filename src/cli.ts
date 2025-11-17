#!/usr/bin/env node

import { Command } from "commander";
import { glob } from "glob";
import { promises as fs } from "fs";
import path from "path";
import { obfuscateFile } from "./obfuscator";
import { ObfuscatorConfig, ObfuscationPreset } from "./config";

const program = new Command();

program
  .name("code-obfuscater")
  .description(
    "Obfuscate JavaScript code for production with irreversible transformations"
  )
  .version("1.0.0");

program
  .command("obfuscate")
  .description("Obfuscate JavaScript file(s)")
  .argument("<input>", "Input file, directory, or glob pattern")
  .option("-o, --output <path>", "Output directory or file path")
  .option(
    "-p, --preset <preset>",
    "Obfuscation preset: low, medium, high",
    "medium"
  )
  .option("-c, --config <path>", "Path to configuration file (JSON)")
  .option("--in-place", "Replace input files in place")
  .option("--exclude <pattern>", "Glob pattern to exclude files", "")
  .action(async (input: string, options) => {
    try {
      let config: ObfuscatorConfig = {};

      // Load config file if provided
      if (options.config) {
        const configPath = path.resolve(options.config);
        const configContent = await fs.readFile(configPath, "utf-8");
        config = JSON.parse(configContent);
      }

      // Set preset from CLI option
      if (options.preset) {
        config.preset = options.preset as ObfuscationPreset;
      }

      // Find all matching files
      const files = await glob(input, {
        ignore: options.exclude ? [options.exclude] : [],
        absolute: true,
      });

      if (files.length === 0) {
        console.error(`No files found matching pattern: ${input}`);
        process.exit(1);
      }

      console.log(`Found ${files.length} file(s) to obfuscate...`);

      // Process each file
      for (const filePath of files) {
        try {
          const result = await obfuscateFile(filePath, config);

          let outputPath: string;

          if (options.inPlace) {
            outputPath = filePath;
          } else if (options.output) {
            const inputRelative = path.relative(process.cwd(), filePath);
            const outputDir = path.resolve(options.output);

            // Check if output is a directory or file
            const outputStat = await fs.stat(options.output).catch(() => null);

            if (outputStat?.isDirectory()) {
              outputPath = path.join(outputDir, path.basename(filePath));
            } else if (files.length === 1) {
              outputPath = outputDir;
            } else {
              // Multiple files, preserve structure
              const dir = path.dirname(inputRelative);
              outputPath = path.join(outputDir, dir, path.basename(filePath));
            }
          } else {
            // Default: output to same directory with .obfuscated.js extension
            const ext = path.extname(filePath);
            const base = path.basename(filePath, ext);
            const dir = path.dirname(filePath);
            outputPath = path.join(dir, `${base}.obfuscated${ext}`);
          }

          // Ensure output directory exists
          const outputDir = path.dirname(outputPath);
          await fs.mkdir(outputDir, { recursive: true });

          // Write obfuscated code
          await fs.writeFile(outputPath, result.obfuscatedCode, "utf-8");

          console.log(
            `✓ Obfuscated: ${path.relative(
              process.cwd(),
              filePath
            )} -> ${path.relative(process.cwd(), outputPath)}`
          );
        } catch (error) {
          console.error(
            `✗ Error obfuscating ${filePath}:`,
            error instanceof Error ? error.message : error
          );
        }
      }

      console.log(`\nSuccessfully obfuscated ${files.length} file(s)!`);
    } catch (error) {
      console.error("Error:", error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse();
