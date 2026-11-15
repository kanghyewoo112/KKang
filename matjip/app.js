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
  var T = I18N.t;
  var regionVals = uniq(data.map(function(d){ return d.region; }));
  function fillSelects(){
    var rv = region.value, sv = source.value;
    region.innerHTML = '<option value="">' + T('all_region') + '</option>';
    source.innerHTML = '<option value="">' + T('all_source') + '</option>';
    regionVals.forEach(function(v){
      var o = document.createElement('option'); o.value = v; o.textContent = I18N.region(v); region.appendChild(o);
    });
    fill(source, uniq(data.map(function(d){ return d.program; })));
    region.value = rv; source.value = sv;
  }

  function esc(s){
    return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function card(d){
    var mapUrl = 'https://map.naver.com/p/search/' + encodeURIComponent(d.address || d.name);
    var src = esc(d.program) + (d.episode ? ' · ' + esc(d.episode) : '') + (d.date ? ' (' + esc(d.date) + ')' : '');
    var detail = d.id ? 'r.html?id=' + encodeURIComponent(d.id) : '';
    var thumb = d.img && d.img.thumb
      ? '<a class="thumb" href="' + detail + '" tabindex="-1" aria-hidden="true"><img src="' + esc(d.img.thumb) +
        '" width="480" height="480" alt="" loading="lazy"></a>'
      : '';
    return '<article class="card">' +
      (d.program ? '<span class="sticker">' + esc(d.program) + '</span>' : '') +
      thumb +
      '<h2>' + (detail ? '<a class="name" href="' + detail + '">' + esc(d.name) + '</a>' : esc(d.name)) + '</h2>' +
      (d.region ? '<span class="region">' + esc(I18N.region(d.region)) + '</span>' : '') +
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
    $('count').textContent = T('count', {n:list.length});
    document.title = T('title');
  }

  [q, region, source, sort].forEach(function(el){ el.addEventListener('input', render); });
  I18N.onChange(function(){ fillSelects(); render(); });
  fillSelects();
  render();
})();
