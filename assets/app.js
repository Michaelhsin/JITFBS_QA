(() => {
  const contentEl = document.getElementById('content') || document.querySelector('.content');
  // 更穩定：先找 #sidebarNav，找不到就用 .sidebar
  const navEl = document.getElementById('sidebarNav') || document.querySelector('.sidebar');
  const themeToggle = document.getElementById('themeToggle');
  const htmlEl = document.documentElement;

  /* -----------------------------
     整欄側欄：收合 / 展開（含動畫、記憶狀態與捲動位置）
     ----------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    const layout  = document.querySelector('.layout');
    const sidebar = document.querySelector('.sidebar');
    const actions = document.querySelector('.actions');
    if (!layout || !sidebar || !actions) return;

    // 建立按鈕（放在右上角 actions 區，與 🌗 並排）
    const btn = document.createElement('button');
    btn.id = 'sidebarToggle';
    btn.title = '收合/展開側欄';
    actions.prepend(btn);

    const KEY = 'sidebarCollapsed';
    const collapsed = localStorage.getItem(KEY) === '1';
    document.body.classList.toggle('sidebar-collapsed', collapsed);

    // 初始化圖示與 ARIA
    btn.textContent = collapsed ? '⮞' : '⮜';
    btn.setAttribute('aria-pressed', collapsed ? 'true' : 'false');
    btn.title = collapsed ? '展開側欄' : '收合側欄';

    btn.addEventListener('click', () => {
      // 記住目前左欄捲動位置，避免展開後回到頂端
      const y = sidebar.scrollTop;

      const willCollapse = !document.body.classList.contains('sidebar-collapsed');
      document.body.classList.toggle('sidebar-collapsed', willCollapse);
      localStorage.setItem(KEY, willCollapse ? '1' : '0');
      btn.setAttribute('aria-pressed', willCollapse ? 'true' : 'false');

      // 狀態提示：收合→⮞、展開→⮜
      btn.textContent = willCollapse ? '⮞' : '⮜';
      btn.title = willCollapse ? '展開側欄' : '收合側欄';

      // 展開後把捲動位置復原
      requestAnimationFrame(() => {
        if (!document.body.classList.contains('sidebar-collapsed')) {
          sidebar.scrollTop = y;
        }
      });
    });
  });

  /* -----------------------------
     點品牌回首頁
     ----------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    const brand = document.querySelector('.brand');
    if (brand) {
      brand.style.cursor = 'pointer';
      brand.addEventListener('click', () => {
        location.hash = '#introoverview.md';
      });
    }
  });

  /* -----------------------------
     深/淺色主題切換
     ----------------------------- */
  const savedTheme = localStorage.getItem('theme') || 'light';
  htmlEl.setAttribute('data-theme', savedTheme);
  themeToggle?.addEventListener('click', () => {
    const next = htmlEl.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    htmlEl.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  /* -----------------------------
     Marked 設定（若有）
     ----------------------------- */
  if (window.marked) {
    marked.setOptions({ mangle: false, headerIds: false });
  }

  let manifest = null;

  /* -----------------------------
     載入 manifest.json
     ----------------------------- */
  fetch('./content/manifest.json', { cache: 'no-cache' })
    .then(r => {
      if (!r.ok) throw new Error(`載入 manifest.json 失敗，HTTP ${r.status}`);
      return r.json();
    })
    .then(json => {
      manifest = json;
      // 只要拿得到 navEl 就渲染（不再限制一定是 #sidebarNav）
      if (navEl) renderSidebar(json);
      route();
      window.addEventListener('hashchange', route);
    })
    .catch(err => {
      if (navEl) navEl.textContent = '載入目錄失敗。';
      console.error(err);
    });

  /* -----------------------------
     側欄：群組可摺疊（記住展開狀態）
     ----------------------------- */
  function renderSidebar(data) {
    navEl.innerHTML = '';

    const OPEN_KEY = 'sidebarOpenGroups';
    const opened = new Set(JSON.parse(localStorage.getItem(OPEN_KEY) || '[]'));
    const currentPath = location.hash.slice(1) || data?.default || data?.groups?.[0]?.items?.[0]?.path;

    (data.groups || []).forEach(group => {
      const groupContainer = document.createElement('div');
      groupContainer.className = 'nav-group';

      const groupTitle = document.createElement('div');
      groupTitle.className = 'nav-group-title collapsible';
      groupTitle.textContent = group.title;

      const itemsContainer = document.createElement('div');
      itemsContainer.className = 'nav-group-items';
      itemsContainer.style.display = 'none';

      (group.items || []).forEach(item => {
        const a = document.createElement('a');
        a.href = `#${item.path}`;
        a.textContent = item.title;
        a.className = 'nav-item';
        itemsContainer.appendChild(a);
      });

      groupTitle.addEventListener('click', () => {
        const willOpen = itemsContainer.style.display !== 'block';
        itemsContainer.style.display = willOpen ? 'block' : 'none';
        groupTitle.classList.toggle('open', willOpen);
        if (willOpen) opened.add(group.title); else opened.delete(group.title);
        localStorage.setItem(OPEN_KEY, JSON.stringify([...opened]));
      });

      const containsCurrent = (group.items || []).some(it => it.path === currentPath);
      if (containsCurrent || opened.has(group.title)) {
        itemsContainer.style.display = 'block';
        groupTitle.classList.add('open');
        opened.add(group.title);
      }

      groupContainer.appendChild(groupTitle);
      groupContainer.appendChild(itemsContainer);
      navEl.appendChild(groupContainer);
    });

    markActive();
  }

  /* -----------------------------
     將目前頁面對應的連結加上 .active
     ----------------------------- */
  function markActive() {
    const hash = location.hash.slice(1);
    document.querySelectorAll('.nav-item').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${hash}`);
    });
  }

  /* -----------------------------
     路由
     ----------------------------- */
  function route() {
    const first = manifest?.default || manifest?.groups?.[0]?.items?.[0]?.path;
    const hash = location.hash.slice(1) || first;
    if (!hash) {
      contentEl.innerHTML = `<p class="loading">目錄為空，請到 <code>content/manifest.json</code> 增加頁面。</p>`;
      return;
    }
    loadMarkdown(hash);
    markActive();

    // 進頁後自動展開所在群組
    const OPEN_KEY = 'sidebarOpenGroups';
    const opened = new Set(JSON.parse(localStorage.getItem(OPEN_KEY) || '[]'));
    document.querySelectorAll('.nav-group').forEach(groupEl => {
      const titleEl = groupEl.querySelector('.nav-group-title');
      const itemsEl = groupEl.querySelector('.nav-group-items');
      if (!titleEl || !itemsEl) return;
      const hasCurrent = [...itemsEl.querySelectorAll('a.nav-item')]
        .some(a => a.getAttribute('href') === `#${hash}`);
      if (hasCurrent) {
        itemsEl.style.display = 'block';
        titleEl.classList.add('open');
        opened.add(titleEl.textContent || '');
      }
    });
    localStorage.setItem(OPEN_KEY, JSON.stringify([...opened]));
  }

  /* -----------------------------
     內頁工具：自動補標題 id
     ----------------------------- */
  function slugify(str) {
    return String(str)
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\u4e00-\u9fa5\- ]+/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .toLowerCase();
  }
  function addHeadingIds(container) {
    const hs = container.querySelectorAll('h1,h2,h3,h4,h5,h6');
    const seen = new Set();
    hs.forEach(h => {
      let id = h.id || slugify(h.textContent || '');
      if (!id) return;
      let base = id, i = 2;
      while (seen.has(id)) id = `${base}-${i++}`;
      seen.add(id);
      h.id = id;
    });
  }
  function renderMarkdownTo(htmlString) {
    const tmp = document.createElement('div');
    tmp.innerHTML = htmlString;
    addHeadingIds(tmp);
    return tmp.innerHTML;
  }

  /* -----------------------------
     讓內容內的 .md 連結自動走 hash（避免 404）
     ----------------------------- */
  function enableContentLinkRouting() {
    if (!contentEl) return;
    contentEl.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href') || '';

      // 外部連結 / 已是 hash / javascript: → 不處理
      if (/^https?:\/\//i.test(href) || href.startsWith('#') || href.startsWith('javascript:')) return;

      // 只攔站內 .md，轉成 hash 路由
      if (href.endsWith('.md')) {
        e.preventDefault();
        const normalized = href.replace(/^\.?\/?content\//, '');
        location.hash = `#${normalized}`;
      }
    }, { passive: false });
  }

  /* -----------------------------
     載入 Markdown 檔
     ----------------------------- */
  function loadMarkdown(path) {
    const url = `./content/${path}`;
    if (contentEl) contentEl.innerHTML = `<div class="loading">載入內容中…</div>`;

    fetch(url, { cache: 'no-cache' })
      .then(async r => {
        if (!r.ok) throw new Error(`載入失敗（HTTP ${r.status}）：${url}`);
        const buf = await r.arrayBuffer();
        return new TextDecoder('utf-8').decode(buf);
      })
      .then(md => {
        let html;
        try {
          html = (window.marked ? marked.parse(md) : md);
        } catch (e) {
          console.error(e);
          if (contentEl) contentEl.innerHTML = `
            <h1>渲染失敗</h1>
            <p>檔案成功載入，但 Markdown 轉換時發生錯誤。</p>
            <p><code>${url}</code></p>
            <pre>${String(e.message || e)}</pre>
          `;
          return;
        }
        if (contentEl) {
          contentEl.innerHTML = renderMarkdownTo(html);
          enableContentLinkRouting(); // 讓內文連結走 hash
          document.body.dataset.page = path.replace('.md', '');
        }
        window.scrollTo({ top: 0, behavior: 'instant' });
      })
      .catch(err => {
        console.error(err);
        if (contentEl) contentEl.innerHTML = `
          <h1>找不到頁面</h1>
          <p>請求：<code>${url}</code></p>
          <pre>${String(err.message || err)}</pre>
        `;
      });
  }
})();
