# 正物流進貨作業：總覽
歡迎來到 **JIT FBS相關問題** 知識庫
以下為各大分類的流程與可能在 PDA 上顯示的錯誤彙整。 
點選右上角 🌓 ，支援深色模式~
👉 點擊分類名稱可展開詳細步驟與錯誤清單。

---

<details open>
<summary><strong>📦 Pre-sort 初分揀</strong></summary>

**流程：**  
刷區域 QR code → 刷 ASN / Seller TO / SPTO → 看商品外觀 → 刷商品 UPC / SKUID → PDA 顯示工位 → 播種牆亮燈 → 投入揀貨箱 → 拍燈 → 綁箱(步驟1. 刷工位 QRcode → 步驟2. 刷 Device ID) → 綁箱成功）

**可能錯誤：**  
此區域已超過三人、無區域資料、container_no 尚無資料、  
訂單已無需預分揀資料、條碼格式錯誤、...（略）

👉 [查看詳細說明](#/Pre-sort/overview.md)

</details>

---

<details open>
<summary><strong>🧾 分貨</strong></summary>

**流程：**  
開啟分貨模組 → 刷 Device ID → PDA顯示對應Mainsort撥種牆編號 → 推至分貨區地面對應編號 → 疊箱 → 待滿落時，推至對應Mainsort撥種牆 → 分貨完成

**可能錯誤：**  
此揀貨箱尚未有訂單，此為空箱、刷讀內容非揀貨箱號格式、  
無區域工位模組資料、楊梅/安南跨倉轉運。  

👉 [查看詳細說明](#/分貨/overview.md)

</details>

---

<details open>
<summary><strong>🏗️ Main-sort 主分揀</strong></summary>

**流程：**  
刷區域 QR code → 刷 Device ID → 刷商品 SKUID → PDA 顯示工位、播種牆亮燈 → 拍燈 → 關箱(步驟1. 刷區域 QR code → 步驟2. 刷 TO 單) → 綁箱成功

**可能錯誤：**  
此區域已超過三人、無區域資料、此揀貨箱尚未有訂單、  
工位不存在、TO 單門市錯誤、TO 重複綁定、...（略）

👉 [查看詳細說明](#/Main-sort/overview.md)

</details>
