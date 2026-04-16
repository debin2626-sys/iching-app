// Script to add zh-TW fields to hexagrams.ts
// One-time migration script — run with: node add-zhtw-hexagrams.js
import OpenCC from 'opencc-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const converter = OpenCC.Converter({ from: 'cn', to: 'twp' }); // cn -> tw with phrases

const filePath = path.join(__dirname, 'src/data/hexagrams.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Parse each hexagram entry and add zh-TW fields
// We'll use regex to find each object in the array and add fields before the closing },

const hexagramRegex = /\{\s*number:\s*(\d+),\s*nameZh:\s*"([^"]*)",\s*nameEn:\s*"([^"]*)",\s*traditionalName:\s*"([^"]*)",\s*symbol:\s*"([^"]*)",\s*upperTrigram:\s*"([^"]*)",\s*lowerTrigram:\s*"([^"]*)",\s*judgmentZh:\s*"([^"]*)",\s*judgmentEn:\s*"([^"]*)",\s*imageZh:\s*"([^"]*)",\s*imageEn:\s*"([^"]*)",\s*interpretationZh:\s*"([^"]*)",\s*interpretationEn:\s*"([^"]*)",?\s*\}/g;

let result = content;
let match;
const replacements = [];

while ((match = hexagramRegex.exec(content)) !== null) {
  const [fullMatch, number, nameZh, , traditionalName, , , , judgmentZh, , imageZh, , interpretationZh] = match;
  
  const nameZhTW = converter(nameZh);
  const traditionalNameTW = converter(traditionalName);
  const judgmentZhTW = converter(judgmentZh);
  const imageZhTW = converter(imageZh);
  const interpretationZhTW = converter(interpretationZh);
  
  // Only add fields that actually differ
  const twFields = [];
  if (nameZhTW !== nameZh) twFields.push(`    nameZhTW: "${nameZhTW}"`);
  if (traditionalNameTW !== traditionalName) twFields.push(`    traditionalNameTW: "${traditionalNameTW}"`);
  if (judgmentZhTW !== judgmentZh) twFields.push(`    judgmentZhTW: "${judgmentZhTW}"`);
  if (imageZhTW !== imageZh) twFields.push(`    imageZhTW: "${imageZhTW}"`);
  if (interpretationZhTW !== interpretationZh) twFields.push(`    interpretationZhTW: "${interpretationZhTW}"`);
  
  if (twFields.length > 0) {
    replacements.push({
      search: fullMatch,
      nameZhTW, traditionalNameTW, judgmentZhTW, imageZhTW, interpretationZhTW,
      number: parseInt(number),
      twFields
    });
  }
}

console.log(`Found ${replacements.length} hexagrams needing zh-TW fields`);

// Now do the actual replacement more carefully
for (const rep of replacements) {
  // Find the specific hexagram block by number
  const numStr = `number: ${rep.number},`;
  const idx = result.indexOf(numStr);
  if (idx === -1) continue;
  
  // Find the closing of interpretationEn for this hexagram
  const searchFrom = idx;
  const interpEnIdx = result.indexOf('interpretationEn:', searchFrom);
  if (interpEnIdx === -1) continue;
  
  // Find the end of the interpretationEn value (closing quote + possible comma)
  const quoteStart = result.indexOf('"', interpEnIdx + 'interpretationEn:'.length);
  if (quoteStart === -1) continue;
  
  // Find matching closing quote (handle escaped quotes)
  let quoteEnd = quoteStart + 1;
  while (quoteEnd < result.length) {
    if (result[quoteEnd] === '"' && result[quoteEnd - 1] !== '\\') break;
    quoteEnd++;
  }
  
  // Insert after the closing quote and comma/newline
  const afterQuote = quoteEnd + 1;
  // Check if there's a comma
  let insertAt = afterQuote;
  if (result[insertAt] === ',') insertAt++;
  
  const newFieldsStr = '\n' + rep.twFields.join(',\n') + ',';
  result = result.slice(0, insertAt) + newFieldsStr + result.slice(insertAt);
}

fs.writeFileSync(filePath, result, 'utf-8');
console.log('Done! Updated hexagrams.ts with zh-TW fields.');
