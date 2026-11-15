/* 다국어: ko(기본) en ja vi id. 언어를 더 늘리려면 L 에 항목을, D 에 번역 한 벌을 추가하세요. */
(function(){
  var L = [['ko','한국어'],['en','English'],['ja','日本語'],['vi','Tiếng Việt'],['id','Bahasa Indonesia']];
  var D = {
    ko:{
      title:'오늘은 어디서 먹지? 나만의 맛집 아카이브', desc:'방송·유튜브에 소개된 맛집을 지역별로 모아둔 나만의 맛집 아카이브',
      cap1:'오늘은', cap2:'어디서 먹지?', subtitle:'방송에 나온 그 집, 한곳에 모았어요',
      ph_q:'식당, 메뉴, 프로그램 검색', a_q:'검색', a_region:'지역', a_source:'방송 출처', a_sort:'정렬', a_lang:'언어',
      all_region:'전체 지역', all_source:'전체 출처', sort_new:'최신 소개순', sort_name:'이름순',
      count:'총 {n}곳', empty:'조건에 맞는 맛집이 없어요. 검색어를 바꿔 보세요.',
      footer:'정보는 방송·영상 소개 당시 기준이에요. 방문 전에 영업시간과 휴무일을 꼭 확인하세요.',
      l_src:'출처', l_loc:'위치', l_menu:'메뉴', more:'자세히 보기', naver:'네이버 지도', google:'구글 지도', orig:'원본 영상/기사',
      sample:'예시 데이터예요. data.js에서 실제 맛집으로 바꾸세요.', warn:'확인이 덜 된 정보가 있어요. 자세히 보기에서 확인하세요.',
      back:'← 오늘은 어디서 먹지?', loading:'불러오는 중이에요.', nf_h:'맛집을 찾지 못했어요', nf_p:'주소가 바뀌었거나 아직 올라오지 않은 글이에요.', tolist:'목록으로 가기', site:'나만의 맛집 아카이브', dtitle:'맛집 상세',
      aired:'{d} 방송', alt_hero:'{n} 대표 이미지', alt_menu:'{n} 메뉴판',
      s_intro:'식당 소개', s_menuwhat:'어떤 메뉴를 파나요', s_menu:'메뉴판', menu_chk:'{d} 확인한 메뉴와 가격이에요.<br>가격은 바뀔 수 있어요.',
      th_menu:'메뉴', th_price:'가격', s_tips:'메뉴 선택 시 참고사항', s_hist:'방송 소개 이력', s_around:'주변 가볼 만한 곳', s_visit:'방문 정보', s_src:'출처',
      r_addr:'주소', r_hours:'영업시간', r_off:'휴무', r_tel:'전화', r_park:'주차', r_checked:'확인일', chk:'확인 필요'
    },
    en:{
      title:'Where to eat today? My restaurant archive', desc:'A personal archive of restaurants featured on TV and YouTube, grouped by region',
      cap1:'Where shall', cap2:'we eat today?', subtitle:'Every spot from the shows, all in one place',
      ph_q:'Search restaurant, dish or show', a_q:'Search', a_region:'Region', a_source:'Show', a_sort:'Sort', a_lang:'Language',
      all_region:'All regions', all_source:'All shows', sort_new:'Newest first', sort_name:'Name',
      count:'{n} places', empty:'No restaurants match. Try a different keyword.',
      footer:'Info is as of when the place was featured. Please check opening hours and days off before you go.',
      l_src:'Featured in', l_loc:'Address', l_menu:'Menu', more:'Details', naver:'Naver Map', google:'Google Maps', orig:'Original video/article',
      sample:'Sample data. Replace it with a real restaurant in data.js.', warn:'Some details are not fully verified. See Details.',
      back:'← Where to eat today?', loading:'Loading…', nf_h:'Restaurant not found', nf_p:'The link may have changed, or the post is not up yet.', tolist:'Back to the list', site:'My restaurant archive', dtitle:'Restaurant details',
      aired:'Aired {d}', alt_hero:'{n} cover image', alt_menu:'{n} menu',
      s_intro:'About the restaurant', s_menuwhat:'What do they serve?', s_menu:'Menu', menu_chk:'Menu and prices checked on {d}.<br>Prices may change.',
      th_menu:'Dish', th_price:'Price', s_tips:'Ordering tips', s_hist:'TV features', s_around:'Nearby spots', s_visit:'Visit info', s_src:'Sources',
      r_addr:'Address', r_hours:'Hours', r_off:'Closed', r_tel:'Phone', r_park:'Parking', r_checked:'Checked on', chk:'To be checked'
    },
    ja:{
      title:'今日はどこで食べる？ マイグルメ・アーカイブ', desc:'テレビやYouTubeで紹介されたお店を地域別にまとめた、私のグルメ・アーカイブ',
      cap1:'今日は', cap2:'どこで食べる？', subtitle:'番組に出たあのお店を、ひとつに集めました',
      ph_q:'店名・メニュー・番組で検索', a_q:'検索', a_region:'地域', a_source:'番組', a_sort:'並び替え', a_lang:'言語',
      all_region:'すべての地域', all_source:'すべての番組', sort_new:'新着順', sort_name:'名前順',
      count:'全{n}軒', empty:'条件に合うお店がありません。キーワードを変えてみてください。',
      footer:'情報は紹介された時点のものです。訪問前に営業時間と定休日をご確認ください。',
      l_src:'出典', l_loc:'住所', l_menu:'メニュー', more:'詳しく見る', naver:'NAVER地図', google:'Googleマップ', orig:'元の動画・記事',
      sample:'サンプルデータです。data.jsで実際のお店に置き換えてください。', warn:'未確認の情報があります。詳細ページでご確認ください。',
      back:'← 今日はどこで食べる？', loading:'読み込み中です。', nf_h:'お店が見つかりません', nf_p:'リンクが変わったか、まだ公開されていない記事です。', tolist:'一覧に戻る', site:'マイグルメ・アーカイブ', dtitle:'お店の詳細',
      aired:'{d} 放送', alt_hero:'{n} のメイン画像', alt_menu:'{n} のメニュー',
      s_intro:'お店の紹介', s_menuwhat:'どんなメニューがある？', s_menu:'メニュー', menu_chk:'{d}に確認したメニューと価格です。<br>価格は変わることがあります。',
      th_menu:'メニュー', th_price:'価格', s_tips:'注文のヒント', s_hist:'番組での紹介履歴', s_around:'周辺のおすすめスポット', s_visit:'訪問情報', s_src:'出典',
      r_addr:'住所', r_hours:'営業時間', r_off:'定休日', r_tel:'電話', r_park:'駐車場', r_checked:'確認日', chk:'要確認'
    },
    vi:{
      title:'Hôm nay ăn ở đâu? Kho quán ăn của tôi', desc:'Kho lưu trữ các quán ăn từng xuất hiện trên TV và YouTube, sắp xếp theo khu vực',
      cap1:'Hôm nay', cap2:'ăn ở đâu?', subtitle:'Những quán từng lên sóng, gom về một chỗ',
      ph_q:'Tìm quán, món ăn hoặc chương trình', a_q:'Tìm kiếm', a_region:'Khu vực', a_source:'Chương trình', a_sort:'Sắp xếp', a_lang:'Ngôn ngữ',
      all_region:'Tất cả khu vực', all_source:'Tất cả chương trình', sort_new:'Mới nhất', sort_name:'Theo tên',
      count:'Tổng {n} quán', empty:'Không có quán nào phù hợp. Hãy thử từ khóa khác.',
      footer:'Thông tin tính tại thời điểm quán được giới thiệu. Hãy kiểm tra giờ mở cửa và ngày nghỉ trước khi đến.',
      l_src:'Nguồn', l_loc:'Địa chỉ', l_menu:'Thực đơn', more:'Xem chi tiết', naver:'Naver Map', google:'Google Maps', orig:'Video/bài viết gốc',
      sample:'Đây là dữ liệu mẫu. Hãy thay bằng quán thật trong data.js.', warn:'Một số thông tin chưa được xác minh đầy đủ. Xem chi tiết.',
      back:'← Hôm nay ăn ở đâu?', loading:'Đang tải…', nf_h:'Không tìm thấy quán', nf_p:'Đường dẫn có thể đã đổi hoặc bài chưa được đăng.', tolist:'Về danh sách', site:'Kho quán ăn của tôi', dtitle:'Chi tiết quán',
      aired:'Phát sóng {d}', alt_hero:'Ảnh đại diện {n}', alt_menu:'Thực đơn {n}',
      s_intro:'Giới thiệu quán', s_menuwhat:'Quán bán món gì?', s_menu:'Thực đơn', menu_chk:'Thực đơn và giá được kiểm tra ngày {d}.<br>Giá có thể thay đổi.',
      th_menu:'Món', th_price:'Giá', s_tips:'Mẹo gọi món', s_hist:'Lịch sử lên sóng', s_around:'Địa điểm gần đó', s_visit:'Thông tin tham quan', s_src:'Nguồn',
      r_addr:'Địa chỉ', r_hours:'Giờ mở cửa', r_off:'Ngày nghỉ', r_tel:'Điện thoại', r_park:'Chỗ đậu xe', r_checked:'Ngày kiểm tra', chk:'Cần kiểm tra'
    },
    id:{
      title:'Makan di mana hari ini? Arsip restoranku', desc:'Arsip restoran yang tampil di TV dan YouTube, dikelompokkan per wilayah',
      cap1:'Hari ini', cap2:'makan di mana?', subtitle:'Tempat-tempat dari acara TV, terkumpul di satu tempat',
      ph_q:'Cari restoran, menu, atau acara', a_q:'Cari', a_region:'Wilayah', a_source:'Acara', a_sort:'Urutkan', a_lang:'Bahasa',
      all_region:'Semua wilayah', all_source:'Semua acara', sort_new:'Terbaru', sort_name:'Nama',
      count:'Total {n} tempat', empty:'Tidak ada restoran yang cocok. Coba kata kunci lain.',
      footer:'Informasi sesuai saat restoran diperkenalkan. Periksa jam buka dan hari libur sebelum berkunjung.',
      l_src:'Sumber', l_loc:'Alamat', l_menu:'Menu', more:'Lihat detail', naver:'Naver Map', google:'Google Maps', orig:'Video/artikel asli',
      sample:'Ini data contoh. Ganti dengan restoran sungguhan di data.js.', warn:'Sebagian informasi belum diverifikasi. Lihat detail.',
      back:'← Makan di mana hari ini?', loading:'Memuat…', nf_h:'Restoran tidak ditemukan', nf_p:'Tautan mungkin berubah, atau tulisannya belum terbit.', tolist:'Kembali ke daftar', site:'Arsip restoranku', dtitle:'Detail restoran',
      aired:'Tayang {d}', alt_hero:'Gambar utama {n}', alt_menu:'Menu {n}',
      s_intro:'Tentang restoran', s_menuwhat:'Menjual apa saja?', s_menu:'Menu', menu_chk:'Menu dan harga dicek pada {d}.<br>Harga bisa berubah.',
      th_menu:'Menu', th_price:'Harga', s_tips:'Tips memesan', s_hist:'Riwayat tayang di TV', s_around:'Tempat menarik di sekitar', s_visit:'Info kunjungan', s_src:'Sumber',
      r_addr:'Alamat', r_hours:'Jam buka', r_off:'Hari libur', r_tel:'Telepon', r_park:'Parkir', r_checked:'Dicek pada', chk:'Perlu dicek'
    }
  };
  var R = { // 시/도 이름 (값은 한국어로 유지, 표시만 번역)
    en:{서울:'Seoul',부산:'Busan',대구:'Daegu',인천:'Incheon',광주:'Gwangju',대전:'Daejeon',울산:'Ulsan',세종:'Sejong',경기:'Gyeonggi',강원:'Gangwon',충북:'N. Chungcheong',충남:'S. Chungcheong',전북:'N. Jeolla',전남:'S. Jeolla',경북:'N. Gyeongsang',경남:'S. Gyeongsang',제주:'Jeju'},
    ja:{서울:'ソウル',부산:'釜山',대구:'大邱',인천:'仁川',광주:'光州',대전:'大田',울산:'蔚山',세종:'世宗',경기:'京畿道',강원:'江原道',충북:'忠清北道',충남:'忠清南道',전북:'全羅北道',전남:'全羅南道',경북:'慶尚北道',경남:'慶尚南道',제주:'済州'},
    vi:{서울:'Seoul',부산:'Busan',대구:'Daegu',인천:'Incheon',광주:'Gwangju',대전:'Daejeon',울산:'Ulsan',세종:'Sejong',경기:'Gyeonggi',강원:'Gangwon',충북:'Bắc Chungcheong',충남:'Nam Chungcheong',전북:'Bắc Jeolla',전남:'Nam Jeolla',경북:'Bắc Gyeongsang',경남:'Nam Gyeongsang',제주:'Jeju'},
    id:{서울:'Seoul',부산:'Busan',대구:'Daegu',인천:'Incheon',광주:'Gwangju',대전:'Daejeon',울산:'Ulsan',세종:'Sejong',경기:'Gyeonggi',강원:'Gangwon',충북:'Chungcheong Utara',충남:'Chungcheong Selatan',전북:'Jeolla Utara',전남:'Jeolla Selatan',경북:'Gyeongsang Utara',경남:'Gyeongsang Selatan',제주:'Jeju'}
  };
  var KEY = 'matjip.lang', lang = 'ko', subs = [];
  function valid(c){ return L.some(function(x){ return x[0] === c; }); }
  try {
    var s = localStorage.getItem(KEY);
    if (!valid(s)) { var n = (navigator.language || '').slice(0,2); s = valid(n) ? n : 'ko'; }
    lang = s;
  } catch(e) { var n2 = (navigator.language || '').slice(0,2); lang = valid(n2) ? n2 : 'ko'; }

  function t(k, v){
    var s = (D[lang] && D[lang][k]) || D.ko[k] || k;
    if (v) Object.keys(v).forEach(function(x){ s = s.split('{' + x + '}').join(v[x]); });
    return s;
  }
  function region(r){ return (R[lang] && R[lang][r]) || r; }
  function applyStatic(){
    document.documentElement.lang = lang;
    var m;
    document.querySelectorAll('[data-i18n]').forEach(function(e){ e.textContent = t(e.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-ph]').forEach(function(e){ e.placeholder = t(e.getAttribute('data-i18n-ph')); });
    document.querySelectorAll('[data-i18n-aria]').forEach(function(e){ e.setAttribute('aria-label', t(e.getAttribute('data-i18n-aria'))); });
    m = document.querySelector('meta[name=description]'); if (m) m.content = t('desc');
    document.querySelectorAll('.lang button').forEach(function(b){
      var on = b.getAttribute('data-lang') === lang;
      b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.classList.toggle('on', on);
    });
  }
  function set(c){
    if (!valid(c)) return;
    lang = c;
    try { localStorage.setItem(KEY, c); } catch(e) {}
    applyStatic();
    subs.forEach(function(f){ f(); });
  }
  function mount(){
    document.querySelectorAll('.lang').forEach(function(box){
      box.setAttribute('role','group'); box.setAttribute('aria-label','Language');
      box.innerHTML = L.map(function(x){
        return '<button type="button" data-lang="' + x[0] + '" lang="' + x[0] + '">' + x[1] + '</button>';
      }).join('');
      box.addEventListener('click', function(e){
        var b = e.target.closest('button[data-lang]'); if (b) set(b.getAttribute('data-lang'));
      });
    });
    applyStatic();
  }
  window.I18N = { t:t, region:region, set:set, get:function(){ return lang; }, onChange:function(f){ subs.push(f); }, apply:applyStatic };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
