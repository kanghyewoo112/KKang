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

## 구성
- `index.html` 화면 / `style.css` 디자인(다크모드 지원) / `app.js` 검색·필터·정렬 / `data.js` 데이터
