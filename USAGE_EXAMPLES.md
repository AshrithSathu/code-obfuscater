# Usage Examples for npm Users

This document provides practical examples of how to use `code-obfuscater` after installing it from npm.

## Installation

```bash
npm install --save-dev code-obfuscater
# or
pnpm add -D code-obfuscater
# or
yarn add -D code-obfuscater
```

## Scenario 1: Obfuscate a Single Build File

**Use case:** You have a single bundled JavaScript file and want to obfuscate it before deployment.

```bash
# Basic usage - creates test.js.obfuscated.js
npx code-obfuscater obfuscate dist/bundle.js

# Specify output file
npx code-obfuscater obfuscate dist/bundle.js -o dist/bundle.obfuscated.js

# High security preset
npx code-obfuscater obfuscate dist/bundle.js -p high -o dist/bundle.obfuscated.js

# Replace original file
npx code-obfuscater obfuscate dist/bundle.js --in-place
```

## Scenario 2: Obfuscate Multiple Files in a Directory

**Use case:** Your build outputs multiple JavaScript files and you want to obfuscate all of them.

```bash
# Obfuscate all JS files in dist folder
npx code-obfuscater obfuscate "dist/**/*.js" -o dist-obfuscated

# Obfuscate and replace in place
npx code-obfuscater obfuscate "dist/**/*.js" --in-place

# Exclude certain files (e.g., vendor libraries)
npx code-obfuscater obfuscate "dist/**/*.js" --exclude "**/vendor/**" -o dist-obfuscated
```

## Scenario 3: Add to Build Script

**Use case:** Automate obfuscation as part of your build process.

Add to `package.json`:

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

## Scenario 4: Use Custom Configuration

**Use case:** You need fine-grained control over obfuscation settings.

1. Create `obfuscator.config.json`:

```json
{
  "preset": "high",
  "compact": true,
  "controlFlowFlattening": true,
  "controlFlowFlatteningThreshold": 0.75,
  "deadCodeInjection": true,
  "stringArrayEncoding": ["base64", "rc4"],
  "transformObjectKeys": true
}
```

2. Use it:

```bash
npx code-obfuscater obfuscate dist/bundle.js -c obfuscator.config.json -o dist/bundle.obfuscated.js
```

## Scenario 5: Programmatic Usage

**Use case:** You want to integrate obfuscation into a custom build script.

```javascript
// obfuscate-build.js
const { obfuscateFile } = require("code-obfuscater");
const fs = require("fs").promises;
const path = require("path");
const glob = require("glob");

async function obfuscateBuild() {
  const files = glob.sync("dist/**/*.js");

  for (const file of files) {
    console.log(`Obfuscating ${file}...`);
    const result = await obfuscateFile(file, {
      preset: "high",
    });

    // Replace original
    await fs.writeFile(file, result.obfuscatedCode);
    console.log(`✓ Done: ${file}`);
  }
}

obfuscateBuild().catch(console.error);
```

Run:

```bash
node obfuscate-build.js
```

## Scenario 6: Obfuscate Inline Code

**Use case:** You want to obfuscate code strings programmatically.

```javascript
const { obfuscate } = require("code-obfuscater");

const originalCode = `
  function calculatePrice(items) {
    let total = 0;
    for (const item of items) {
      total += item.price * item.quantity;
    }
    return total;
  }
`;

const result = obfuscate(originalCode, { preset: "high" });
console.log(result.obfuscatedCode);

// Save to file
const fs = require("fs");
fs.writeFileSync("obfuscated.js", result.obfuscatedCode);
```

## Scenario 7: CI/CD Integration

**Use case:** Automate obfuscation in your deployment pipeline.

### GitHub Actions Example

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Obfuscate code
        run: npx code-obfuscater obfuscate dist/**/*.js -p high -o dist

      - name: Deploy
        run: # your deployment command
```

## Scenario 8: React/Vue/Angular Build

**Use case:** Obfuscate a frontend framework build output.

```bash
# 1. Build your app
npm run build

# 2. Obfuscate the output
npx code-obfuscater obfuscate "dist/**/*.js" -p high -o dist

# Or add to package.json
```

```json
{
  "scripts": {
    "build": "react-scripts build",
    "obfuscate": "code-obfuscater obfuscate build/**/*.js -p high -o build",
    "build:prod": "npm run build && npm run obfuscate"
  }
}
```

## Scenario 9: Node.js Backend

**Use case:** Obfuscate server-side code.

```bash
# Obfuscate all server files except tests
npx code-obfuscater obfuscate "src/**/*.js" \
  --exclude "**/*.test.js" \
  --exclude "**/tests/**" \
  -o dist-obfuscated
```

## Scenario 10: Webpack Plugin Integration

**Use case:** Automatically obfuscate during webpack build.

```javascript
// webpack.config.js
const { obfuscate } = require("code-obfuscater");

class ObfuscatePlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync(
      "ObfuscatePlugin",
      (compilation, callback) => {
        const files = Object.keys(compilation.assets);

        files.forEach((filename) => {
          if (filename.endsWith(".js")) {
            const asset = compilation.assets[filename];
            const code = asset.source();
            const obfuscated = obfuscate(code, { preset: "high" });

            compilation.assets[filename] = {
              source: () => obfuscated.obfuscatedCode,
              size: () => obfuscated.obfuscatedCode.length,
            };
          }
        });

        callback();
      }
    );
  }
}

module.exports = {
  // ... your webpack config
  plugins: [
    // ... other plugins
    new ObfuscatePlugin(),
  ],
};
```

## Tips

1. **Always test obfuscated code** - Make sure your obfuscated code works correctly before deploying
2. **Use source control** - Keep original code in git, obfuscate only for deployment
3. **Start with medium preset** - Test performance before using high preset
4. **Backup originals** - Use `-o` output option instead of `--in-place` for safety
5. **Exclude vendor code** - Don't obfuscate third-party libraries (they're already minified)

## Common Issues

**Issue:** "Command not found: code-obfuscater"

- **Solution:** Use `npx code-obfuscater` or install globally: `npm install -g code-obfuscater`

**Issue:** Obfuscated code doesn't work

- **Solution:** Try a lower preset (`-p low` or `-p medium`) or check for unsupported syntax

**Issue:** Build is too slow

- **Solution:** Use `-p low` preset or exclude large vendor files
