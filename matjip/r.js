(function(){
  var T = I18N.t;
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
    return esc(s).replace(/\n/g, '<br>').replace(/\{확인\}/g, '<mark class="chk">' + T('chk') + '</mark>');
  }
  function paras(lines){
    return (lines || []).filter(Boolean).map(function(l){ return '<p>' + rich(l) + '</p>'; }).join('');
  }
  function section(title, inner){
    return inner ? '<section><h2>' + esc(title) + '</h2>' + inner + '</section>' : '';
  }
  function safeUrl(u){ return /^https?:\/\//.test(u) ? u : ''; }

  function build(){
  if (!d) {
    document.title = T('nf_h') + ' | ' + T('site');
    root.innerHTML = '<h1>' + T('nf_h') + '</h1><p>' + T('nf_p') + '</p>' +
      '<p><a class="btn" href="./">' + T('tolist') + '</a></p>';
    return;
  }

  document.title = d.name + ' | ' + T('site');
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
        (d.pill ? '<span class="region">' + esc(I18N.region(d.pill)) + '</span>' : '') +
        (d.date ? '<span>' + esc(T('aired',{d:d.date})) + '</span>' : '') +
      '</p>' +
    '</header>';

  var warn = d.warn ? '<p class="warn">' + rich(d.warn) + '</p>' : '';
  var hero = img.hero
    ? '<img class="hero-img" src="' + esc(img.hero) + '" width="1000" height="1000" alt="' + esc(d.name) + ' ' + esc(T('alt_hero',{n:''}).trim()) + ': ' + esc(d.heroText || '') + '">'
    : '';

  var intro = section(T('s_intro'),
    paras(d.intro) +
    (d.menuWhat ? '<p class="sub">' + T('s_menuwhat') + '</p><p>' + rich(d.menuWhat) + '</p>' : ''));

  var menuRows = (d.menuTable || []).map(function(r){
    return '<tr><td>' + rich(r[0]) + '</td><td class="price">' + (r[1] ? rich(r[1]) : '<mark class="chk">' + T('chk') + '</mark>') + '</td></tr>';
  }).join('');
  var menu = section(T('s_menu'),
    (d.checked ? '<p>' + T('menu_chk',{d:esc(d.checked)}) + '</p>' : '') +
    (img.menu ? '<img class="menu-img" src="' + esc(img.menu) + '" width="966" alt="' + esc(d.name) + ' ' + esc(T('alt_menu',{n:''}).trim()) + ': ' + esc((d.menu || []).join(', ')) + '" loading="lazy">' : '') +
    (menuRows ? '<div class="table-wrap"><table class="price-table"><thead><tr><th scope="col">' + T('th_menu') + '</th><th scope="col">' + T('th_price') + '</th></tr></thead><tbody>' + menuRows + '</tbody></table></div>' : ''));

  var tips = section(T('s_tips'),
    (d.tips || []).map(function(t){ return '<p class="sub">' + esc(t[0]) + '</p><p>' + rich(t[1]) + '</p>'; }).join(''));

  var hist = section(I18N.get()==='ko' ? (d.histTitle || T('s_hist')) : T('s_hist'), paras(d.hist));

  var around = (d.around || []).length ? section(T('s_around'),
    (d.aroundNote ? '<p>' + rich(d.aroundNote) + '</p>' : '') +
    '<ul class="around">' + d.around.map(function(a){
      return '<li><strong>' + esc(a[0]) + '</strong><span>' + rich(a[1]) + '</span></li>';
    }).join('') + '</ul>') : '';

  var rows = [[T('r_addr'), d.address], [T('r_hours'), info.hours], [T('r_off'), info.off], [T('r_tel'), info.tel], [T('r_park'), info.park], [T('r_checked'), d.checked]];
  var visit = section(T('s_visit'),
    '<dl class="info">' + rows.filter(function(r){ return r[1]; }).map(function(r){
      return '<div><dt>' + r[0] + '</dt><dd>' + rich(r[1]) + '</dd></div>';
    }).join('') + '</dl>' +
    '<div class="actions"><a href="' + naver + '" target="_blank" rel="noopener">' + T('naver') + '</a>' +
    '<a href="' + google + '" target="_blank" rel="noopener">' + T('google') + '</a></div>');

  var srcs = (d.src || []).filter(function(s){ return safeUrl(s[1]); }).map(function(s){
    return '<li><a href="' + esc(s[1]) + '" target="_blank" rel="noopener noreferrer">' + esc(s[0]) + '</a></li>';
  }).join('');
  var src = section(T('s_src'), srcs ? '<ol class="src">' + srcs + '</ol>' : '');

  var tags = (d.tags || []).length
    ? '<p class="tags">' + d.tags.map(function(t){ return '<span>' + esc(t) + '</span>'; }).join('') + '</p>' : '';

  root.innerHTML = head + warn + hero + intro + menu + tips + hist + around + visit + src + tags;
  }
  I18N.onChange(build);
  build();
})();
