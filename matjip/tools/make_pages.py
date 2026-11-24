#!/usr/bin/env python3
"""식당 이름 폴더 페이지 생성: /matjip/<식당명>/index.html -> r.html?id=<id> 로 이동.
data.js 에 식당을 추가한 뒤 `python3 tools/make_pages.py` 를 실행하세요."""
import sys, html
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
import import_post as ip
SITE = Path(__file__).resolve().parent.parent
data = ip.load_data(SITE / "data.js")
seen = {}
for d in data:
    name = d["name"].strip().replace("/", "·")
    if name in seen: name = f'{name}-{d["id"]}'
    seen[name] = d["id"]
    folder = SITE / name; folder.mkdir(exist_ok=True)
    t = html.escape(f'{d["name"]} | {d["title"]}')
    desc = html.escape(d["intro"][0] if d.get("intro") else d["title"])
    url = f'../r.html?id={d["id"]}'
    (folder / "index.html").write_text(f'''<!doctype html><html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>{t}</title>
<meta name="description" content="{desc}"><meta property="og:title" content="{t}"><meta property="og:description" content="{desc}">
<meta property="og:image" content="../{html.escape(d["img"].get("hero",""))}">
<link rel="canonical" href="../r.html?id={d["id"]}"><meta http-equiv="refresh" content="0;url={url}">
<script>location.replace("{url}"+location.hash)</script></head>
<body><p><a href="{url}">{html.escape(d["name"])} 상세 페이지로 이동</a></p></body></html>''', encoding="utf-8")
print(len(seen), "pages")
