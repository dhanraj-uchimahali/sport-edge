import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// src/models folder
const modelsDir = path.resolve(__dirname, '..', 'models');

// generated file in src
const outputFile = path.resolve(__dirname, '..', 'types.js');

const files = fs.readdirSync(modelsDir).filter(file => file.endsWith('.js') && file !== 'index.js');

const properties = files.map(file => {
    const modelName = path.basename(file, '.js');
    // Remove .model suffix for base name (e.g., campaign.model -> campaign)
    const baseName = modelName.replace(/\.model$/, '');
    // Convert to PascalCase: first letter uppercase
    const pascalCaseName = baseName.charAt(0).toUpperCase() + baseName.slice(1);
    return ` * @property {ReturnType<typeof import('./models/${modelName}.js').default>} ${pascalCaseName}`;
  }).join('\n');

const content = `/**
 * Auto-generated file. Do not edit manually.
 *
 * @typedef {Object} Models
${properties}
 */

export {};
`;

fs.writeFileSync(outputFile, content);

console.log(`✅ Generated: ${outputFile}`);