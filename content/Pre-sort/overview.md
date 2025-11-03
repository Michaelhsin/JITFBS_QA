# Pre-sort 初分揀


```flow
刷區域 QR code → 刷 ASN / Seller TO / SPTO → 看商品外觀 → 刷商品 UPC / SKUID → PDA 顯示工位 → 播種牆亮燈 → 投入揀貨箱 → 拍燈 → 綁箱(步驟1. 刷工位 QRcode → 步驟2. 刷 Device ID) → 綁箱成功
```

<br>
&nbsp;
<br>

## 常見錯誤與處理方式（摘要）

| No. | PDA錯誤訊息／異常狀況 | 可能原因 | 處理方式 |
|--|---|---|---|
|1| 此區域已超過三人 | 區域人員超過三人 | 重新選擇區域或等待空位 |
|2| 無區域資料 | 無區域資料 | 在 Seatalk **live issue** 回報 **@FBS PM** 協助 |
|3| container_no: {container_no} 尚無資料 | SPTO 已無未分揀訂單 | 請現場回報給Joanna、Ashley、Toby |
|4| 訂單已無需預分揀資料，請刷讀其他訂單 | 當刷ASN / Seller TO 內已無未分揀訂單（含 JITSCS 整箱過期） | 交 LRT（原因:整箱過期，因此不拆箱） |
|5| sorting_group_shop_id: FBS 尚無資料，請群組回報 | 系統內無該店家資料 | 在 Seatalk **live issue** 回報 **@vendor** 協助 |
|6| {刷入內容} 條碼格式錯誤，請重新刷讀 | 刷到非 ASN／Seller TO／SPTO條碼 | 重新刷讀正確條碼 |
|7| 不支援南/北部訂單分揀，請整箱交總控 | 整箱錯倉（因 WH 轉運所導致） | 交倉庫總控；總控開「錯倉表單」逐一刷 SKU 後整箱轉正確倉（見 SOP-01） |
|8| 人員區域未註冊，請先掃區域 QR code | 未選區域就刷Seller TO單 | 先重刷區域 QR code |
|9| 如果PDA無訊息 | 壞損品／濕損／超材／無條碼或條碼破損 | 依情形放 **presort(有匹配/無匹配)** 異常箱並交 LRT（見 SOP-02、SOP-03） |
|10| 訂單被取消／多貨（廠商多送）／該商品非屬於 seller To 訂單內 | 因此條碼無對應訂單，請丟異常箱並填表單後轉退貨組 | 放 **presort(無匹配)** 異常箱 → 退貨組（見 SOP-04） |
|11| 貨物退還給賣家門市，但賣家未取件 | 此為C2C逆物流，該商品會退回倉庫等待報廢 | 商品放 presort(無匹配) 異常箱 → 退貨組 |
|12| EM 工位不存在 | 回報群組，材積攔截未設定 EM 工位 | Seatalk **live issue** 回報 **@FBS PM** |
|13| 播種牆卡燈(恆亮)／未拍燈 | 前一次播種尚未拍燈 | 先拍燈；必要時依 **SOP-05** 手動滅燈 |
|14| PDA 顯示工位後，播種牆未亮燈 | 撥種牆異常 | 請依 **SOP-06** 操作 |
|15| 因區域解除占用或未選區域，請重新選擇區域 | 未選區域直接刷商品 | 重新選區域後再作業 |
|16| 此揀貨箱號:{device_id} 尚未播種 | 關箱重複（箱內已有 mainsort 資料） | 直接帶去**分貨**刷讀 |
|17| 該工位商品已關箱完畢 | 綁到空箱（無 mainsort 資料） | 請先播種新商品後再進行關箱 |

---
<br>
&nbsp;
<br>

## SOP 細節

<details>
<summary><strong>SOP-01：錯倉處理（南/北部不支援分揀）</strong></summary>

1) 交由倉庫總控處理  
2) 總控開「錯倉表單」，逐一刷 SKU  
3) 整箱轉至正確倉
</details>

<details>
<summary><strong>SOP-02：濕損/壞損/超材（X 無訊息 - 情境 A）</strong></summary>

- 發現當下 **不要刷**，商品直接放回原 Seller TO 箱  
- 之後在濕損/壞損/超材專用的 presort 播種牆處理  
- 完成後放 **presort(有匹配)** 異常箱 → 交 LRT
</details>

<details>
<summary><strong>SOP-03：無條碼 / 條碼破損（X 無訊息 - 情境 B）</strong></summary>

- 請倉庫總控填寫 Google 表單後處理  
- 商品放 **presort(有匹配)** 異常箱 → 交 LRT  
- 表單：<https://forms.gle/p4RuZu4Q9M88T5aT7>
</details>

<details>
<summary><strong>SOP-04：訂單取消 / 多貨 / 非該Seller To訂單</strong></summary>

- 商品放 **presort(無匹配)** 異常箱 → 交退貨組  
</details>

<details>
<summary><strong>SOP-05：播種牆卡燈/未拍燈</strong></summary>

1) 檢查現場是否有未拍燈  
2) **手動滅燈**：Web → 登入 → 控制設定 → 「手動解除滅燈」  
3) 若仍無法：在 Seatalk **live issue** 回報 **@vendor** 協助  
4) 若頻繁發生：紀錄工位 → Seatalk **live issue** 回報 **@vendor**
</details>

<details>
<summary><strong>SOP-06：PDA 顯示工位後，播種牆未亮燈</strong></summary>

1) 現場重啟控制器  
2) 若無法處理，在 Seatalk **live issue** 回報 **@vendor** 協助
3) 若頻繁發生：紀錄工位 → Seatalk **live issue** 回報 **@vendor**
</details>