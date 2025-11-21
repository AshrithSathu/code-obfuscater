# code-obfuscater

A powerful JavaScript code obfuscator for production builds with irreversible transformations. This package helps protect your JavaScript code by making it extremely difficult to reverse engineer while maintaining full functionality.

[![npm version](https://img.shields.io/npm/v/code-obfuscater.svg)](https://www.npmjs.com/package/code-obfuscater)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

🔗 **GitHub Repository**: [https://github.com/ashrithsathu/code-obfuscater](https://github.com/ashrithsathu/code-obfuscater)

## Features

- **Irreversible Obfuscation**: Multiple layers of obfuscation that make code extremely difficult to reverse
- **Multiple Presets**: Choose from low, medium, or high obfuscation levels
- **Flexible Input**: Support for single files, directories, or glob patterns
- **CLI & API**: Use as a command-line tool or import as a library
- **Production Ready**: Obfuscated code maintains full functionality
- **Configurable**: Customize obfuscation via CLI flags or config files

## Installation

Install as a development dependency:

```bash
# Using pnpm (recommended)
pnpm add -D code-obfuscater

# Using npm
npm install --save-dev code-obfuscater

# Using yarn
yarn add -D code-obfuscater
```

## Quick Start

### Method 1: Using npx (No Installation Required)

You can use the package directly without installing it:

```bash
# Obfuscate a single file
npx code-obfuscater obfuscate dist/bundle.js -o dist/bundle.obfuscated.js

# Obfuscate with high security preset
npx code-obfuscater obfuscate dist/bundle.js -p high -o dist/bundle.obfuscated.js
```

### Method 2: Install and Use CLI

After installation, you can use it in your `package.json` scripts:

```json
{
  "scripts": {
    "build": "webpack",
    "obfuscate": "code-obfuscater obfuscate dist/**/*.js -o dist-obfuscated",
    "build:prod": "npm run build && npm run obfuscate"
  }
}
```

Then run:

```bash
npm run obfuscate
```

### Method 3: Use as a Library

Import and use in your code:

```javascript
const { obfuscate } = require("code-obfuscater");
// or
import { obfuscate } from "code-obfuscater";
```

## Usage

### CLI Usage

#### Basic Usage

Obfuscate a single file:

```bash
# Using npx (recommended for one-time use)
npx code-obfuscater obfuscate dist/bundle.js

# Or if installed locally
code-obfuscater obfuscate dist/bundle.js
```

Obfuscate multiple files with glob pattern:

```bash
npx code-obfuscater obfuscate "dist/**/*.js" -o dist-obfuscated
```

#### Options

- `-o, --output <path>`: Output directory or file path
- `-p, --preset <preset>`: Obfuscation preset (`low`, `medium`, `high`) - default: `medium`
- `-c, --config <path>`: Path to configuration file (JSON)
- `--in-place`: Replace input files in place
- `--exclude <pattern>`: Glob pattern to exclude files

#### Examples

**Obfuscate with high preset:**

```bash
npx code-obfuscater obfuscate dist/bundle.js -p high -o dist/bundle.obfuscated.js
```

**Obfuscate entire directory:**

```bash
npx code-obfuscater obfuscate "dist/**/*.js" -o dist-obfuscated
```

**Obfuscate in place:**

```bash
npx code-obfuscater obfuscate dist/bundle.js --in-place
```

**Using a config file:**

```bash
npx code-obfuscater obfuscate dist/bundle.js -c obfuscator.config.json
```

### Programmatic Usage

```typescript
import { obfuscate, obfuscateFile } from "code-obfuscater";

// Obfuscate code string
const code = `
  function add(a, b) {
    return a + b;
  }
`;

const result = obfuscate(code, { preset: "high" });
console.log(result.obfuscatedCode);

// Obfuscate file
const fileResult = await obfuscateFile("./dist/bundle.js", {
  preset: "medium",
});
```

### Configuration

#### Presets

- **low**: Basic obfuscation with minimal performance impact
- **medium**: Balanced obfuscation (default) - good protection with reasonable performance
- **high**: Maximum obfuscation - strongest protection, may impact performance

#### Custom Configuration

Create a JSON config file (`obfuscator.config.json`):

```json
{
  "preset": "high",
  "compact": true,
  "controlFlowFlattening": true,
  "controlFlowFlatteningThreshold": 0.75,
  "deadCodeInjection": true,
  "deadCodeInjectionThreshold": 0.6,
  "debugProtection": true,
  "debugProtectionInterval": 2000,
  "disableConsoleOutput": true,
  "stringArray": true,
  "stringArrayEncoding": ["base64", "rc4"],
  "stringArrayThreshold": 0.75,
  "transformObjectKeys": true,
  "unicodeEscapeSequence": true
}
```

## Obfuscation Techniques

The package uses multiple obfuscation techniques:

- **Variable/Function Name Mangling**: Replaces meaningful names with random identifiers
- **String Encoding**: Encodes strings using base64, rc4, or other methods
- **Control Flow Flattening**: Restructures control flow to make it harder to follow
- **Dead Code Injection**: Adds non-functional code to confuse reverse engineers
- **Self-Defending Code**: Protects against debugging and tampering
- **Object Key Transformation**: Obfuscates object property names
- **Array/String Shuffling**: Randomizes array and string order

## Real-World Examples

### Example 1: Obfuscate React/Vue Build Output

After building your app, obfuscate the production bundle:

```bash
# Build your app first
npm run build

# Then obfuscate the output
npx code-obfuscater obfuscate "dist/**/*.js" -p high -o dist-obfuscated

# Or replace in place
npx code-obfuscater obfuscate "dist/**/*.js" --in-place
```

### Example 2: Obfuscate Node.js Backend Code

```bash
# Obfuscate all JS files in your server directory
npx code-obfuscater obfuscate "server/**/*.js" -o server-obfuscated

# Exclude test files
npx code-obfuscater obfuscate "server/**/*.js" --exclude "**/*.test.js" -o server-obfuscated
```

### Example 3: Integration with Build Pipeline

Add to your `package.json`:

```json
{
  "scripts": {
    "build": "webpack --mode production",
    "obfuscate": "code-obfuscater obfuscate dist/**/*.js -p high -o dist",
    "build:prod": "npm run build && npm run obfuscate"
  }
}
```

Then run:

```bash
npm run build:prod
```

### Example 4: Using in CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
- name: Build application
  run: npm run build

- name: Obfuscate code
  run: npx code-obfuscater obfuscate dist/**/*.js -p high -o dist

- name: Deploy
  run: # your deployment command
```

### Example 5: Programmatic Usage in Build Script

Create `scripts/obfuscate.js`:

```javascript
const { obfuscateFile } = require("code-obfuscater");
const fs = require("fs").promises;
const path = require("path");

async function obfuscateBuild() {
  const buildDir = path.join(__dirname, "../dist");
  const files = await fs.readdir(buildDir);

  for (const file of files) {
    if (file.endsWith(".js")) {
      const filePath = path.join(buildDir, file);
      const result = await obfuscateFile(filePath, { preset: "high" });
      await fs.writeFile(filePath, result.obfuscatedCode);
      console.log(`Obfuscated ${file}`);
    }
  }
}

obfuscateBuild().catch(console.error);
```

Run it:

```bash
node scripts/obfuscate.js
```

### With Webpack

```javascript
// webpack.config.js
const { obfuscate } = require("code-obfuscater");

module.exports = {
  // ... your config
  plugins: [
    // ... other plugins
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap("ObfuscatePlugin", async (compilation) => {
          // Obfuscate output files
        });
      },
    },
  ],
};
```

## How is this different from javascript-obfuscator?

`code-obfuscater` is built on top of `javascript-obfuscator` and provides a simplified, production-focused wrapper with better developer experience:

### Key Differences

**1. Built-in CLI Tool**

- `javascript-obfuscator`: Library only, requires custom CLI setup
- `code-obfuscater`: Includes ready-to-use CLI with intuitive commands

**2. Preset Configurations**

- `javascript-obfuscator`: Manual configuration of all options
- `code-obfuscater`: Pre-configured presets (low/medium/high) for quick setup

**3. File Handling**

- `javascript-obfuscator`: Works with code strings, requires manual file I/O
- `code-obfuscater`: Built-in support for files, directories, and glob patterns

**4. Production Defaults**

- `javascript-obfuscator`: Source maps enabled by default
- `code-obfuscater`: Source maps disabled by default for irreversible obfuscation

**5. Developer Experience**

- `javascript-obfuscator`: More configuration options, steeper learning curve
- `code-obfuscater`: Simpler API, faster to get started, better for build pipelines

### When to Use Each

**Use `code-obfuscater` if:**

- You want a simple CLI tool for production builds
- You prefer preset configurations over manual setup
- You need to obfuscate multiple files or directories
- You want production-ready defaults out of the box

**Use `javascript-obfuscator` directly if:**

- You need fine-grained control over every obfuscation option
- You're building a custom obfuscation tool
- You need source maps for debugging
- You want to integrate with specific build tools that have plugins

## Requirements

- Node.js >= 16.0.0
- pnpm (recommended) or npm/yarn

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Security Note

While this package provides strong obfuscation, no obfuscation is 100% secure. Determined attackers with enough time and resources may still be able to reverse engineer obfuscated code. Use obfuscation as one layer of your security strategy, not the only one.
