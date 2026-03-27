#!/usr/bin/env node
// Post-build script: inject security headers into OpenNext worker.js
const fs = require('fs');
const path = require('path');

const workerPath = path.join(__dirname, '..', '.open-next', 'worker.js');
let code = fs.readFileSync(workerPath, 'utf8');

const injection = `
// === SECURITY HEADERS INJECTION ===
const __securityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://cards.iching.workers.dev https://api.deepseek.com https://api.openai.com;",
};
function __addSecurityHeaders(response) {
  const r = new Response(response.body, response);
  for (const [k, v] of Object.entries(__securityHeaders)) r.headers.set(k, v);
  return r;
}
// === END SECURITY HEADERS INJECTION ===`;

// Wrap the fetch handler's return to add security headers
// The pattern is: return runWithCloudflareRequestContext(...)
// We wrap the entire fetch to add headers to the final response

if (code.includes('__securityHeaders')) {
  console.log('Security headers already injected, skipping.');
  process.exit(0);
}

// Add injection at the top of the file
code = injection + '\n' + code;

// Wrap the fetch export to add security headers
// Replace: async fetch(request, env, ctx) {
//          return runWithCloudflareRequestContext(...)
// With:    async fetch(request, env, ctx) {
//          const __resp = await (async () => { return runWithCloudflareRequestContext(...) })();
//          return __addSecurityHeaders(__resp);

code = code.replace(
  /async fetch\(request, env, ctx\) \{\s*return runWithCloudflareRequestContext/,
  `async fetch(request, env, ctx) {
        const __origResp = await runWithCloudflareRequestContext`
);

code = code.replace(
  /return handler\(reqOrResp, env, ctx, request\.signal\);\s*\}\);\s*\},?\s*\};/,
  `return handler(reqOrResp, env, ctx, request.signal);
        });
        return __addSecurityHeaders(__origResp);
    },
};`
);

fs.writeFileSync(workerPath, code, 'utf8');
console.log('Security headers injected into worker.js');
