import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

let cachedVersion = 'unknown';

function getVersion(): string {
  if (cachedVersion === 'unknown') {
    try {
      const pkg = JSON.parse(
        readFileSync(join(process.cwd(), 'package.json'), 'utf-8')
      );
      cachedVersion = pkg.version ?? 'unknown';
    } catch {
      // keep default
    }
  }
  return cachedVersion;
}

export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      version: getVersion(),
    },
    {
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
    }
  );
}
