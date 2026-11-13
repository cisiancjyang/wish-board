/* 祈願板 widget.js v5 － 互動佈告欄版（GitHub Pages 管道＋主站備援，請存成 UTF-8）
 * 外觀與功能同 board.php：最新／熱門排序、關鍵字搜尋、頁碼分頁、分類浮水印小圖示、點閱數、花瓣與鳥居背景
 * 貼在 CMS 萬用欄位：
 * <div id="wish-widget" data-per="5" data-chars="40" data-title="" data-view-url=""></div>
 * <script src="https://cisiancjyang.github.io/wish-board/widget.js?v=5" charset="utf-8" defer></script>
 * 參數：data-per 每頁幾則（預設 5）｜data-chars 卡片預覽字數（預設 40）｜data-max 最多載入幾則（預設 100）
 *       data-title 自訂標題｜data-view-url 點閱計數端點（Apps Script 網頁應用程式網址，選填；不填則只顯示、不累計） */
(function () {
  var me = document.currentScript;
  var base = me ? me.src.replace(/[^\/]*$/, '') : 'https://cisiancjyang.github.io/wish-board/';
  var SITE = 'https://cisian.free.nf/Wish/'; // 祈願主站（「我要祈願」「看全部」一律連回這裡）

  var CSS = `
:host{display:block}*{box-sizing:border-box}
.bd{position:relative;font-family:"Noto Serif TC","PingFang TC","Microsoft JhengHei",serif;color:#3b2a1a;line-height:1.5;padding:14px 14px 64px;border:12px solid #7a4a22;border-radius:12px;
 background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 56' width='720' height='56'%3E%3Cpath d='M0 40 Q90 18 190 36 T380 34 T560 38 T720 40 L720 56 L0 56Z' fill='%239a6a3a' opacity='.45'/%3E%3Cpath d='M0 48 Q120 34 250 46 T470 44 T720 48 L720 56 L0 56Z' fill='%237a4a22' opacity='.55'/%3E%3Cpath d='M67.15 46 Q68.1 34.0 70 22 Q71.9 34.0 72.85 46Z' fill='%236b3f1d'/%3E%3Ccircle cx='59.5' cy='25.8' r='10.4' fill='%23f2a0b8'/%3E%3Ccircle cx='80.5' cy='26.8' r='9.5' fill='%23f2a0b8'/%3E%3Ccircle cx='70.0' cy='16.3' r='12.3' fill='%23f7b6c8'/%3E%3Ccircle cx='65.2' cy='29.6' r='8.5' fill='%23f9c9d6'/%3E%3Ccircle cx='76.7' cy='22.0' r='7.6' fill='%23f9c9d6'/%3E%3Cpath d='M147.6 47 Q148.4 37.0 150 27 Q151.6 37.0 152.4 47Z' fill='%236b3f1d'/%3E%3Ccircle cx='141.2' cy='30.2' r='8.8' fill='%23f2a0b8'/%3E%3Ccircle cx='158.8' cy='31.0' r='8.0' fill='%23f2a0b8'/%3E%3Ccircle cx='150.0' cy='22.2' r='10.4' fill='%23f7b6c8'/%3E%3Ccircle cx='146.0' cy='33.4' r='7.2' fill='%23f9c9d6'/%3E%3Ccircle cx='155.6' cy='27.0' r='6.4' fill='%23f9c9d6'/%3E%3Crect x='367.0' y='16' width='4.5' height='30' fill='%23b3261e'/%3E%3Crect x='388.5' y='16' width='4.5' height='30' fill='%23b3261e'/%3E%3Crect x='364.0' y='23' width='32' height='3.5' fill='%238e1b15'/%3E%3Cpath d='M357.0 16 Q380 9 403.0 16 L401.0 21 Q380 16 359.0 21Z' fill='%237d1711'/%3E%3Cpath d='M557 46 Q558 33.5 560 21 Q562 33.5 563 46Z' fill='%236b3f1d'/%3E%3Ccircle cx='549.0' cy='25.0' r='11.0' fill='%23f2a0b8'/%3E%3Ccircle cx='571.0' cy='26.0' r='10.0' fill='%23f2a0b8'/%3E%3Ccircle cx='560.0' cy='15.0' r='13.0' fill='%23f7b6c8'/%3E%3Ccircle cx='555.0' cy='29.0' r='9.0' fill='%23f9c9d6'/%3E%3Ccircle cx='567.0' cy='21.0' r='8.0' fill='%23f9c9d6'/%3E%3Cpath d='M637.6 47 Q638.4 37.5 640 28 Q641.6 37.5 642.4 47Z' fill='%236b3f1d'/%3E%3Ccircle cx='631.2' cy='31.2' r='8.8' fill='%23f2a0b8'/%3E%3Ccircle cx='648.8' cy='32.0' r='8.0' fill='%23f2a0b8'/%3E%3Ccircle cx='640.0' cy='23.2' r='10.4' fill='%23f7b6c8'/%3E%3Ccircle cx='636.0' cy='34.4' r='7.2' fill='%23f9c9d6'/%3E%3Ccircle cx='645.6' cy='28.0' r='6.4' fill='%23f9c9d6'/%3E%3C/svg%3E") repeat-x 0 100%/auto 56px,radial-gradient(circle at 20% 30%,#0000 0 1.5px,#0002 2px,#0000 3px) 0 0/26px 26px,radial-gradient(circle at 70% 60%,#fff2 0 1.5px,#0000 2.5px) 0 0/34px 34px,linear-gradient(135deg,#d8b278,#c79a5e 55%,#d3ad72);
 box-shadow:inset 0 0 0 2px #a8713a,inset 0 8px 22px rgba(0,0,0,.35),0 8px 22px rgba(0,0,0,.28)}
.hd{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px}
.hd b{font-size:20px;letter-spacing:.12em;color:#fbe9c0;background:linear-gradient(#a8261d,#7d1711);padding:6px 20px;border-radius:6px;box-shadow:0 3px 6px rgba(0,0,0,.4),inset 0 0 0 2px #e8c26a}
.hd a{display:inline-block;margin-left:6px;padding:6px 16px;border-radius:999px;background:#b3261e;color:#fff;text-decoration:none;font-size:14px;box-shadow:0 2px 4px rgba(0,0,0,.3)}
.hd a.o{background:#fff8e6;color:#8e1b15;border:1px solid #b3261e}
.tb{display:flex;flex-wrap:wrap;align-items:center;gap:8px 10px;margin-bottom:12px}
.tabs{display:flex;gap:6px}
.tab{border:0;cursor:pointer;font:inherit;font-size:14px;padding:6px 16px;border-radius:999px;background:rgba(60,30,10,.8);color:#fbe9c0;box-shadow:0 2px 4px rgba(0,0,0,.3)}
.tab.on{background:#fff8e6;color:#8e1b15;box-shadow:inset 0 0 0 2px #b3261e,0 2px 4px rgba(0,0,0,.3)}
.rs{font-size:13px;color:#fbe9c0;background:rgba(60,30,10,.8);padding:4px 12px;border-radius:999px}
.sb{position:relative;flex:1;min-width:150px;max-width:300px;margin-left:auto}
.sb input{display:block;width:100%;height:34px;border-radius:999px;border:2px solid #7a4a22;background:#fff8e6;padding:0 34px 0 14px;font:inherit;font-size:14px;color:#3b2a1a;outline:none}
.sb input:focus{border-color:#b3261e;box-shadow:0 0 0 3px rgba(179,38,30,.25)}
.sb button{display:none;position:absolute;right:4px;top:4px;width:26px;height:26px;border:0;border-radius:50%;background:#b3261e;color:#fff;font-size:12px;line-height:1;cursor:pointer}
.sb.has button{display:block}
mark{background:#ffe27a;color:#7d1711;border-radius:3px;padding:0 1px}
.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(128px,1fr));grid-auto-rows:196px;min-height:196px}
.empty{grid-column:1/-1;padding:56px 12px;text-align:center;color:#fbe9c0;font-size:15px;background:rgba(60,30,10,.55);border-radius:10px;margin-top:16px;height:120px}
.c{position:relative;padding:16px 8px 0}
.c:before{content:"";position:absolute;top:0;left:0;right:0;height:11px;background:linear-gradient(#e0453a,#8e1b15);box-shadow:0 2px 4px rgba(0,0,0,.4)}
.d{animation:drop .5s cubic-bezier(.3,1.4,.5,1) backwards;animation-delay:var(--s)}
@keyframes drop{from{opacity:0;transform:translateY(-18px)}}
.e{display:block;position:relative;width:100%;max-width:150px;margin:0 auto;padding:0;border:0;background:none;font:inherit;color:inherit;text-align:left;cursor:pointer;
 transform-origin:50% 0;transform:rotate(var(--r));animation:sway var(--t) ease-in-out infinite;animation-delay:var(--w);filter:drop-shadow(0 5px 5px rgba(0,0,0,.35))}
.e:before{content:"";position:absolute;left:50%;top:-6px;width:2px;height:26px;margin-left:-1px;background:#d6352b;z-index:2;box-shadow:-7px 4px 0 #d6352b,7px 4px 0 #d6352b}
@keyframes sway{0%,100%{transform:rotate(var(--r))}50%{transform:rotate(calc(var(--r)*-.7))}}
.c:hover .e,.e:focus-visible{animation-play-state:paused}
.e:hover .p{filter:brightness(1.07)}
.e:focus-visible{outline:3px solid #fff;outline-offset:4px}
.p{clip-path:polygon(50% 0,100% 15%,100% 100%,0 100%,0 15%);background:#a97b43;padding:4px;padding-top:5px}
.i{position:relative;clip-path:polygon(50% 0,100% 15%,100% 100%,0 100%,0 15%);height:168px;padding:26px 9px 8px;display:flex;flex-direction:column;
 background:repeating-linear-gradient(95deg,#0000 0 6px,#a9783a14 6px 7px),linear-gradient(160deg,#f3dcaa,#e2bd7c)}
.i:after{content:var(--e);position:absolute;right:6px;bottom:30px;font-size:46px;line-height:1;opacity:.12;pointer-events:none}
.k{text-align:center;font-size:12px;font-weight:700;color:#8e1b15}
.t{flex:1;margin:5px 0;font-size:13.5px;line-height:1.55;overflow:hidden;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;word-break:break-word}
.l{flex:1;display:flex;align-items:center;justify-content:center;color:#7a5a2c;font-size:13px}
.f{font-size:11.5px;color:#6d5330;display:flex;justify-content:space-between;line-height:1.5}
.pg{display:flex;justify-content:center;align-items:center;flex-wrap:wrap;gap:8px;margin-top:8px}
.pg button{min-width:36px;height:36px;padding:0 6px;border-radius:999px;border:0;background:#7d1711;color:#fbe9c0;font:inherit;font-size:16px;line-height:1;cursor:pointer;box-shadow:0 2px 4px rgba(0,0,0,.35)}
.pg button.on{background:#fff8e6;color:#8e1b15;box-shadow:inset 0 0 0 2px #b3261e}
.pg button:disabled{opacity:.35;cursor:default}
.pg .n{background:rgba(60,30,10,.8);color:#fbe9c0;padding:7px 16px;border-radius:999px;font-size:13px}
.wpt{position:absolute;top:0;right:0;bottom:0;left:0;overflow:hidden;pointer-events:none;z-index:1}
.wpt i{position:absolute;top:-6%;left:var(--x);width:14px;height:14px;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M8 1 C13 4 15 10 8 15 C1 10 3 4 8 1Z' fill='%23f7b6c8'/%3E%3Cpath d='M8 1 L8 5' stroke='%23fff' stroke-width='.8' opacity='.7'/%3E%3C/svg%3E") center/contain no-repeat;opacity:.85;animation:wfall var(--t) linear infinite;animation-delay:var(--d)}
@keyframes wfall{0%{top:-6%;transform:translateX(0) rotate(0)}33%{transform:translateX(28px) rotate(120deg)}66%{transform:translateX(-18px) rotate(240deg)}100%{top:104%;transform:translateX(22px) rotate(360deg)}}
.ov{position:fixed;top:0;right:0;bottom:0;left:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(30,15,5,.58)}
.m{position:relative;width:min(92vw,400px);filter:drop-shadow(0 12px 24px rgba(0,0,0,.5))}
.m:before{content:"";position:absolute;left:50%;top:-18px;width:2px;height:34px;margin-left:-1px;background:#d6352b;z-index:2;box-shadow:-9px 6px 0 #d6352b,9px 6px 0 #d6352b}
.x{position:absolute;top:-6px;right:-6px;z-index:3;width:34px;height:34px;border-radius:50%;border:2px solid #fff;background:#b3261e;color:#fff;font-size:15px;line-height:1;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.4)}
.mp{clip-path:polygon(50% 0,100% 36px,100% 100%,0 100%,0 36px);background:#a97b43;padding:6px;padding-top:8px}
.mi{clip-path:polygon(50% 0,100% 33px,100% 100%,0 100%,0 33px);max-height:min(78vh,560px);display:flex;flex-direction:column;padding:46px 22px 18px;
 background:repeating-linear-gradient(95deg,#0000 0 6px,#a9783a14 6px 7px),linear-gradient(160deg,#f3dcaa,#e2bd7c)}
.mi>*{animation:rise .45s .2s backwards}
@keyframes rise{from{opacity:0;transform:translateY(8px)}}
.mk{text-align:center;font-size:15px;font-weight:700;color:#8e1b15;letter-spacing:.08em}
.mt{flex:1;min-height:70px;overflow-y:auto;margin:12px 0;font-size:16px;line-height:1.85;white-space:pre-wrap;word-break:break-word}
.ml{flex:1;display:flex;align-items:center;justify-content:center;min-height:90px;color:#7a5a2c;font-size:15px;margin:12px 0}
.mr{background:rgba(255,255,255,.45);border-left:4px solid #b3261e;padding:8px 10px;font-size:14px;line-height:1.7;margin-bottom:10px;white-space:pre-wrap;word-break:break-word;max-height:120px;overflow-y:auto}
.mf{display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px;font-size:13px;color:#6d5330}
@media(max-height:560px){.ov{padding:8px}.mi{max-height:94vh;padding:40px 18px 12px}.mt{margin:6px 0;font-size:15px;line-height:1.7;min-height:50px}.mr{max-height:70px}.ml{min-height:50px;margin:6px 0}}
@media(prefers-reduced-motion:reduce){.e,.d,.mi>*{animation:none}.wpt{display:none}}
`;

  function build(host) {
    var F = window.WISH_FEED || {};
    var viewUrl = host.getAttribute('data-view-url') || '';
    var D = {
      title: host.getAttribute('data-title') || F.title || '祈願板',
      site: SITE + 'index.php',
      total: F.total,
      per: parseInt(host.getAttribute('data-per')) || 5,
      chars: parseInt(host.getAttribute('data-chars')) || 40,
      items: (F.items || []).slice(0, parseInt(host.getAttribute('data-max')) || 100)
    };
    var items = D.items;
    var per = Math.max(2, D.per), chars = D.chars;
    var root = host.attachShadow ? (host.shadowRoot || host.attachShadow({ mode: 'open' })) : host;
    root.innerHTML = '';
    var st = document.createElement('style'); st.textContent = CSS; root.appendChild(st);
    var app = document.createElement('div'); root.appendChild(app);
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    var canTrack = !!viewUrl;  // 有填 data-view-url 才累計點閱數
    var tab = 'new', q = '', page = 0, pages = 1, list = [], terms = [], re = null, seen = {}, current = null, lastBtn = null;

    function el(tag, cls, txt) { var n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; }
    function tx(s) { return document.createTextNode(s); }
    function pad(n) { return n < 10 ? '0' + n : n; }
    function dt(ts) { var d = new Date(ts * 1000); return d.getFullYear() + '/' + pad(d.getMonth() + 1) + '/' + pad(d.getDate()); }
    function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

    /* ----- 關鍵字醒目標示 ----- */
    function hl(s) {
      var f = document.createDocumentFragment();
      s = String(s || '');
      if (!re) { f.appendChild(tx(s)); return f; }
      var last = 0, m; re.lastIndex = 0;
      while ((m = re.exec(s))) {
        if (m.index > last) f.appendChild(tx(s.slice(last, m.index)));
        f.appendChild(el('mark', '', m[0]));
        last = m.index + m[0].length;
        if (!m[0].length) re.lastIndex++;
      }
      if (last < s.length) f.appendChild(tx(s.slice(last)));
      return f;
    }
    function snippet(text) {   // 搜尋時，預覽改成「含關鍵字的那一段」
      var t = String(text || '').replace(/\s+/g, ' ').trim(), start = 0;
      if (terms.length) {
        var low = t.toLowerCase(), pos = -1;
        terms.forEach(function (w) { var p = low.indexOf(w); if (p >= 0 && (pos < 0 || p < pos)) pos = p; });
        if (pos > chars - 8) start = Math.max(0, pos - 8);
      }
      var f = document.createDocumentFragment();
      if (start > 0) f.appendChild(tx('\u2026'));
      f.appendChild(hl(t.slice(start, start + chars)));
      if (start + chars < t.length) f.appendChild(tx('\u2026'));
      return f;
    }

    /* ----- 點閱數 ----- */
    function track(it) {
      if (!canTrack || seen[it.id]) return;
      seen[it.id] = 1;
      try {
        var k = 'wv' + it.id, last = +localStorage.getItem(k) || 0;
        if (Date.now() - last < 6 * 3600 * 1000) return;   // 同一瀏覽器 6 小時內只算一次
        localStorage.setItem(k, String(Date.now()));
      } catch (e) {}
      it.views = (it.views || 0) + 1;
      try { new Image().src = viewUrl + (viewUrl.indexOf('?') < 0 ? '?' : '&') + 'view=' + it.id + '&t=' + Date.now(); } catch (e) {}
      var n = app.querySelector('[data-v="' + it.id + '"]'); if (n) n.textContent = '\ud83d\udc41' + it.views;
    }

    /* ----- 開啟／關閉留言 ----- */
    function openModal(it, src) {
      if (current) closeModal(true);
      lastBtn = src;
      var ov = el('div', 'ov'); ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', '祈願內容');
      var m = el('div', 'm'), x = el('button', 'x', '\u2715'); x.type = 'button'; x.setAttribute('aria-label', '關閉');
      var mp = el('div', 'mp'), mi = el('div', 'mi');
      mi.appendChild(el('div', 'mk', (it.pin ? '\ud83d\udccc ' : '') + it.ci + ' ' + it.cl));
      if (it.lock) mi.appendChild(el('div', 'ml', '\ud83d\udd12 這是一則私密祈願，內容不公開'));
      else { var mt = el('div', 'mt'); mt.appendChild(hl(it.text)); mi.appendChild(mt); }
      if (it.reply) mi.appendChild(el('div', 'mr', '\u26e9\ufe0f 回覆：' + it.reply));
      var f = el('div', 'mf'); f.appendChild(el('span', '', '\u2014 ' + (it.name || '匿名')));
      var fv = el('span', '', '\ud83d\udc41' + (it.views || 0) + '　\ud83d\ude4f' + it.likes + '　' + dt(it.ts)); f.appendChild(fv); mi.appendChild(f);
      mp.appendChild(mi); m.appendChild(x); m.appendChild(mp); ov.appendChild(m); app.appendChild(ov);
      current = ov;
      ov.addEventListener('click', function (e) { if (e.target === ov) closeModal(); });
      x.addEventListener('click', function () { closeModal(); });
      x.focus();
      if (m.animate && !reduce && src && src.getBoundingClientRect) {
        var a = src.getBoundingClientRect(), b = m.getBoundingClientRect();
        var dx = a.left + a.width / 2 - (b.left + b.width / 2), dy = a.top + a.height / 2 - (b.top + b.height / 2);
        var s = Math.max(.12, a.width / b.width);
        m.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + s + ')', opacity: .3 }, { transform: 'none', opacity: 1 }],
          { duration: 480, easing: 'cubic-bezier(.2,1.1,.3,1)' });
        ov.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260 });
      }
      var before = it.views || 0;
      track(it);
      if ((it.views || 0) !== before) fv.textContent = '\ud83d\udc41' + it.views + '　\ud83d\ude4f' + it.likes + '　' + dt(it.ts);
    }
    function closeModal(now) {
      var ov = current; if (!ov) return; current = null;
      var m = ov.querySelector('.m');
      function done() { if (ov.parentNode) ov.parentNode.removeChild(ov); if (lastBtn && lastBtn.isConnected && lastBtn.focus) lastBtn.focus(); }
      if (now || reduce || !m || !m.animate) { done(); return; }
      var r = lastBtn && lastBtn.isConnected ? lastBtn.getBoundingClientRect() : null, to;
      if (r && r.width) {
        var b = m.getBoundingClientRect();
        to = { transform: 'translate(' + (r.left + r.width / 2 - (b.left + b.width / 2)) + 'px,' + (r.top + r.height / 2 - (b.top + b.height / 2)) + 'px) scale(' + Math.max(.12, r.width / b.width) + ')', opacity: 0 };
      } else to = { transform: 'scale(.9)', opacity: 0 };
      var an = m.animate([{ transform: 'none', opacity: 1 }, to], { duration: 280, easing: 'ease-in', fill: 'forwards' });
      ov.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 280, fill: 'forwards' });
      an.onfinish = done;
    }
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && current) closeModal(); });

    /* ----- 版面骨架 ----- */
    var bd = el('div', 'bd'); app.appendChild(bd);
    var pet = el('div', 'wpt');
    [[6, 11, -2], [17, 14, -7], [30, 10, -4], [44, 13, -9], [58, 12, -1], [71, 15, -6], [84, 11, -10], [93, 13, -3]].forEach(function (p) {
      var i = el('i'); i.style.setProperty('--x', p[0] + '%'); i.style.setProperty('--t', p[1] + 's'); i.style.setProperty('--d', p[2] + 's'); pet.appendChild(i);
    });
    bd.appendChild(pet);

    var hd = el('div', 'hd');
    hd.appendChild(el('b', '', '\u26e9\ufe0f ' + (D.title || '祈願板')));
    var bt = el('span');
    var a1 = el('a', '', '我要祈願'); a1.href = D.site; a1.target = '_blank'; a1.rel = 'noopener';
    var a2 = el('a', 'o', '看全部（' + (D.total || items.length) + '）'); a2.href = D.site; a2.target = '_blank'; a2.rel = 'noopener';
    bt.appendChild(a1); bt.appendChild(a2); hd.appendChild(bt); bd.appendChild(hd);

    var tb = el('div', 'tb'), tabs = el('div', 'tabs');
    var tNew = el('button', 'tab on', '\ud83d\udd50 最新'), tHot = el('button', 'tab', '\ud83d\udd25 熱門');
    tNew.type = tHot.type = 'button';
    tabs.appendChild(tNew); tabs.appendChild(tHot); tb.appendChild(tabs);
    var rs = el('span', 'rs'); rs.style.display = 'none'; tb.appendChild(rs);
    var sb = el('div', 'sb'), inp = el('input'), clr = el('button', '', '\u2715');
    inp.type = 'text'; inp.placeholder = '\ud83d\udd0d 搜尋關鍵字\u2026'; inp.maxLength = 40; inp.autocomplete = 'off'; inp.setAttribute('aria-label', '搜尋祈願');
    clr.type = 'button'; clr.setAttribute('aria-label', '清除搜尋');
    sb.appendChild(inp); sb.appendChild(clr); tb.appendChild(sb); bd.appendChild(tb);

    var g = el('div', 'g'), pg = el('div', 'pg'); bd.appendChild(g); bd.appendChild(pg);

    /* ----- 排序、搜尋 ----- */
    function newCmp(a, b) { return (b.pin - a.pin) || (b.ts - a.ts) || (b.id - a.id); }
    function hotCmp(a, b) { return ((b.views || 0) - (a.views || 0)) || (b.likes - a.likes) || (b.ts - a.ts) || (b.id - a.id); }
    function match(it) {
      if (!terms.length) return true;
      var hay = (it.text + '\n' + it.name + '\n' + it.cl + '\n' + it.reply).toLowerCase();
      for (var i = 0; i < terms.length; i++) if (hay.indexOf(terms[i]) < 0) return false;
      return true;
    }
    function refresh() {
      var raw = q.trim().toLowerCase();
      terms = raw ? raw.split(/\s+/).filter(Boolean) : [];
      re = terms.length ? new RegExp(terms.map(esc).join('|'), 'gi') : null;
      list = items.filter(match); list.sort(tab === 'hot' ? hotCmp : newCmp);
      pages = Math.max(1, Math.ceil(list.length / per)); if (page >= pages) page = pages - 1;
      rs.style.display = terms.length ? '' : 'none'; rs.textContent = '找到 ' + list.length + ' 則';
      renderPage();
    }

    /* ----- 畫祈願牌與分頁 ----- */
    function card(it, idx, rank) {
      var c = el('div', 'c'), d = el('div', 'd'), b = el('button', 'e');
      c.style.setProperty('--s', (idx * 60) + 'ms');
      b.type = 'button';
      b.style.setProperty('--r', [-2, 1.6, -1, 2.2, -1.7][it.id % 5] + 'deg');
      b.style.setProperty('--t', (5 + (it.id % 4)) + 's');
      b.style.setProperty('--w', '-' + (it.id % 7) + 's');
      b.style.setProperty('--e', "'" + it.ci + "'");
      b.setAttribute('aria-label', '開啟祈願：' + it.cl + '，' + (it.name || '匿名'));
      var medal = (tab === 'hot' && !terms.length && rank < 3 && (it.views || 0) > 0) ? ['\ud83e\udd47', '\ud83e\udd48', '\ud83e\udd49'][rank] + ' ' : '';
      var p = el('div', 'p'), i = el('div', 'i');
      i.appendChild(el('div', 'k', medal + (it.pin && tab === 'new' ? '\ud83d\udccc ' : '') + it.ci + ' ' + it.cl));
      if (it.lock) i.appendChild(el('div', 'l', '\ud83d\udd12 私密祈願'));
      else { var t = el('div', 't'); t.appendChild(snippet(it.text)); i.appendChild(t); }
      var f1 = el('div', 'f'), nm = el('span'); nm.appendChild(tx('\u2014 ')); nm.appendChild(hl(it.name || '匿名'));
      f1.appendChild(nm); f1.appendChild(el('span', '', '\ud83d\ude4f' + it.likes)); i.appendChild(f1);
      var f2 = el('div', 'f'), rt = el('span'), vs = el('span', '', '\ud83d\udc41' + (it.views || 0));
      vs.setAttribute('data-v', it.id); rt.appendChild(vs); if (it.reply) rt.appendChild(tx(' \u26e9\ufe0f'));
      f2.appendChild(el('span', '', dt(it.ts))); f2.appendChild(rt); i.appendChild(f2);
      p.appendChild(i); b.appendChild(p); d.appendChild(b); c.appendChild(d);
      b.addEventListener('click', function () { openModal(it, b); });
      return c;
    }
    function pbtn(label, fn, cls, dis, aria) {
      var b = el('button', cls || '', label); b.type = 'button'; if (dis) b.disabled = true; if (aria) b.setAttribute('aria-label', aria); b.onclick = fn; return b;
    }
    function go(n) { page = Math.max(0, Math.min(pages - 1, n)); renderPage(); }
    function renderPager() {
      pg.innerHTML = '';
      if (pages <= 1) return;
      pg.appendChild(pbtn('\u2039', function () { go(page - 1); }, '', page <= 0, '上一頁'));
      if (pages <= 9) { for (var p = 0; p < pages; p++) (function (p) { pg.appendChild(pbtn(String(p + 1), function () { go(p); }, p === page ? 'on' : '', false, '第 ' + (p + 1) + ' 頁')); })(p); }
      else pg.appendChild(el('span', 'n', '第 ' + (page + 1) + ' / ' + pages + ' 頁'));
      pg.appendChild(pbtn('\u203a', function () { go(page + 1); }, '', page >= pages - 1, '下一頁'));
    }
    function renderPage() {
      g.innerHTML = '';
      if (!list.length) {
        g.appendChild(el('div', 'empty', terms.length ? '\ud83d\udd0d 找不到符合「' + q.trim() + '」的祈願' : '\ud83c\udf38 還沒有祈願牌，歡迎成為第一位祈願者！'));
        renderPager(); return;
      }
      list.slice(page * per, page * per + per).forEach(function (it, k) { g.appendChild(card(it, k, page * per + k)); });
      renderPager();
    }

    /* ----- 事件 ----- */
    function setTab(t) { tab = t; tNew.className = 'tab' + (t === 'new' ? ' on' : ''); tHot.className = 'tab' + (t === 'hot' ? ' on' : ''); page = 0; refresh(); }
    tNew.onclick = function () { setTab('new'); }; tHot.onclick = function () { setTab('hot'); };
    var tm = null, composing = false;
    function onq() { q = inp.value; sb.className = 'sb' + (q ? ' has' : ''); clearTimeout(tm); tm = setTimeout(function () { page = 0; refresh(); }, 180); }
    inp.addEventListener('input', function (e) { if (e.isComposing || composing) return; onq(); });
    inp.addEventListener('compositionstart', function () { composing = true; });
    inp.addEventListener('compositionend', function () { composing = false; onq(); });
    clr.onclick = function () { inp.value = ''; onq(); inp.focus(); };

    refresh();
  }

  /* ---------- 載入資料：先 GitHub（與 widget.js 同位置），失敗再用主站 ---------- */
  function start() {
    var hosts = document.querySelectorAll('#wish-widget,[data-wish-widget]');
    if (!hosts.length) return;
    function run() { for (var i = 0; i < hosts.length; i++) build(hosts[i]); }
    var t = Math.floor(Date.now() / 300000); // 每 5 分鐘更新快取
    var FEEDS = [base + 'feed.js?t=' + t];
    if (base !== SITE) FEEDS.push(SITE + 'feed.js?t=' + t);
    function load(i) {
      if (i >= FEEDS.length) { run(); return; }
      var s = document.createElement('script');
      s.charset = 'utf-8'; s.src = FEEDS[i];
      // 被防機器人頁面擋住時 onload 可能仍會觸發，所以要確認資料真的載入
      s.onload = function () { if (window.WISH_FEED) run(); else load(i + 1); };
      s.onerror = function () { load(i + 1); };
      document.head.appendChild(s);
    }
    load(0);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
