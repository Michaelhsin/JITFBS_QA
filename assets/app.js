(() => {
  const contentEl = document.getElementById('content');
  const navEl = document.getElementById('sidebarNav') || document.createElement('div');
  const themeToggle = document.getElementById('themeToggle');
  const htmlEl = document.documentElement;
  // === Sidebar 收合/展開 ===
  document.addEventListener('DOMContentLoaded', () => {
    const layout = document.querySelector('.layout');
    const sidebar = document.querySelector('.sidebar');
    const actions = document.querySelector('.actions');

    if (!layout || !sidebar || !actions) return;

    // 建立按鈕（放在右上角 actions 區，與 🌗 並排）
    const btn = document.createElement('button');
    btn.id = 'sidebarToggle';
    btn.title = '收合/展開側欄';
    btn.textContent = '⟨⟩';           // 你要可改成「≡」或「⮜ / ⮞」
    actions.prepend(btn);

    // 還原上次狀態
    const KEY = 'sidebarCollapsed';
    const collapsed = localStorage.getItem(KEY) === '1';
    document.body.classList.toggle('sidebar-collapsed', collapsed);
    btn.setAttribute('aria-pressed', collapsed ? 'true' : 'false');

    // 點擊切換
    btn.addEventListener('click', () => {
      const willCollapse = !document.body.classList.contains('sidebar-collapsed');
      document.body.classList.toggle('sidebar-collapsed', willCollapse);
      localStorage.setItem(KEY, willCollapse ? '1' : '0');
      btn.setAttribute('aria-pressed', willCollapse ? 'true' : 'false');
    });
  });

  document.addEventListener('DOMContentLoaded', () => {
    const brand = document.querySelector('.brand');
    if (brand) {
     brand.style.cursor = 'pointer';
     brand.addEventListener('click', () => {
      location.hash = '#introoverview.md';
    });
  }
  });

  /* =========================
     題示：深/淺色主題切換
     ========================= */
  const savedTheme = localStorage.getItem('theme') || 'light';
  htmlEl.setAttribute('data-theme', savedTheme);
  themeToggle?.addEventListener('click', () => {
    const next = htmlEl.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    htmlEl.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  /* =========================
     題示：Marked 設定（若有）
     ========================= */
  if (window.marked) {
    marked.setOptions({ mangle: false, headerIds: false });
  }

  let manifest = null;

  /* =========================
     載入 manifest.json
     ========================= */
  fetch('./content/manifest.json', { cache: 'no-cache' })
    .then(r => {
      if (!r.ok) throw new Error(`載入 manifest.json 失敗，HTTP ${r.status}`);
      return r.json();
    })
    .then(json => {
      manifest = json;
      if (navEl && navEl.id === 'sidebarNav') {
        renderSidebar(json);
      }
      route();
      window.addEventListener('hashchange', route);
    })
    .catch(err => {
      if (navEl) navEl.textContent = '載入目錄失敗。';
      console.error(err);
    });

  /* =========================
     側欄：可摺疊群組
     - 預設全部摺疊
     - 點群組標題展開/收合
     - 記住展開狀態（localStorage）
     - 自動展開目前頁面所在群組
     ========================= */
  function renderSidebar(data) {
    navEl.innerHTML = '';

    // 從 localStorage 還原展開的群組
    const OPEN_KEY = 'sidebarOpenGroups';
    const opened = new Set(JSON.parse(localStorage.getItem(OPEN_KEY) || '[]'));

    // 目前路徑（用於渲染後自動開啟所在群組）
    const currentPath = location.hash.slice(1) || data?.default || data?.groups?.[0]?.items?.[0]?.path;

    data.groups.forEach(group => {
      const groupContainer = document.createElement('div');
      groupContainer.className = 'nav-group';

      // 群組標題
      const groupTitle = document.createElement('div');
      groupTitle.className = 'nav-group-title collapsible';
      groupTitle.textContent = group.title;

      // 子項容器
      const itemsContainer = document.createElement('div');
      itemsContainer.className = 'nav-group-items';
      itemsContainer.style.display = 'none'; // 預設摺疊

      // 生成子項
      (group.items || []).forEach(item => {
        const itemLink = document.createElement('a');
        itemLink.href = `#${item.path}`;
        itemLink.textContent = item.title;
        itemLink.className = 'nav-item';
        itemsContainer.appendChild(itemLink);
      });

      // 點擊群組標題切換
      groupTitle.addEventListener('click', () => {
        const willOpen = itemsContainer.style.display !== 'block';
        itemsContainer.style.display = willOpen ? 'block' : 'none';
        groupTitle.classList.toggle('open', willOpen);

        // 記住展開狀態
        if (willOpen) opened.add(group.title);
        else opened.delete(group.title);
        localStorage.setItem(OPEN_KEY, JSON.stringify([...opened]));
      });

      // 若該群組包含目前頁面 → 強制展開
      const containsCurrent = (group.items || []).some(it => it.path === currentPath);
      if (containsCurrent || opened.has(group.title)) {
        itemsContainer.style.display = 'block';
        groupTitle.classList.add('open');
        opened.add(group.title);
      }

      // 組裝
      groupContainer.appendChild(groupTitle);
      groupContainer.appendChild(itemsContainer);
      navEl.appendChild(groupContainer);
    });

    // 同步 active 樣式
    markActive();
  }

  /* =========================
     將目前頁面對應的連結加上 .active
     ========================= */
  function markActive() {
    const hash = location.hash.slice(1);
    [...document.querySelectorAll('.nav-item')].forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${hash}`);
    });
  }

  /* =========================
     路由：根據 hash 載入對應 Markdown
     ========================= */
  function route() {
    const first = manifest?.default || manifest?.groups?.[0]?.items?.[0]?.path;
    const hash = location.hash.slice(1) || first;
    if (!hash) {
      contentEl.innerHTML = `<p class="loading">目錄為空，請到 <code>content/manifest.json</code> 增加頁面。</p>`;
      return;
    }
    loadMarkdown(hash);
    markActive();

    // 導航：自動展開目前頁面的群組（避免使用者從其他頁跳轉時看不到子項）
    const OPEN_KEY = 'sidebarOpenGroups';
    const opened = new Set(JSON.parse(localStorage.getItem(OPEN_KEY) || '[]'));
    [...document.querySelectorAll('.nav-group')].forEach(groupEl => {
      const titleEl = groupEl.querySelector('.nav-group-title');
      const itemsEl = groupEl.querySelector('.nav-group-items');
      if (!titleEl || !itemsEl) return;
      const hasCurrent = [...itemsEl.querySelectorAll('a.nav-item')].some(a => a.getAttribute('href') === `#${hash}`);
      if (hasCurrent) {
        itemsEl.style.display = 'block';
        titleEl.classList.add('open');
        opened.add(titleEl.textContent || '');
      }
    });
    localStorage.setItem(OPEN_KEY, JSON.stringify([...opened]));
  }

  /* =========================
     Markdown 內容渲染輔助
     - 自動補標題 id（方便內頁錨點）
     ========================= */
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

  /* =========================
     載入 Markdown 檔案
     ========================= */
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
        if (contentEl) contentEl.innerHTML = renderMarkdownTo(html);
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
