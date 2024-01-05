![threadSBT-banner](image/banner.png)

threadSBT
=========

![license MIT](https://img.shields.io/badge/license-MIT-blue)
![python 3.9.6](https://img.shields.io/badge/python-3.9.6-blue)

> 2023 &copy; MaoHuPi
> 
> 說明文件語言：繁體中文 / [English](../README.md)
> 
> 若要使用此模板，請前往[原專案位置](https://github.com/maohupi/threadSBT)下載


專案簡介
----

`threadSBT`為一個靜態部落格模板(Static Blogger Template)，整體設計參考自[Jimmy](https://jimmycai.com/)的[Hugo Theme Stack](https://github.com/CaiJimmy/hugo-theme-stack)，不過此模板除了基礎的章節篩選與瀏覽功能外，還添加了：`RSS`、`Twitter Meta Card`、`背景音樂播放`、`互動角色`與`簡報檢視`等延伸功能，來**使部落格更容易被搜尋引擎的爬蟲接受**，也**提升了網頁在使用層面的多樣性**，並**使其看起來更加活潑**。

不過本模板沒有使用像[Hugo](https://gohugo.io/)系統那樣「`直接將文章內容寫入輸出之HTML`」的方式（也拔除了`全內文搜索`的功能），而是將`HTML`寫成單一檔案，而其它資料內容則是在必要時才將以載入，來減少`Github Page`的流量使用。

使用說明
----

本專案使用`Python`來將設定檔與文章資訊寫入、轉換成JS易取用之格式，所以若無法執行執行檔，或沒有與自身系統相對應的執行檔，則可在下載`Python`與必要的函式庫（`opencv-python`、`numpy`等）後，執行`Python`程式碼。

本專案的主程式為`render.py`，其他`Python`檔則可用以對單一的資料面向做更新。而`render.py`的指令參數規則如下：

```txt
--h, -help
--v, -version
-custom <custom directory path>
-update <update type (all / config / article / portfolio)>
```

使用範例：

```bat
python render.py -custom "custom" -update "all"
```

版本更新
----

* v1.0.0 2023/09/05 初版
* v1.0.1 2023/09/07 程式複製與RSS
	1. 新增文章內程式區塊複製功能
	2. 修正rss無法上傳至github的問題
	3. 修正程式區塊語言中txt與text的套色
	4. 修改footer文字
* v1.0.2 2023/09/08 文章跑版與預覽修正
	1. 修正文章圖片須有alt屬性才能正常顯示的問題
	2. 新增custom/style/custom.css來放置自訂調整之樣式
	3. 修正hljs-mark等標籤類別附加的範圍錯誤
	4. 補齊requirements.txt中遺漏的版本標示
	5. 修正twitter card圖片無法顯示的問題
	6. 修正footer連結的可點擊性
	7. 修正Outline頁籤中頁內連結的游標樣式
* v1.0.3 2023/09/09 文章跑版與預覽修正
	1. 修改預設設定
	2. 新增文章搜尋功能
	3. 新增互動角色的揮手動畫
	4. 更改說明文件位置
* v1.0.4 2023/09/10 文章跑版與預覽修正
	1. 修改複製後的系統提示變為浮動提示框
	2. 修正hljs-mark等標籤類別附加的範圍缺漏（由v1.0.2造成）
* v1.0.5 2023/09/10 改善使用體驗
	1. 修正重進頁面後文章搜尋欄位為空問題（由v1.0.3造成）

待做功能
----

- [ ] Tex Parse
- [ ] Latex Parse
- [ ] slides 多層清單文字化功能修正
- [ ] 相關文章推薦功能
	* 分析：瀏覽？、回顧(1\~10)？、按讚(1\~5)？
	* 資料：tag、category、date
- [ ] account management