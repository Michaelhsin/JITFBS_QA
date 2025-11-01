# Main-sort 主分揀

```flow
刷區域 QR code → 刷 Device ID → 刷商品 UPC / SKUID → PDA 顯示工位、播種牆亮燈 → 拍燈 → 關箱：刷區域 QR code → 關箱：刷 TO 單
```

<br>
&nbsp;
<br>

## 常見錯誤與處理方式（摘要）

| 錯誤訊息 | 可能原因 | 處理方式 |
|-----------|-----------|-----------|
| 此區域已超過三人 | 區域人員超過三人 | 等待空位後再選擇區域 |
| 無區域資料 | 系統內無此區域設定 | 在 Seatalk **live issue** 回報 **@FBS PM** 協助 |
| 此揀貨箱尚未有訂單，此為空箱 | 該箱已播種完成 | 播下一箱 |
| 該揀貨箱區域錯誤，請移轉至其他區域 | 區域錯誤 | 再次刷分貨確認正確位置 |
| 撿貨箱號中的門市全部漏設 | 門市/工位資料缺漏 | Seatalk **live issue** 回報 **@FBS PM** 協助 |
| 因區域解除佔用或人員未選區域 | 未先刷區域 QR Code | 先刷區域 QR Code 再進行作業 |
| 1) 請刷讀正確條碼... | 多貨或訂單取消（JIT SCS） | 放入 **Main-sort 異常箱** → 交 LRT |
| X 無訊息 | 少貨或商品放錯箱 | 解箱後執行 **checking incomplete order** |
| UPC 匹配多個商品 | UPC 對應多 SKU | 通知總控協助判斷 |
| 工位不存在 | 未設定播種工位 | Seatalk **live issue** 回報 **@FBS PM** |
| 商品已完成播種，請刷讀其他商品 | 商品重刷 | 丟入物流箱 |
| 前一次播種尚未拍燈 | 播種牆卡燈 / 未拍燈 | 按下方 **SOP-01** 處理 |
| TO已重複綁定 | TO 單重複刷讀 | 更換新 TO 單 |
| TO單門市錯誤或訂單被取消 | TO 單門市與工位不符 | 按下方 **SOP-02** 處理 |

---
<br>
&nbsp;
<br>

## SOP 詳細說明

<details>
<summary><strong>SOP-01：播種牆卡燈／未拍燈處理</strong></summary>

1. 檢查現場是否有未拍燈。  
2. 若燈未滅 → 進入 Web 系統：登入 → 控制設定 → 「手動解除滅燈」。  
3. 若仍無法 → 在 Seatalk **live issue** 回報 **@vendor** 協助。  
4. 若頻繁發生 → 記錄工位 → 回報 **@vendor**。
</details>

<details>
<summary><strong>SOP-02：TO 單門市錯誤處理</strong></summary>

1. 確認 TO 單與工位的門市是否一致。  
2. 若一致 → 商品放入 **Main-sort 異常箱** → 交給 LRT。  
3. 若不一致 → 請回報 **@FBS PM**。
</details>
