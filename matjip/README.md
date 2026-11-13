# 나만의 맛집 아카이브

방송·유튜브에 소개된 맛집을 지역별로 모아 보는 정적 사이트입니다. 서버 없이 GitHub Pages로 무료 호스팅됩니다.

## 배포 방법 (GitHub Pages)
1. GitHub에서 새 저장소를 만든다. (예: `matjip`)
2. 이 폴더의 파일을 모두 저장소 루트에 올린다.
3. 저장소 Settings → Pages → Branch를 `main` / `(root)`로 지정하고 저장한다.
4. 1~2분 뒤 `https://<내아이디>.github.io/matjip/` 에서 확인한다.

## 맛집 추가 방법
`data.js`의 배열에 항목을 추가하고 커밋하면 됩니다. 예시 항목(`sample: true`)은 지우세요.

```js
{
  name: "식당명",
  region: "서울",
  program: "전현무계획",
  episode: "00회",
  date: "2026-10-29",
  address: "서울시 ... 도로명 주소",
  menu: ["메뉴1", "메뉴2"],
  note: "휴무: 월요일",
  link: "https://..."
}
```

## 블로그 결과물 올리기 (자동 변환)
매일 만드는 블로그 결과물 폴더를 그대로 사이트에 올립니다.

```
cd matjip/tools
python3 import_post.py <하루 폴더 또는 식당 폴더>          # 예: 2026-11-12
python3 import_post.py <폴더> --dry-run                     # 읽은 내용만 확인
```
- 입력: `NN_식당명_블로그본문.html`, `NN_식당명_이미지.html` (gen_blog.py 결과물)
- 결과: `data.js` 항목 추가·갱신, `img/<id>/` 에 대표 이미지(thumb, hero)와 메뉴판(menu) JPG
- 목록 카드에서 `자세히 보기`를 누르면 `r.html?id=<id>` 상세 페이지(소개, 메뉴판, 방문 정보, 출처)가 열립니다.
- `{확인}` 으로 표시된 항목은 상세 페이지에 빨간 '확인 필요'로 보입니다. 직접 확인한 뒤 `data.js` 에서 고치세요.
- 필요: python3, beautifulsoup4, pillow, playwright(chromium), 글꼴 Noto Sans CJK KR

## 구성
- `index.html` 목록 / `r.html`+`r.js` 상세 / `style.css` 디자인 / `app.js` 검색·필터·정렬 / `data.js` 데이터 / `img/` 이미지 / `tools/import_post.py` 가져오기 도구
