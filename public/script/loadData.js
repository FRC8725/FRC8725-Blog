/*
 * 2023 © MaoHuPi
 * 載入頁面內容實際位置與其他相關資料
 * blogTemplate_thread > public > script > loadData.js
 */

'use strict';

const data = {};
let loadDataDone = false;
(async () => {
	let md5Data = await fetch(`data/md5.json?noCatch=${randId(5)}`).then(r => r.text());
	var md5DataText = md5Data;
	md5Data = JSON.parse(md5Data);
	let oldMd5Data = localStorage.getItem('data-md5');
	if(!oldMd5Data) oldMd5Data = {};
	try{oldMd5Data = JSON.parse(oldMd5Data);}
	catch(error){oldMd5Data = {};}
	for(let fileName in md5Data){
		if(oldMd5Data[fileName] !== md5Data[fileName]){
			data[fileName] = await fetch(`data/${fileName}.json?noCatch=${randId(5)}`).then(r => r.text());
			localStorage.setItem(`data-${fileName}`, data[fileName]);
		}
		else{
			data[fileName] = localStorage.getItem(`data-${fileName}`);
		}
		data[fileName] = JSON.parse(data[fileName]);
	}
	localStorage.setItem('data-md5', md5DataText);

	if(data.article.articleDatas){
		// data.article.articleDatas.sort((a, b) => new Date(b.publishedTime) - new Date(a.publishedTime));
		data.article.articleDatas.reverse();
	}
	loadDataDone = true;
})();