# 分貨

```flow
開啟分貨模組 → 刷 Device ID → PDA顯示對應Mainsort撥種牆編號 → 推至分貨區地面對應編號 → 疊箱 → 待滿落時，推至對應Mainsort撥種牆 → 分貨完成
```

---

## 常見錯誤與處理方式

|No.| PDA錯誤訊息／異常狀況 | 可能原因 | 處理方式 |
|--|-----------|-----------|-----------|
|1| 此揀貨箱尚未有訂單，此為空箱 | ① 拿空箱刷分貨。<br>② 箱內有商品但系統顯示無資料。 | ① 若確實為空箱，可直接使用。<br>② 若箱內有商品但顯示空箱 → 直接「解箱」，箱內商品放 **Main-sort 異常箱** → 交給**退貨組**。 **(SOP-01)** |
|2| 刷讀內容非揀貨箱號格式，請重新刷讀正確的揀貨箱號 | 刷到錯誤的條碼（非箱號） | 重新刷讀正確的揀貨箱號。 |
|3| 無區域工位模組資料，請協助至 WEB 後台確認目前啟用模組是否有建立 | 播種牆系統上未設定工位 (在 Web 上顯示) | 在 Seatalk **live issue** 回報 **@FBS PM** 協助設定工位。  **SOP-02** |
|4| 楊梅：請推至南部 Presort 播種牆<br>安南：請推至北部 Presort 播種牆 | 系統偵測到要跨倉的 C2C RTS（錯倉轉運） | ① 若在楊梅倉 → 交給「轉安南倉」<br>② 若在安南倉 → 交給「轉楊梅倉」 |

---
<br>
&nbsp;
<br>

## SOP 詳細說明

<details>
<summary><strong>SOP-01：空箱顯示異常</strong></summary>

1. 確認箱內是否真的有商品。  
2. 若箱內為空 → 可直接繼續使用。  
3. 若箱內有商品 →  
　(步驟1) 解箱  
　(步驟2) 商品放 **Main-sort 異常箱**  
　(步驟3) 交 **退貨組** 處理。  
</details>

<details>
<summary><strong>SOP-02：無工位模組</strong></summary>

1. 進入 Web 後台 → 「播種牆管理」。  
2. 檢查當前倉別是否已建立工位模組。  
3. 若無 → Seatalk **live issue** 標記 **@FBS PM** 協助新增模組。  
</details>

<details>
<summary><strong>SOP-03：錯倉轉運 (C2C RTS)</strong></summary>

- 若 PDA 顯示：「楊梅: 請推至南部 Presort 播種牆」 → 將箱交給**Presort組C2C RTS to S 轉安南倉**。  
- 若 PDA 顯示：「安南: 請推至北部 Presort 播種牆」 → 將箱交給**Presort組C2C RTS to N 轉楊梅倉**。    
</details>
