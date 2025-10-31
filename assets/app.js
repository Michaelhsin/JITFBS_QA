(() => {
  const contentEl = document.getElementById('content');
  const navEl = document.getElementById('sidebarNav') || document.createElement('div');
  const themeToggle = document.getElementById('themeToggle');
  const htmlEl = document.documentElement;

  const savedTheme = localStorage.getItem('theme') || 'light';
  htmlEl.setAttribute('data-theme', savedTheme);
  themeToggle?.addEventListener('click', () => {
    const next = htmlEl.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    htmlEl.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  if (window.marked) {
    marked.setOptions({ mangle: false, headerIds: false });
  }

  let manifest = null;
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

  function renderSidebar(data){
    navEl.innerHTML = '';
    data.groups.forEach(group => {
      const g = document.createElement('div');
      g.className = 'nav-group';

      const title = document.createElement('div');
      title.className = 'nav-group-title';
      title.textContent = group.title;
      g.appendChild(title);

      group.items.forEach(item => {
        const a = document.createElement('a');
        a.href = `#${item.path}`;
        a.textContent = item.title;
        a.className = 'nav-item';
        g.appendChild(a);
      });

      navEl.appendChild(g);
    });
    markActive();
  }

  function markActive(){
    const hash = location.hash.slice(1);
    [...document.querySelectorAll('.nav-item')].forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${hash}`);
    });
  }

  function route(){
    const first = manifest?.default || manifest?.groups?.[0]?.items?.[0]?.path;
    const hash = location.hash.slice(1) || first;
    if (!hash) {
      contentEl.innerHTML = `<p class="loading">目錄為空，請到 <code>content/manifest.json</code> 增加頁面。</p>`;
      return;
    }
    loadMarkdown(hash);
    markActive();
  }

  function slugify(str){
    return String(str)
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\u4e00-\u9fa5\- ]+/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .toLowerCase();
  }

  function addHeadingIds(container){
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

  function renderMarkdownTo(htmlString){
    const tmp = document.createElement('div');
    tmp.innerHTML = htmlString;
    addHeadingIds(tmp);
    return tmp.innerHTML;
  }

  function loadMarkdown(path){
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
