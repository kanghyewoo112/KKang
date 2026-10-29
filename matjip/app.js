(function(){
  var data = (window.RESTAURANTS || []).slice();
  var $ = function(id){ return document.getElementById(id); };
  var q = $('q'), region = $('region'), source = $('source'), sort = $('sort');

  function uniq(arr){ return Array.from(new Set(arr.filter(Boolean))).sort(); }
  function fill(sel, values){
    values.forEach(function(v){
      var o = document.createElement('option'); o.value = v; o.textContent = v; sel.appendChild(o);
    });
  }
  fill(region, uniq(data.map(function(d){ return d.region; })));
  fill(source, uniq(data.map(function(d){ return d.program; })));

  function esc(s){
    return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function card(d){
    var mapUrl = 'https://map.naver.com/p/search/' + encodeURIComponent(d.address || d.name);
    var tags = [d.region, d.program].filter(Boolean).map(function(t){ return '<span class="tag">' + esc(t) + '</span>'; }).join('');
    return '<article class="card">' +
      '<h2>' + esc(d.name) + '</h2>' +
      '<div class="tags">' + tags + '</div>' +
      '<div class="row"><b>출처</b> ' + esc(d.program) + (d.episode ? ' · ' + esc(d.episode) : '') + (d.date ? ' (' + esc(d.date) + ')' : '') + '</div>' +
      '<div class="row"><b>위치</b> ' + esc(d.address) + '</div>' +
      '<div class="menu"><b>주요 메뉴</b> ' + esc((d.menu || []).join(', ')) + '</div>' +
      (d.note ? '<div class="row">' + esc(d.note) + '</div>' : '') +
      (d.sample ? '<div class="sample">※ 예시 데이터입니다. data.js에서 교체하세요.</div>' : '') +
      '<div class="actions">' +
        '<a href="' + mapUrl + '" target="_blank" rel="noopener">네이버 지도</a>' +
        (d.link ? '<a href="' + esc(d.link) + '" target="_blank" rel="noopener">원본 영상/기사</a>' : '') +
      '</div></article>';
  }

  function render(){
    var kw = q.value.trim().toLowerCase();
    var list = data.filter(function(d){
      if (region.value && d.region !== region.value) return false;
      if (source.value && d.program !== source.value) return false;
      if (!kw) return true;
      var hay = [d.name, d.program, d.episode, d.address, (d.menu || []).join(' ')].join(' ').toLowerCase();
      return hay.indexOf(kw) !== -1;
    });
    list.sort(function(a, b){
      if (sort.value === 'name') return String(a.name).localeCompare(String(b.name), 'ko');
      return String(b.date || '').localeCompare(String(a.date || ''));
    });
    $('list').innerHTML = list.map(card).join('');
    $('empty').hidden = list.length > 0;
    $('count').textContent = '총 ' + list.length + '곳';
  }

  [q, region, source, sort].forEach(function(el){ el.addEventListener('input', render); });
  render();
})();
