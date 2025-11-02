/* app.js (revised)
 * - 避免重複 render/enable 呼叫
 * - 自動加強表格（No./序號欄固定）
 * - 品牌連結動態導向 manifest.default
 * - 更清晰的結構與註解
 */

// ------------------------------
// Utilities
// ------------------------------
function $(sel, root = document) { return root.querySelector(sel); }
function $all(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

// ------------------------------
// Markdown rendering
// ------------------------------
function renderMarkdownTo(html) {
  // 可在這裡加自訂轉換邏輯
  return html;
}

// ------------------------------
// 表格增強：固定「No./序號」欄位寬度
// ------------------------------
function enhanceTables(rootEl) {
  if (!rootEl) return;
  const tables = rootEl.querySelectorAll('table');
  tables.forEach(tbl => {
    tbl.classList.add('tbl');

    const firstTh = tbl.querySelector('thead th, tr th');
    const label = (firstTh?.textContent || '').trim().toLowerCase();

    // 只針對 No. / # / 序號
    const isNoCol = /^(no\.?|#|序號)$/.test(label);
    if (isNoCol) {
      tbl.classList.add('tbl--has-no');

      // 若沒有 colgroup，建立並插入
      let colgroup = tbl.querySelector('colgroup');
      if (!colgroup) {
        colgroup = document.createElement('colgroup');
        const cols = (tbl.querySelectorAll('tr:first-child th, tr:first-child td').length) || 1;
        for (let i = 0; i < cols; i++) {
          const col = document.createElement('col');
          if (i === 0) col.className = 'col-no';
          colgroup.appendChild(col);
        }
        tbl.insertBefore(colgroup, tbl.firstChild);
      } else {
        const firstCol = colgroup.querySelector('col') || document.createElement('col');
        firstCol.classList.add('col-no');
        if (!colgroup.contains(firstCol)) colgroup.prepend(firstCol);
      }
    }
  });
}

// ------------------------------
// 內文連結導向（讓 .md 走 hash routing）
// ------------------------------
function enableContentLinkRouting() {
  const contentEl = $('.content');
  if (!contentEl) return;

  contentEl.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;

    const href = a.getAttribute('href') || '';

    // 外部連結不處理
    if (/^(https?:|mailto:|tel:)/i.test(href)) return;

    // hash-only 不是 .md 的連結讓瀏覽器自己處理
    if (href.startsWith('#') && !href.endsWith('.md')) return;

    // .md 檔或相對路徑走 hash routing
    if (href.endsWith('.md') || (!href.includes(':') && href.includes('.md'))) {
      e.preventDefault();
      const next = href.startsWith('#') ? href : ('#' + href);
      if (location.hash !== next) {
        location.hash = next;
      } else {
        route();
      }
    }
  }, { capture: true });
}

// ------------------------------
// 載入 Markdown 檔案並渲染
// ------------------------------
async function loadMarkdown(url) {
  const contentEl = $('.content');
  if (!url) {
    if (contentEl) contentEl.innerHTML = '<p>沒有指定檔案。</p>';
    return;
  }

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

    const md = await res.text();
    let html;

    try {
      html = (window.marked && typeof window.marked.parse === 'function')
        ? window.marked.parse(md)
        : md;
    } catch (e) {
      if (contentEl) {
        contentEl.innerHTML = `
          <h1>渲染失敗</h1>
          <p>檔案成功載入，但 Markdown 轉換時發生錯誤。</p>
          <p><code>${url}</code></p>
          <pre>${String(e.message || e)}</pre>
        `;
      }
      console.error(e);
      return;
    }

    if (!contentEl) return;

    // 一次性渲染
    contentEl.innerHTML = renderMarkdownTo(html);

    // 增強表格與內文連結
    enhanceTables(contentEl);
    enableContentLinkRouting();

    // 捲到頂端
    window.scrollTo({ top: 0, behavior: 'instant' });

  } catch (err) {
    console.error(err);
    if (contentEl) {
      contentEl.innerHTML = `
        <h1>載入失敗</h1>
        <p>無法讀取檔案：<code>${url}</code></p>
        <pre>${String(err.message || err)}</pre>
      `;
    }
  }
}

// ------------------------------
// 側邊欄與主題切換
// ------------------------------
function initSidebarToggle() {
  const btn = $('#sidebarToggle');
  const sidebar = $('.sidebar');
  if (!btn || !sidebar) return;

  const applyState = (open) => {
    sidebar.classList.toggle('open', open);
    btn.setAttribute('aria-pressed', open ? 'true' : 'false');
  };

  btn.setAttribute('aria-label', '收合/展開側欄');
  btn.addEventListener('click', () => {
    const open = !sidebar.classList.contains('open');
    applyState(open);
  });
}

function initThemeToggle() {
  const btn = $('#themeToggle');
  if (!btn) return;

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch {}
  };

  let theme = 'light';
  try { theme = localStorage.getItem('theme') || theme; } catch {}
  applyTheme(theme);

  btn.addEventListener('click', () => {
    theme = (document.documentElement.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
    applyTheme(theme);
  });
}

// ------------------------------
// 路由控制
// ------------------------------
function getDefaultDoc() {
  try {
    if (window.manifest && window.manifest.default) return window.manifest.default;
  } catch {}
  return 'introoverview.md';
}

function route() {
  const hash = location.hash.replace(/^#/, '');
  const path = hash || getDefaultDoc();

  const items = $all('.sidebar a[data-doc]');
  items.forEach(a => {
    const doc = a.getAttribute('data-doc');
    a.classList.toggle('active', doc === path);
  });

  loadMarkdown(path);
}

// ------------------------------
// 品牌連結動態導向
// ------------------------------
function initBrandLink() {
  const brand = $('.brand');
  if (!brand) return;
  brand.addEventListener('click', (e) => {
    if (brand.tagName.toLowerCase() === 'a') {
      e.preventDefault();
      const target = '#' + getDefaultDoc();
      if (location.hash !== target) {
        location.hash = target;
      } else {
        route();
      }
    }
  });
}

// ------------------------------
// 初始化
// ------------------------------
function boot() {
  initSidebarToggle();
  initThemeToggle();
  initBrandLink();
  enableContentLinkRouting();
  window.addEventListener('hashchange', route);
  route();
}

document.addEventListener('DOMContentLoaded', boot);
