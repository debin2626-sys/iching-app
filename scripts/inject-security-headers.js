#!/usr/bin/env node
// Post-build script: inject security headers into OpenNext worker.js
// Strategy: wrap the entire default export's fetch method
const fs = require('fs');
const path = require('path');

const workerPath = path.join(__dirname, '..', '.open-next', 'worker.js');
let code = fs.readFileSync(workerPath, 'utf8');

if (code.includes('__securityHeaders')) {
  console.log('Security headers already injected, skipping.');
  process.exit(0);
}

// Append a wrapper at the end of the file that monkey-patches the fetch handler
const wrapper = `

// === SECURITY HEADERS INJECTION ===
const __securityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://cards.iching.workers.dev https://api.deepseek.com https://api.openai.com;",
};

// Wrap the original fetch to inject security headers
const __originalFetch = worker_default.fetch.bind(worker_default);
worker_default.fetch = async function(request, env, ctx) {
  const response = await __originalFetch(request, env, ctx);
  const newResponse = new Response(response.body, response);
  for (const [key, value] of Object.entries(__securityHeaders)) {
    newResponse.headers.set(key, value);
  }
  return newResponse;
};
// === END SECURITY HEADERS INJECTION ===
`;

// Find the variable name of the default export
// OpenNext worker.js typically has: var worker_default = { fetch: ... }; export { worker_default as default };
const exportMatch = code.match(/export\s*\{\s*(\w+)\s+as\s+default\s*\}/);
let varName = 'worker_default';
if (exportMatch) {
  varName = exportMatch[1];
}

const finalWrapper = wrapper.replace(/worker_default/g, varName);
code = code + finalWrapper;

fs.writeFileSync(workerPath, code, 'utf8');
console.log(`Security headers injected into worker.js (export var: ${varName})`);
