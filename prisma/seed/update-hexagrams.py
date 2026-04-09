#!/usr/bin/env python3
import json

with open('/root/.openclaw/workspace/developer/iching-app/prisma/seed/hexagrams-1-8.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Loaded {len(data)} hexagrams")
for h in data:
    print(f"  #{h['number']} {h['nameZh']} - has overview: {'overviewZh' in h}")
