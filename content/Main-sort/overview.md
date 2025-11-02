# Main-sort 主分揀

```flow
刷區域 QR code → 刷 Device ID → 刷商品 SKUID → PDA 顯示工位、播種牆亮燈 → 拍燈 → 關箱(步驟1. 刷區域 QR code → 步驟2. 刷 TO 單) → 綁箱成功
```

<br>
&nbsp;
<br>


## 常見錯誤與處理方式（摘要）

| No. | PDA錯誤訊息／異常狀況 | 可能原因 | 處理方式 |
|--|-----------|-----------|-----------|
|1| 此區域已超過三人 | 區域人員超過三人 | 等待空位後再選擇區域 |
|2| 無區域資料 | 系統內無此區域設定 | 在 Seatalk **live issue** 回報 **@FBS PM** 協助 |
|3| 此揀貨箱尚未有訂單，此為空箱 | 該箱已播種完成 | 播下一箱 |
|4| 該揀貨箱區域錯誤，請移轉至其他區域 | 區域錯誤 | 開啟分貨模組，再次刷分貨確認正確位置 |
|5| 撿貨箱號中的門市全部漏設 | 門市/工位/mainsort模組資料缺漏 | Seatalk **live issue** 回報 **@FBS PM** 協助 |
|6| 因區域解除佔用或人員未選區域 | 未先刷區域 QR Code 就先刷 Device ID | 先刷區域 QR Code 再進行作業 |
|7| X 無訊息 | 少貨或商品放錯箱。 | 解箱並交給 **退貨組**，按下方 **SOP-01** 處理 |
|8| 箱內尚有產品，PDA亦有顯示數量但刷不過 | 此為多貨、取消、或箱內商品無可匹配訂單 | 解箱並交給 **退貨組**處理 |
|9| 工位不存在 | 未設定播種工位 | Seatalk **live issue** 回報 **@FBS PM** |
|10| 商品已完成播種，請刷讀其他商品 | 商品重刷 | 丟入物流箱 |
|11| PDA 顯示工位後，播種牆未亮燈 | 撥種牆異常 | 請依 **SOP-02** 操作 |
|12| 前一次播種尚未拍燈 | 播種牆卡燈 / 未拍燈 | 按下方 **SOP-03** 處理 |
|13| TO已重複綁定 | TO 單重複刷讀 | 更換新 TO 單 |
|134| TO單門市錯誤或訂單被取消 | TO 單門市與工位不符 | 按下方 **SOP-04** 處理 |

---
<br>
&nbsp;
<br>

## SOP 詳細說明

<details>
<summary><strong>SOP-01：PDA 尚顯示待播種商品數量，但箱內無商品</strong></summary>

1. 直接解箱
2. 箱內商品放 mainsort異常箱，交給退貨組
</details>

<details>
<summary><strong>SOP-02：PDA 顯示工位後，播種牆未亮燈</strong></summary>

1. 現場重啟控制器  
2. 若無法處理，在 Seatalk **live issue** 回報 **@vendor** 協助
3. 若頻繁發生：紀錄工位 → Seatalk **live issue** 回報 **@vendor**
</details>

<details>
<summary><strong>SOP-03：播種牆卡燈／未拍燈處理</strong></summary>

1. 檢查現場是否有未拍燈。  
2. 若燈未滅 → 進入 Web 系統：登入 → 控制設定 → 「手動解除滅燈」。  
3. 若仍無法 → 在 Seatalk **live issue** 回報 **@vendor** 協助。  
4. 若頻繁發生 → 記錄工位 → 回報 **@vendor**。
</details>

<details>
<summary><strong>SOP-04：TO 單門市錯誤處理</strong></summary>

1. 確認 TO 單與工位的門市是否一致。  
2. 若一致 → 商品放入 **Main-sort 異常箱** → 交給 LRT。  
3. 若不一致 → 請回報 **@FBS PM**。
</details>


