// Script to add zh-TW fields to scenarios.ts
import OpenCC from 'opencc-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const converter = OpenCC.Converter({ from: 'cn', to: 'twp' });

const filePath = path.join(__dirname, 'src/data/scenarios.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Update the interfaces to include 'zh-TW'
content = content.replace(
  /name: \{ zh: string; en: string \}/g,
  'name: { zh: string; en: string; "zh-TW"?: string }'
);
content = content.replace(
  /template: \{ zh: string; en: string \}/g,
  'template: { zh: string; en: string; "zh-TW"?: string }'
);
content = content.replace(
  /description: \{ zh: string; en: string \}/g,
  'description: { zh: string; en: string; "zh-TW"?: string }'
);

// Now find all { zh: "...", en: "..." } patterns and add zh-TW
// Match patterns like: { zh: "事业", en: "Career" }
content = content.replace(
  /\{\s*zh:\s*"([^"]*)",\s*en:\s*"([^"]*)"\s*\}/g,
  (match, zh, en) => {
    const zhTW = converter(zh);
    if (zhTW !== zh) {
      return `{ zh: "${zh}", en: "${en}", "zh-TW": "${zhTW}" }`;
    }
    return match;
  }
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Done! Updated scenarios.ts with zh-TW fields.');
