#!/usr/bin/env python3
"""블로그 일일 결과물을 맛집 사이트(matjip)에 올리는 도구.

사용:
  python3 import_post.py <입력 폴더> [<입력 폴더> ...] [--site ..] [--dry-run] [--force]

입력 폴더는 둘 중 하나입니다.
  - 하루치 폴더      예) 2026-11-12/          (01_우양각/, 02_.../ 하위 폴더를 모두 처리)
  - 식당 하나의 폴더  예) 2026-11-12/01_우양각/

식당 폴더에는 아래 두 파일이 있어야 합니다. (블로그 제작 때 gen_blog.py 가 만드는 파일 그대로)
  NN_식당명_블로그본문.html   본문, 메뉴 표, 방문 정보, 출처, 태그
  NN_식당명_이미지.html       대표 이미지(#hero)와 메뉴판(#menu)을 그리는 HTML

하는 일
  1. 두 HTML 에서 정보를 읽어 data.js 항목을 만듭니다. (id = 하루 폴더 날짜 + 번호, 예: 20261112-01)
  2. 이미지 HTML 의 #hero, #menu 를 그대로 그려 img/<id>/ 에 JPG 로 저장합니다. (thumb, hero, menu)
  3. data.js 에 항목을 추가하거나, 같은 id 가 있으면 바꿉니다. 맨 처음 실행하면 예시 항목은 지웁니다.

필요한 것: python3, beautifulsoup4, pillow, playwright(chromium), 글꼴 Noto Sans CJK KR
같은 식당(이름+주소)이 다른 id 로 이미 있으면 건너뜁니다. 바꾸려면 --force.
"""
import argparse
import copy
import io
import json
import re
import sys
from pathlib import Path

from bs4 import BeautifulSoup, Tag
from PIL import Image

SIDO = {
    "서울특별시": "서울", "서울": "서울", "부산광역시": "부산", "부산": "부산", "대구광역시": "대구", "대구": "대구",
    "인천광역시": "인천", "인천": "인천", "광주광역시": "광주", "광주": "광주", "대전광역시": "대전", "대전": "대전",
    "울산광역시": "울산", "울산": "울산", "세종특별자치시": "세종", "세종": "세종", "경기도": "경기", "경기": "경기",
    "강원특별자치도": "강원", "강원도": "강원", "강원": "강원", "충청북도": "충북", "충북": "충북", "충청남도": "충남",
    "충남": "충남", "전북특별자치도": "전북", "전라북도": "전북", "전북": "전북", "전라남도": "전남", "전남": "전남",
    "경상북도": "경북", "경북": "경북", "경상남도": "경남", "경남": "경남", "제주특별자치도": "제주", "제주": "제주",
}
RED_MARK = "d00000"


def read_text(p: Path) -> str:
    return p.read_text(encoding="utf-8")


def txt(el) -> str:
    """요소의 글을 줄바꿈 유지한 문자열로. 빨간 [확인 필요] 표시는 {확인} 으로 바꾼다."""
    el = copy.copy(el)
    for br in el.find_all("br"):
        br.replace_with("\n")
    for sp in el.find_all("span"):
        if RED_MARK in (sp.get("style") or ""):
            sp.replace_with("{확인}")
    t = el.get_text().replace("\xa0", " ")
    lines = [re.sub(r"[ \t]+", " ", l).strip() for l in t.split("\n")]
    return "\n".join(l for l in lines if l).strip()


def strip_icon(s: str) -> str:
    return re.sub(r"^[^\w가-힣]+", "", s).strip()


def parse_hero(image_html: str) -> dict:
    soup = BeautifulSoup(image_html, "html.parser")
    hero = soup.find(id="hero")
    if hero is None:
        raise ValueError("이미지 HTML 에서 #hero 를 찾지 못했어요.")
    s = [x.strip() for x in hero.stripped_strings]
    if len(s) < 6:
        raise ValueError(f"#hero 안의 글이 예상보다 적어요: {s}")
    m = re.search(r"(\d{4})\.(\d{2})\.(\d{2})", s[3])
    date = f"{m.group(1)}-{m.group(2)}-{m.group(3)}" if m else ""
    return {"pill": s[0], "name": s[1], "program": s[2], "date": date, "heroText": s[4], "episode": s[5]}


def parse_body(body_html: str) -> dict:
    soup = BeautifulSoup(body_html, "html.parser")
    body = soup.body
    pre, sections, cur = [], {}, None
    for el in body.children:
        if not isinstance(el, Tag):
            continue
        if el.name == "h2":
            cur = el.get_text().strip()
            sections[cur] = []
        elif cur is None:
            pre.append(el)
        else:
            sections[cur].append(el)

    out = {"title": "", "warn": ""}
    smalls = [e for e in pre if e.name == "p" and "small" in (e.get("class") or [])]
    for e in smalls:
        t = txt(e)
        if t.startswith("제목(제목 칸에 입력):"):
            out["title"] = t.split(":", 1)[1].strip()
        elif t.startswith("{확인}") and not out["warn"]:
            out["warn"] = t
    if not out["title"]:
        raise ValueError("제목 줄을 찾지 못했어요.")

    def find(*keys):
        for k, v in sections.items():
            if any(x in k for x in keys):
                return k, v
        return None, []

    def nonempty_p(els):
        return [e for e in els if e.name == "p" and txt(e)]

    # 식당 소개
    _, els = find("식당 소개")
    out["intro"], out["menuWhat"] = [], ""
    for p in nonempty_p(els):
        b = p.find("b")
        if b is not None and b.get_text().strip().startswith("🍴"):
            q = copy.copy(p)
            q.find("b").decompose()
            out["menuWhat"] = txt(q)
        elif b is None:
            out["intro"] = txt(p).split("\n")

    # 메뉴판 표
    _, els = find("메뉴판")
    out["menuTable"] = []
    for t in [e for e in els if e.name == "table"]:
        for tr in t.find_all("tr"):
            tds = tr.find_all("td")
            if len(tds) == 2:
                out["menuTable"].append([txt(tds[0]), txt(tds[1])])
    out["checked"] = ""
    for p in nonempty_p(els):
        m = re.match(r"(\d{4}-\d{2}-\d{2})", txt(p))
        if m:
            out["checked"] = m.group(1)

    # 메뉴 선택 시 참고사항
    _, els = find("참고사항")
    out["tips"] = []
    for p in nonempty_p(els):
        b = p.find("b")
        if b is not None:
            head = b.get_text().strip()
            q = copy.copy(p)
            q.find("b").decompose()
            out["tips"].append([head, txt(q)])

    # 방송 소개 이력 (소제목은 글마다 다를 수 있어 남은 구역으로 찾는다)
    known = ("식당 소개", "메뉴판", "참고사항", "주변", "방문 정보", "위치", "출처")
    hist_key = next((k for k in sections if not any(x in k for x in known)), None)
    out["histTitle"] = strip_icon(hist_key) if hist_key else "방송 소개 이력"
    out["hist"] = [txt(p) for p in nonempty_p(sections.get(hist_key, []))]

    # 주변 가볼 만한 곳
    _, els = find("주변")
    out["aroundNote"], out["around"] = "", []
    for p in nonempty_p(els):
        b = p.find("b")
        if b is not None:
            name = strip_icon(b.get_text().strip())
            q = copy.copy(p)
            q.find("b").decompose()
            out["around"].append([name, txt(q)])
        else:
            out["aroundNote"] = txt(p)

    # 방문 정보
    _, els = find("방문 정보")
    info = {}
    for t in [e for e in els if e.name == "table"]:
        for tr in t.find_all("tr"):
            th, td = tr.find("th"), tr.find("td")
            if th is None or td is None:
                continue
            label = th.get_text()
            for key, word in (("address", "주소"), ("hours", "영업시간"), ("off", "휴무"),
                              ("tel", "전화"), ("park", "주차"), ("checked", "확인일")):
                if word in label:
                    info[key] = txt(td)
    out["info"] = info
    if not out["checked"]:
        out["checked"] = info.get("checked", "")

    # 출처, 태그
    _, els = find("출처")
    out["src"] = []
    for p in nonempty_p(els):
        lines = txt(p).split("\n")
        i = 0
        while i < len(lines):
            m = re.match(r"^\d+\.\s*(.+)$", lines[i])
            if m and i + 1 < len(lines) and lines[i + 1].startswith("http"):
                out["src"].append([m.group(1).strip(), lines[i + 1].strip()])
                i += 2
            else:
                i += 1
    out["tags"] = []
    for e in smalls:
        t = txt(e)
        if t.startswith("태그 추천:"):
            out["tags"] = [x for x in t.split(":", 1)[1].split() if x.startswith("#")]
    return out


def region_of(address: str, pill: str) -> str:
    first = (address or "").split()[0] if address else ""
    if first in SIDO:
        return SIDO[first]
    p = (pill or "").split()[0] if pill else ""
    return SIDO.get(p, p or "기타")


def card_note(info: dict) -> str:
    h = (info.get("hours") or "").split("\n")[0].strip()
    if h and "{확인}" not in h:
        return "영업 " + h
    return ""


def render_images(image_html: str, out_dir: Path) -> dict:
    from playwright.sync_api import sync_playwright

    html = re.sub(r"<script.*?</script>", "", image_html, flags=re.S)
    out_dir.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        br = p.chromium.launch()
        pg = br.new_page(viewport={"width": 1100, "height": 1400})
        pg.set_content(html)
        hero = Image.open(io.BytesIO(pg.locator("#hero").screenshot())).convert("RGB")
        menu = Image.open(io.BytesIO(pg.locator("#menu").screenshot())).convert("RGB")
        br.close()
    hero.resize((1000, 1000), Image.LANCZOS).save(out_dir / "hero.jpg", quality=88, optimize=True)
    hero.resize((480, 480), Image.LANCZOS).save(out_dir / "thumb.jpg", quality=84, optimize=True)
    menu.resize((966, round(menu.height * 966 / menu.width)), Image.LANCZOS).save(
        out_dir / "menu.jpg", quality=88, optimize=True)
    return {"thumb": "thumb.jpg", "hero": "hero.jpg", "menu": "menu.jpg"}


def find_restaurants(path: Path):
    """(day_label, no, folder) 목록."""
    path = path.resolve()
    if list(path.glob("*_블로그본문.html")):
        return [(path.parent.name, path.name.split("_")[0], path)]
    subs = sorted(d for d in path.iterdir() if d.is_dir() and list(d.glob("*_블로그본문.html")))
    return [(path.name, d.name.split("_")[0], d) for d in subs]


def load_data(js_path: Path) -> list:
    if not js_path.exists():
        return []
    s = read_text(js_path)
    i = s.find("window.RESTAURANTS")
    if i < 0:
        return []
    j = s.find("=", i)
    k = s.find("[", j)
    try:
        arr, _ = json.JSONDecoder().raw_decode(s[k:])
        return [d for d in arr if not d.get("sample")]
    except (ValueError, json.JSONDecodeError):
        return []  # 처음 만든 예시 파일(키에 따옴표 없음)이면 비워서 시작


HEADER = """// 맛집 데이터. matjip/tools/import_post.py 가 만들고 갱신합니다.
// 직접 고쳐도 되지만, 같은 id 로 다시 가져오면 그 항목은 새 내용으로 바뀝니다.
// {확인} 은 사이트에서 빨간 '확인 필요' 표시로 보입니다. 직접 확인한 뒤 지우세요.
"""


def save_data(js_path: Path, data: list):
    data.sort(key=lambda d: (d.get("date", ""), d["id"]), reverse=True)
    js_path.write_text(
        HEADER + "window.RESTAURANTS = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8")


def main():
    ap = argparse.ArgumentParser(description="블로그 결과물을 맛집 사이트에 올립니다.")
    ap.add_argument("inputs", nargs="+", type=Path)
    ap.add_argument("--site", type=Path, default=Path(__file__).resolve().parent.parent,
                    help="matjip 폴더 (기본: 이 파일의 상위 폴더)")
    ap.add_argument("--dry-run", action="store_true", help="파일을 쓰지 않고 읽은 내용만 보여줍니다.")
    ap.add_argument("--force", action="store_true", help="같은 식당이 있어도 새 id 로 추가합니다.")
    a = ap.parse_args()

    js = a.site / "data.js"
    data = load_data(js)
    added = []
    for inp in a.inputs:
        for day, no, folder in find_restaurants(inp):
            body_f = next(folder.glob("*_블로그본문.html"))
            img_f = next(folder.glob("*_이미지.html"), None)
            if img_f is None:
                print(f"건너뜀 {folder.name}: 이미지 HTML 이 없어요.")
                continue
            image_html = read_text(img_f)
            e = {**parse_hero(image_html), **parse_body(read_text(body_f))}
            info = e["info"]
            rid = f"{re.sub(r'[^0-9]', '', day)}-{no}"
            dup = [d for d in data if d["name"] == e["name"] and d.get("address") == info.get("address")
                   and d["id"] != rid]
            if dup and not a.force:
                print(f"건너뜀 {e['name']}: 이미 {dup[0]['id']} 로 올라가 있어요. (--force 로 추가)")
                continue
            entry = {
                "id": rid,
                "name": e["name"],
                "region": region_of(info.get("address", ""), e["pill"]),
                "program": e["program"],
                "episode": e["episode"],
                "date": e["date"],
                "address": info.get("address", ""),
                "menu": [m for m, _ in e["menuTable"]],
                "note": card_note(info),
                "link": e["src"][0][1] if e["src"] else "",
                "title": e["title"],
                "pill": e["pill"],
                "heroText": e["heroText"],
                "warn": e["warn"],
                "intro": e["intro"],
                "menuWhat": e["menuWhat"],
                "menuTable": e["menuTable"],
                "tips": e["tips"],
                "histTitle": e["histTitle"],
                "hist": e["hist"],
                "aroundNote": e["aroundNote"],
                "around": e["around"],
                "info": {k: info.get(k, "") for k in ("hours", "off", "tel", "park")},
                "checked": e["checked"],
                "src": e["src"],
                "tags": e["tags"],
                "img": {},
            }
            print(f"읽음 {rid} {e['name']} | 메뉴 {len(e['menuTable'])}개 | 주변 {len(e['around'])}곳 | "
                  f"출처 {len(e['src'])}개 | 확인필요 표시 {json.dumps(entry, ensure_ascii=False).count('{확인}')}곳")
            if a.dry_run:
                continue
            files = render_images(image_html, a.site / "img" / rid)
            entry["img"] = {k: f"img/{rid}/{v}" for k, v in files.items()}
            data = [d for d in data if d["id"] != rid] + [entry]
            added.append(rid)
    if added:
        save_data(js, data)
        print(f"data.js 에 {len(added)}곳 반영: {', '.join(added)} (전체 {len(data)}곳)")
    elif not a.dry_run:
        print("바뀐 것이 없어요.")


if __name__ == "__main__":
    sys.exit(main())
