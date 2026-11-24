(function(){
  var data = (window.RESTAURANTS || []).slice();
  var $ = function(id){ return document.getElementById(id); };
  var q = $('q'), sort = $('sort'), filtersBox = $('filters');
  var sel = {region:'', prog:'', menu:''};
  var T = I18N.t;

  // 방송 프로그램: 회차·코너명을 떼고 시리즈 단위로 묶는다
  var PROGS = [
    ['dongne', /동네\s*한\s*바퀴/, {ko:'동네 한 바퀴', en:'Dongne Hanbakwi', ja:'ドンネ・ハンバクイ', vi:'Dongne Hanbakwi', id:'Dongne Hanbakwi'}],
    ['today', /생방송\s*투데이/, {ko:'생방송 투데이', en:'Saengbangsong Today', ja:'生放送トゥデイ', vi:'Saengbangsong Today', id:'Saengbangsong Today'}],
    ['jeongbo', /생생정보/, {ko:'생생정보', en:'Saengsaeng Jeongbo', ja:'生生情報', vi:'Saengsaeng Jeongbo', id:'Saengsaeng Jeongbo'}],
    ['master', /생활의\s*달인/, {ko:'생활의 달인', en:'Master of Living', ja:'生活の達人', vi:'Cao thủ đời sống', id:'Master of Living'}],
    ['todayn', /오늘\s*N/, {ko:'오늘N', en:'Today N', ja:'オヌルN', vi:'Today N', id:'Today N'}],
    ['hyunmoo', /전현무계획/, {ko:'전현무계획', en:"Jun Hyun-moo Plan", ja:'チョン・ヒョンム計画', vi:'Kế hoạch Jun Hyun-moo', id:'Rencana Jun Hyun-moo'}],
    ['mibun', /미운\s*우리\s*새끼/, {ko:'미운 우리 새끼', en:'My Little Old Boy', ja:'私の小さな憎いやつ', vi:'My Little Old Boy', id:'My Little Old Boy'}],
    ['nae', /내고향/, {ko:'6시 내고향', en:'6 O\'Clock My Hometown', ja:'6時 わが故郷', vi:'6 giờ quê hương tôi', id:'Kampung Halamanku Pukul 6'}]
  ];
  // 메뉴 종류: 메뉴 이름과 식당 이름의 키워드로 분류 (여러 종류에 속할 수 있음)
  var MENUS = [
    ['hansik', /국밥|탕|해장|육개장|순댓국|술국|곰탕|전골|찌개|정식|비빔밥/, {ko:'한식 정식·국밥·탕', en:'Korean set meals & soups', ja:'韓定食・クッパ・スープ', vi:'Cơm set Hàn & canh', id:'Set makan Korea & sup'}],
    ['meat', /삼겹|갈비|불고기|차돌|등심|떡갈비|보쌈|수육|바베큐|육회|돈까스|항정|목살|문어|굴찜|오징어|꼬막|생선|낙지|조개/, {ko:'고기·해산물 요리', en:'Meat & seafood dishes', ja:'肉・海鮮料理', vi:'Thịt & hải sản', id:'Daging & seafood'}],
    ['noodle', /짬뽕|짜장|국수|우동|냉면|소바|쫄면|탕수|마파/, {ko:'면·중식', en:'Noodles & Chinese', ja:'麺・中華', vi:'Mì & món Hoa', id:'Mi & masakan Tionghoa'}],
    ['western', /파스타|스테이크|리조또/, {ko:'양식·파스타', en:'Western & pasta', ja:'洋食・パスタ', vi:'Món Âu & pasta', id:'Western & pasta'}],
    ['dumpling', /만두|딤섬|교자|소룡포|꿔바/, {ko:'만두·딤섬', en:'Dumplings & dim sum', ja:'餃子・点心', vi:'Há cảo & dimsum', id:'Pangsit & dimsum'}],
    ['snack', /튀김|떡볶이|순대|빈대떡|김밥/, {ko:'분식·튀김', en:'Snacks & fritters', ja:'軽食・揚げ物', vi:'Ăn vặt & đồ chiên', id:'Camilan & gorengan'}],
    ['dessert', /빵|도넛|단팥죽|팥빙수|케이크|디저트/, {ko:'디저트·빵', en:'Desserts & bakery', ja:'デザート・パン', vi:'Tráng miệng & bánh', id:'Dessert & roti'}]
  ];
  var LBL = {
    region:{ko:'지역', en:'Region', ja:'地域', vi:'Khu vực', id:'Wilayah'},
    prog:{ko:'방송 프로그램', en:'TV program', ja:'放送番組', vi:'Chương trình TV', id:'Program TV'},
    menu:{ko:'메뉴 종류', en:'Menu type', ja:'メニュー', vi:'Loại món', id:'Jenis menu'},
    all:{ko:'전체', en:'All', ja:'すべて', vi:'Tất cả', id:'Semua'},
    reset:{ko:'초기화', en:'Reset', ja:'リセット', vi:'Đặt lại', id:'Reset'}
  };
  function L(o){ return o[I18N.get()] || o.ko; }

  function progOf(d){
    for (var i = 0; i < PROGS.length; i++) if (PROGS[i][1].test(d.program || '')) return PROGS[i][0];
    return d.program || '';
  }
  function menusOf(d){
    var s = (d.name || '') + ' ' + (d.menu || []).join(' ');
    return MENUS.filter(function(m){ return m[1].test(s); }).map(function(m){ return m[0]; });
  }
  data.forEach(function(d){ d._prog = progOf(d); d._menus = menusOf(d); });

  function count(key, val){
    return data.filter(function(d){
      return (key === 'region' || !sel.region || d.region === sel.region) &&
             (key === 'prog' || !sel.prog || d._prog === sel.prog) &&
             (key === 'menu' || !sel.menu || d._menus.indexOf(sel.menu) !== -1) &&
             (key === 'region' ? d.region === val : key === 'prog' ? d._prog === val : d._menus.indexOf(val) !== -1);
    }).length;
  }
  function chip(key, val, label, n, on){
    return '<button type="button" class="chip' + (on ? ' on' : '') + '" data-k="' + key + '" data-v="' + esc(val) + '" aria-pressed="' + (on ? 'true' : 'false') + '">' +
      esc(label) + (n != null ? ' <small>' + n + '</small>' : '') + '</button>';
  }
  var openKey = '';
  function labelOf(key, v){
    if (key === 'region') return I18N.region(v);
    var list = key === 'prog' ? PROGS : MENUS;
    for (var i = 0; i < list.length; i++) if (list[i][0] === v) return L(list[i][2]);
    return v;
  }
  function fillFilters(){
    var regs = Array.from(new Set(data.map(function(d){ return d.region; }).filter(Boolean))).sort();
    var items = {
      region: regs.map(function(v){ return [v, count('region', v)]; }).filter(function(x){ return x[1] || sel.region === x[0]; })
        .map(function(x){ return chip('region', x[0], I18N.region(x[0]), x[1], sel.region === x[0]); }),
      prog: PROGS.map(function(p){ return [p[0], count('prog', p[0])]; }).filter(function(x){ return x[1] || sel.prog === x[0]; })
        .map(function(x){ return chip('prog', x[0], labelOf('prog', x[0]), x[1], sel.prog === x[0]); }),
      menu: MENUS.map(function(m){ return [m[0], count('menu', m[0])]; }).filter(function(x){ return x[1] || sel.menu === x[0]; })
        .map(function(x){ return chip('menu', x[0], labelOf('menu', x[0]), x[1], sel.menu === x[0]); })
    };
    var btns = ['region','prog','menu'].map(function(k){
      var on = !!sel[k], open = openKey === k;
      return '<button type="button" class="fbtn' + (on ? ' sel' : '') + (open ? ' open' : '') + '" data-open="' + k + '" aria-expanded="' + open + '">' +
        esc(L(LBL[k])) + (on ? ': <b>' + esc(labelOf(k, sel[k])) + '</b>' : '') + ' <span class="caret">' + (open ? '▲' : '▼') + '</span></button>';
    }).join('');
    var any = sel.region || sel.prog || sel.menu;
    var panel = openKey ? '<div class="fpanel" role="group" aria-label="' + esc(L(LBL[openKey])) + '">' + chip(openKey, '', L(LBL.all), null, !sel[openKey]) + items[openKey].join('') + '</div>' : '';
    filtersBox.innerHTML = '<div class="fbar">' + btns + (any ? '<button type="button" class="fclear" data-clear="1">' + esc(L(LBL.reset)) + '</button>' : '') + '</div>' + panel;
  }
  filtersBox.addEventListener('click', function(e){
    var t = e.target.closest ? e.target.closest('button') : null;
    if (!t) return;
    if (t.getAttribute('data-clear')) { sel.region = sel.prog = sel.menu = ''; openKey = ''; render(); return; }
    var o = t.getAttribute('data-open');
    if (o) { openKey = (openKey === o) ? '' : o; fillFilters(); return; }
    if (t.classList.contains('chip')) {
      var k = t.getAttribute('data-k'), v = t.getAttribute('data-v');
      sel[k] = (sel[k] === v) ? '' : v;
      openKey = '';
      render();
    }
  });

  function esc(s){
    return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function card(d0){
    var d = I18N.loc(d0);
    var mapUrl = 'https://map.naver.com/p/search/' + encodeURIComponent(d.address || d.name);
    var src = esc(d.program) + (d.episode ? ' · ' + esc(d.episode) : '') + (d.date ? ' (' + esc(d.date) + ')' : '');
    var detail = d0.id ? 'r.html?id=' + encodeURIComponent(d.id) : '';
    var thumb = d.img && d.img.thumb
      ? '<a class="thumb" href="' + detail + '" tabindex="-1" aria-hidden="true"><img src="' + esc(d.img.thumb) +
        '" width="480" height="480" alt="" loading="lazy"></a>'
      : '';
    return '<article class="card">' +
      (d.program ? '<span class="sticker">' + esc(d.program) + '</span>' : '') +
      thumb +
      '<h2>' + (detail ? '<a class="name" href="' + detail + '">' + esc(d.name) + '</a>' : esc(d.name)) + '</h2>' +
      (d.region ? '<span class="region">' + esc(I18N.region(d0.region)) + '</span>' : '') +
      '<dl>' +
        '<div><dt>' + T('l_src') + '</dt><dd>' + src + '</dd></div>' +
        '<div><dt>' + T('l_loc') + '</dt><dd>' + esc(d.address) + '</dd></div>' +
        '<div><dt>' + T('l_menu') + '</dt><dd>' + esc((d.menu || []).join(', ')) + '</dd></div>' +
      '</dl>' +
      (d.note ? '<p class="note">' + esc(d.note) + '</p>' : '') +
      (d.sample ? '<p class="sample">' + T('sample') + '</p>' : '') +
      (d.warn ? '<p class="sample">' + T('warn') + '</p>' : '') +
      '<div class="actions">' +
        (detail ? '<a class="primary" href="' + detail + '">' + T('more') + '</a>' : '') +
        '<a href="' + mapUrl + '" target="_blank" rel="noopener">' + T('naver') + '</a>' +
        (d.link ? '<a href="' + esc(d.link) + '" target="_blank" rel="noopener">' + T('orig') + '</a>' : '') +
      '</div></article>';
  }

  function render(){
    var kw = q.value.trim().toLowerCase();
    var list = data.filter(function(d){
      if (sel.region && d.region !== sel.region) return false;
      if (sel.prog && d._prog !== sel.prog) return false;
      if (sel.menu && d._menus.indexOf(sel.menu) === -1) return false;
      if (!kw) return true;
      var l = I18N.loc(d);
      var hay = [d.name, d.program, d.episode, d.address, (d.menu || []).join(' '), l.name, l.program, l.episode, (l.menu || []).join(' ')].join(' ').toLowerCase();
      return hay.indexOf(kw) !== -1;
    });
    list.sort(function(a, b){
      if (sort.value === 'name') return String(I18N.loc(a).name).localeCompare(String(I18N.loc(b).name), I18N.get());
      return String(b.date || '').localeCompare(String(a.date || ''));
    });
    fillFilters();
    $('list').innerHTML = list.map(card).join('');
    $('empty').hidden = list.length > 0;
    $('count').textContent = T('count', {n:list.length});
    document.title = T('title');
  }

  [q, sort].forEach(function(el){ el.addEventListener('input', render); });
  I18N.onChange(render);
  render();
})();
