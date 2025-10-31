# JIT FBS相關問題（Markdown 靜態站）

此專案為多頁面 Markdown 靜態網站：
- 左側目錄由 `content/manifest.json` 定義
- 右側內容載入對應的 `.md`
- 支援深色模式、圖片、YouTube 內嵌
- 免費部署：Netlify（每次 push 自動發布）

## 內容結構
- 新增頁面：建立 `content/<分類>/<檔名>.md`，再到 `content/manifest.json` 加入項目
- 圖片丟入 `assets/images/`，Markdown 以相對路徑引用
- 網站名稱、logo、favicon 可替換 `index.html` 與 `/assets/` 內檔案

## 本地預覽
建議用任何靜態伺服器：
```bash
# Python 3
python -m http.server 8000

# Node
npx serve .
```
瀏覽：<http://localhost:8000>

## 部署到 Netlify（推薦）
1. 建一個 GitHub Repo，推上此專案。
2. 登入 Netlify → "Add new site" → "Import an existing project" → 連結你的 GitHub Repo。
3. Build 指令留空；Publish directory 設為 `.`。
4. 完成後，每次 push 到 `main`，Netlify 會自動部署。

## 常見維護
- 新增分類：在 `content/` 建子資料夾（例如 `WMS/`），並在 `manifest.json` 加一個 group。
- 更換圖示：替換 `/assets/logo.svg` 與 `/assets/favicon.svg`。
- 權限控制：若未來要加保護，可在 Netlify 設 Basic Auth（需付費方案）或改用 Cloudflare Access。
