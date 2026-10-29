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
    var src = esc(d.program) + (d.episode ? ' · ' + esc(d.episode) : '') + (d.date ? ' (' + esc(d.date) + ')' : '');
    return '<article class="card">' +
      (d.program ? '<span class="sticker">' + esc(d.program) + '</span>' : '') +
      '<h2>' + esc(d.name) + '</h2>' +
      (d.region ? '<span class="region">' + esc(d.region) + '</span>' : '') +
      '<dl>' +
        '<div><dt>출처</dt><dd>' + src + '</dd></div>' +
        '<div><dt>위치</dt><dd>' + esc(d.address) + '</dd></div>' +
        '<div><dt>메뉴</dt><dd>' + esc((d.menu || []).join(', ')) + '</dd></div>' +
      '</dl>' +
      (d.note ? '<p class="note">' + esc(d.note) + '</p>' : '') +
      (d.sample ? '<p class="sample">예시 데이터예요. data.js에서 실제 맛집으로 바꾸세요.</p>' : '') +
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
