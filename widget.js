/* 祈願板 widget.js v3 － 佈告欄版（GitHub Pages 管道＋主站備援，請存成 UTF-8）
 * 貼在 CMS 萬用欄位：
 * <div id="wish-widget" data-rows="2" data-chars="36" data-auto="0" data-title=""></div>
 * <script src="https://cisiancjyang.github.io/wish-board/widget.js?v=3" charset="utf-8" defer></script>
 * 參數：data-rows 每頁掛幾排（預設 2）｜data-chars 卡片預覽字數（預設 36）
 *       data-auto 自動翻頁秒數（預設 0＝不自動翻）｜data-max 最多載入幾則（預設 100）｜data-title 自訂標題 */
(function () {
  var me = document.currentScript;
  var base = me ? me.src.replace(/[^\/]*$/, '') : 'https://cisiancjyang.github.io/wish-board/';
  var SITE = 'https://cisian.free.nf/Wish/'; // 祈願主站（「我要祈願」「看全部」一律連回這裡）
  var CELL = 128, ROWH = 196;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var current = null, lastBtn = null;

  var CSS = `
:host{display:block}*{box-sizing:border-box}
.bd{position:relative;font-family:"Noto Serif TC","PingFang TC","Microsoft JhengHei",serif;color:#3b2a1a;padding:14px 14px 12px;border:12px solid #7a4a22;border-radius:12px;
 background:radial-gradient(circle at 20% 30%,#0000 0 1.5px,#0002 2px,#0000 3px) 0 0/26px 26px,radial-gradient(circle at 70% 60%,#fff2 0 1.5px,#0000 2.5px) 0 0/34px 34px,linear-gradient(135deg,#d8b278,#c79a5e 55%,#d3ad72);
 box-shadow:inset 0 0 0 2px #a8713a,inset 0 8px 22px rgba(0,0,0,.35),0 8px 22px rgba(0,0,0,.28)}
.hd{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px}
.hd b{font-size:20px;letter-spacing:.12em;color:#fbe9c0;background:linear-gradient(#a8261d,#7d1711);padding:6px 20px;border-radius:6px;box-shadow:0 3px 6px rgba(0,0,0,.4),inset 0 0 0 2px #e8c26a}
.hd a{display:inline-block;margin-left:6px;padding:6px 16px;border-radius:999px;background:#b3261e;color:#fff;text-decoration:none;font-size:14px;box-shadow:0 2px 4px rgba(0,0,0,.3)}
.hd a.o{background:#fff8e6;color:#8e1b15;border:1px solid #b3261e}
.g{display:grid;grid-auto-rows:${ROWH}px}
.c{position:relative;padding:16px 8px 0}
.c:before{content:"";position:absolute;top:0;left:0;right:0;height:11px;background:linear-gradient(#e0453a,#8e1b15);box-shadow:0 2px 4px rgba(0,0,0,.4)}
.d{animation:drop .55s cubic-bezier(.3,1.4,.5,1) both;animation-delay:var(--s)}
@keyframes drop{from{opacity:0;transform:translateY(-18px)}to{opacity:1;transform:none}}
.e{display:block;position:relative;width:100%;max-width:150px;margin:0 auto;padding:0;border:0;background:none;font:inherit;color:inherit;text-align:left;cursor:pointer;
 transform-origin:50% 0;transform:rotate(var(--r));animation:sway var(--t) ease-in-out infinite;animation-delay:var(--w);filter:drop-shadow(0 5px 5px rgba(0,0,0,.35))}
.e:before{content:"";position:absolute;left:50%;top:-6px;width:2px;height:26px;margin-left:-1px;background:#d6352b;z-index:2;box-shadow:-7px 4px 0 #d6352b,7px 4px 0 #d6352b}
@keyframes sway{0%,100%{transform:rotate(var(--r))}50%{transform:rotate(calc(var(--r)*-.7))}}
.c:hover .e,.e:focus-visible{animation-play-state:paused}
.e:hover .p{filter:brightness(1.07)}
.e:focus-visible{outline:3px solid #fff;outline-offset:4px}
.p{clip-path:polygon(50% 0,100% 15%,100% 100%,0 100%,0 15%);background:#a97b43;padding:4px;padding-top:5px}
.i{clip-path:polygon(50% 0,100% 15%,100% 100%,0 100%,0 15%);height:168px;padding:26px 9px 8px;display:flex;flex-direction:column;
 background:repeating-linear-gradient(95deg,#0000 0 6px,#a9783a14 6px 7px),linear-gradient(160deg,#f3dcaa,#e2bd7c)}
.k{text-align:center;font-size:12px;font-weight:700;color:#8e1b15}
.t{flex:1;margin:5px 0;font-size:13.5px;line-height:1.55;overflow:hidden;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;word-break:break-word}
.l{flex:1;display:flex;align-items:center;justify-content:center;color:#7a5a2c;font-size:13px}
.f{font-size:11.5px;color:#6d5330;display:flex;justify-content:space-between;line-height:1.5}
.m0{padding:36px;text-align:center;color:#fbe9c0;font-size:15px}
.pg{display:flex;justify-content:center;align-items:center;flex-wrap:wrap;gap:10px;margin-top:8px}
.pg button{min-width:36px;height:36px;border-radius:999px;border:0;background:#7d1711;color:#fbe9c0;font-size:20px;line-height:1;cursor:pointer;box-shadow:0 2px 4px rgba(0,0,0,.35)}
.pg button:disabled{opacity:.35;cursor:default}
.pg .n{background:rgba(60,30,10,.8);color:#fbe9c0;padding:7px 16px;border-radius:999px;font-size:13px}
.ov{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(30,15,5,.58)}
.m{position:relative;width:min(92vw,400px);filter:drop-shadow(0 12px 24px rgba(0,0,0,.5))}
.m:before{content:"";position:absolute;left:50%;top:-18px;width:2px;height:34px;margin-left:-1px;background:#d6352b;z-index:2;box-shadow:-9px 6px 0 #d6352b,9px 6px 0 #d6352b}
.x{position:absolute;top:-6px;right:-6px;z-index:3;width:34px;height:34px;border-radius:50%;border:2px solid #fff;background:#b3261e;color:#fff;font-size:15px;line-height:1;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.4)}
.mp{clip-path:polygon(50% 0,100% 36px,100% 100%,0 100%,0 36px);background:#a97b43;padding:6px;padding-top:8px}
.mi{clip-path:polygon(50% 0,100% 33px,100% 100%,0 100%,0 33px);max-height:min(78vh,560px);display:flex;flex-direction:column;padding:46px 22px 18px;
 background:repeating-linear-gradient(95deg,#0000 0 6px,#a9783a14 6px 7px),linear-gradient(160deg,#f3dcaa,#e2bd7c)}
.mi>*{animation:rise .45s .2s both}
@keyframes rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.mk{text-align:center;font-size:15px;font-weight:700;color:#8e1b15;letter-spacing:.08em}
.mt{flex:1;min-height:70px;overflow-y:auto;margin:12px 0;font-size:16px;line-height:1.85;white-space:pre-wrap;word-break:break-word}
.ml{flex:1;display:flex;align-items:center;justify-content:center;min-height:90px;color:#7a5a2c;font-size:15px;margin:12px 0}
.mr{background:#fff7;border-left:4px solid #b3261e;padding:8px 10px;font-size:14px;line-height:1.7;margin-bottom:10px;white-space:pre-wrap;word-break:break-word;max-height:120px;overflow-y:auto}
.mf{display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px;font-size:13px;color:#6d5330}
@media(prefers-reduced-motion:reduce){.e,.d,.mi>*{animation:none}}
`;

  function el(tag, cls, txt) { var n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; }
  function cut(s, n) { s = String(s || ''); return s.length > n ? s.slice(0, n) + '\u2026' : s; }
  function pad(n) { return n < 10 ? '0' + n : n; }
  function dt(ts) { var d = new Date(ts * 1000); return d.getFullYear() + '/' + pad(d.getMonth() + 1) + '/' + pad(d.getDate()); }

  /* ---------- 開啟／關閉留言（從被點的祈願牌放大展開） ---------- */
  function openModal(root, it, src) {
    if (current) closeModal(true);
    lastBtn = src;
    var ov = el('div', 'ov'); ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', '祈願內容');
    var m = el('div', 'm'), x = el('button', 'x', '\u2715'); x.type = 'button'; x.setAttribute('aria-label', '關閉');
    var mp = el('div', 'mp'), mi = el('div', 'mi');
    mi.appendChild(el('div', 'mk', (it.pin ? '\ud83d\udccc ' : '') + it.ci + ' ' + it.cl));
    mi.appendChild(it.lock ? el('div', 'ml', '\ud83d\udd12 這是一則私密祈願，內容不公開') : el('div', 'mt', it.text));
    if (it.reply) mi.appendChild(el('div', 'mr', '\u26e9\ufe0f 回覆：' + it.reply));
    var f = el('div', 'mf'); f.appendChild(el('span', '', '\u2014 ' + (it.name || '匿名')));
    f.appendChild(el('span', '', '\ud83d\ude4f' + it.likes + '　' + dt(it.ts))); mi.appendChild(f);
    mp.appendChild(mi); m.appendChild(x); m.appendChild(mp); ov.appendChild(m); root.appendChild(ov);
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

  /* ---------- 建立佈告欄 ---------- */
  function build(host) {
    var F = window.WISH_FEED;
    var rows = parseInt(host.getAttribute('data-rows')) || 2;
    var chars = parseInt(host.getAttribute('data-chars')) || 36;
    var auto = parseFloat(host.getAttribute('data-auto')) || 0;
    var max = parseInt(host.getAttribute('data-max')) || 100;
    var items = (F && F.items) ? F.items.slice(0, max) : [];
    var root = host.attachShadow ? (host.shadowRoot || host.attachShadow({ mode: 'open' })) : host;
    root.innerHTML = '';
    var st = el('style'); st.textContent = CSS; root.appendChild(st);
    var bd = el('div', 'bd'); root.appendChild(bd);

    var hd = el('div', 'hd');
    hd.appendChild(el('b', '', '\u26e9\ufe0f ' + (host.getAttribute('data-title') || (F && F.title) || '祈願板')));
    var bt = el('span');
    var a1 = el('a', '', '我要祈願'); a1.href = SITE + 'index.php'; a1.target = '_blank'; a1.rel = 'noopener';
    var a2 = el('a', 'o', '看全部' + (F ? '（' + F.total + '）' : '')); a2.href = SITE + 'index.php'; a2.target = '_blank'; a2.rel = 'noopener';
    bt.appendChild(a1); bt.appendChild(a2); hd.appendChild(bt); bd.appendChild(hd);

    if (!items.length) {
      bd.appendChild(el('div', 'm0', F ? '\ud83c\udf38 還沒有祈願牌，歡迎成為第一位祈願者！' : '祈願資料載入中\u2026'));
      return;
    }
    var g = el('div', 'g'), pg = el('div', 'pg'); bd.appendChild(g); bd.appendChild(pg);
    var page = 0, perPage = 0, pages = 1, hover = false;

    function card(it, idx) {
      var c = el('div', 'c'), d = el('div', 'd'), b = el('button', 'e');
      c.style.setProperty('--s', (idx * 60) + 'ms');
      b.type = 'button';
      b.style.setProperty('--r', [-2, 1.6, -1, 2.2, -1.7][it.id % 5] + 'deg');
      b.style.setProperty('--t', (5 + (it.id % 4) * 0.8) + 's');
      b.style.setProperty('--w', '-' + (it.id % 7) + 's');
      b.setAttribute('aria-label', '開啟祈願：' + it.cl + '，' + (it.name || '匿名'));
      var p = el('div', 'p'), i = el('div', 'i');
      i.appendChild(el('div', 'k', (it.pin ? '\ud83d\udccc ' : '') + it.ci + ' ' + it.cl));
      i.appendChild(it.lock ? el('div', 'l', '\ud83d\udd12 私密祈願') : el('div', 't', cut(it.text, chars)));
      var f1 = el('div', 'f'); f1.appendChild(el('span', '', '\u2014 ' + (it.name || '匿名'))); f1.appendChild(el('span', '', '\ud83d\ude4f' + it.likes)); i.appendChild(f1);
      var f2 = el('div', 'f'); f2.appendChild(el('span', '', dt(it.ts))); if (it.reply) f2.appendChild(el('span', '', '\u26e9\ufe0f')); i.appendChild(f2);
      p.appendChild(i); b.appendChild(p); d.appendChild(b); c.appendChild(d);
      b.addEventListener('click', function () { openModal(root, it, b); });
      return c;
    }

    function renderPager() {
      pg.innerHTML = '';
      if (pages <= 1) return;
      var pv = el('button', '', '\u2039'), nx = el('button', '', '\u203a');
      pv.type = nx.type = 'button'; pv.setAttribute('aria-label', '上一頁'); nx.setAttribute('aria-label', '下一頁');
      pv.disabled = page <= 0; nx.disabled = page >= pages - 1;
      pv.onclick = function () { go(page - 1); }; nx.onclick = function () { go(page + 1); };
      pg.appendChild(pv); pg.appendChild(el('span', 'n', '第 ' + (page + 1) + ' / ' + pages + ' 頁（共 ' + items.length + ' 則）')); pg.appendChild(nx);
    }

    function renderPage() {
      g.innerHTML = '';
      items.slice(page * perPage, page * perPage + perPage).forEach(function (it, k) { g.appendChild(card(it, k)); });
      renderPager();
    }
    function go(n) { page = Math.max(0, Math.min(pages - 1, n)); renderPage(); }

    function layout() {
      var w = g.clientWidth || 600, cols = Math.max(1, Math.floor(w / CELL)), pp = cols * rows;
      g.style.gridTemplateColumns = 'repeat(' + cols + ',1fr)';
      g.style.minHeight = (Math.min(rows, Math.ceil(items.length / cols)) * ROWH) + 'px';
      if (pp !== perPage) {
        var first = page * (perPage || pp);
        perPage = pp; pages = Math.max(1, Math.ceil(items.length / perPage)); page = Math.floor(first / perPage);
        renderPage();
      }
    }
    layout();
    if (window.ResizeObserver) new ResizeObserver(layout).observe(g); else window.addEventListener('resize', layout);

    if (auto > 0) {
      bd.addEventListener('mouseenter', function () { hover = true; });
      bd.addEventListener('mouseleave', function () { hover = false; });
      setInterval(function () { if (document.hidden || hover || current || pages <= 1) return; go(page + 1 >= pages ? 0 : page + 1); }, auto * 1000);
    }
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
