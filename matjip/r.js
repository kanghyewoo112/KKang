(function(){
  var root = document.getElementById('post');
  var id = new URLSearchParams(location.search).get('id');
  var d = (window.RESTAURANTS || []).filter(function(x){ return x.id === id; })[0];

  function esc(s){
    return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  // 줄바꿈은 <br>, {확인} 은 빨간 '확인 필요' 표시로
  function rich(s){
    return esc(s).replace(/\n/g, '<br>').replace(/\{확인\}/g, '<mark class="chk">확인 필요</mark>');
  }
  function paras(lines){
    return (lines || []).filter(Boolean).map(function(l){ return '<p>' + rich(l) + '</p>'; }).join('');
  }
  function section(title, inner){
    return inner ? '<section><h2>' + esc(title) + '</h2>' + inner + '</section>' : '';
  }
  function safeUrl(u){ return /^https?:\/\//.test(u) ? u : ''; }

  if (!d) {
    document.title = '맛집을 찾지 못했어요 | 나만의 맛집 아카이브';
    root.innerHTML = '<h1>맛집을 찾지 못했어요</h1><p>주소가 바뀌었거나 아직 올라오지 않은 글이에요.</p>' +
      '<p><a class="btn" href="./">목록으로 가기</a></p>';
    return;
  }

  document.title = d.name + ' | 나만의 맛집 아카이브';
  var q = encodeURIComponent((d.name || '') + ' ' + (d.address || ''));
  var naver = 'https://map.naver.com/p/search/' + q;
  var google = 'https://www.google.com/maps/search/?api=1&query=' + q;
  var info = d.info || {};
  var img = d.img || {};

  var head =
    '<header class="post-head">' +
      (d.program ? '<span class="sticker">' + esc(d.program) + '</span>' : '') +
      '<h1>' + esc(d.title || d.name) + '</h1>' +
      '<p class="meta">' +
        (d.pill ? '<span class="region">' + esc(d.pill) + '</span>' : '') +
        (d.date ? '<span>' + esc(d.date) + ' 방송</span>' : '') +
      '</p>' +
    '</header>';

  var warn = d.warn ? '<p class="warn">' + rich(d.warn) + '</p>' : '';
  var hero = img.hero
    ? '<img class="hero-img" src="' + esc(img.hero) + '" width="1000" height="1000" alt="' + esc(d.name) + ' 대표 이미지: ' + esc(d.heroText || '') + '">'
    : '';

  var intro = section('식당 소개',
    paras(d.intro) +
    (d.menuWhat ? '<p class="sub">어떤 메뉴를 파나요</p><p>' + rich(d.menuWhat) + '</p>' : ''));

  var menuRows = (d.menuTable || []).map(function(r){
    return '<tr><td>' + rich(r[0]) + '</td><td class="price">' + (r[1] ? rich(r[1]) : '<mark class="chk">확인 필요</mark>') + '</td></tr>';
  }).join('');
  var menu = section('메뉴판',
    (d.checked ? '<p>' + esc(d.checked) + ' 확인한 메뉴와 가격이에요.<br>가격은 바뀔 수 있어요.</p>' : '') +
    (img.menu ? '<img class="menu-img" src="' + esc(img.menu) + '" width="966" alt="' + esc(d.name) + ' 메뉴판: ' + esc((d.menu || []).join(', ')) + '" loading="lazy">' : '') +
    (menuRows ? '<div class="table-wrap"><table class="price-table"><thead><tr><th scope="col">메뉴</th><th scope="col">가격</th></tr></thead><tbody>' + menuRows + '</tbody></table></div>' : ''));

  var tips = section('메뉴 선택 시 참고사항',
    (d.tips || []).map(function(t){ return '<p class="sub">' + esc(t[0]) + '</p><p>' + rich(t[1]) + '</p>'; }).join(''));

  var hist = section(d.histTitle || '방송 소개 이력', paras(d.hist));

  var around = section('주변 가볼 만한 곳',
    (d.aroundNote ? '<p>' + rich(d.aroundNote) + '</p>' : '') +
    '<ul class="around">' + (d.around || []).map(function(a){
      return '<li><strong>' + esc(a[0]) + '</strong><span>' + rich(a[1]) + '</span></li>';
    }).join('') + '</ul>');

  var rows = [['주소', d.address], ['영업시간', info.hours], ['휴무', info.off], ['전화', info.tel], ['주차', info.park], ['확인일', d.checked]];
  var visit = section('방문 정보',
    '<dl class="info">' + rows.filter(function(r){ return r[1]; }).map(function(r){
      return '<div><dt>' + r[0] + '</dt><dd>' + rich(r[1]) + '</dd></div>';
    }).join('') + '</dl>' +
    '<div class="actions"><a href="' + naver + '" target="_blank" rel="noopener">네이버 지도</a>' +
    '<a href="' + google + '" target="_blank" rel="noopener">구글 지도</a></div>');

  var srcs = (d.src || []).filter(function(s){ return safeUrl(s[1]); }).map(function(s){
    return '<li><a href="' + esc(s[1]) + '" target="_blank" rel="noopener noreferrer">' + esc(s[0]) + '</a></li>';
  }).join('');
  var src = section('출처', srcs ? '<ol class="src">' + srcs + '</ol>' : '');

  var tags = (d.tags || []).length
    ? '<p class="tags">' + d.tags.map(function(t){ return '<span>' + esc(t) + '</span>'; }).join('') + '</p>' : '';

  root.innerHTML = head + warn + hero + intro + menu + tips + hist + around + visit + src + tags;
})();
