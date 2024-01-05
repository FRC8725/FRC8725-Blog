/*
 * 2023 © MaoHuPi
 * 網頁內容呈現與事件附加
 * blogTemplate_thread > public > script > main.js
 */

'use strict';

const alerts = $('#alerts');
const pool_FloatAlert = [];
function alert(content = '', type = 'compleat'){
	// object pool
	let usableFA = pool_FloatAlert.filter(FA => !FA.displayed)[0];
	if(usableFA == undefined){
		usableFA = new FloatAlert();
		if(pool_FloatAlert.length < 5) pool_FloatAlert.push(usableFA);
	}
	[usableFA.content, usableFA.type] = [content, type];
	alerts.appendChild(usableFA.display());
}

marked = new marked.Marked(
	markedHighlight.markedHighlight({
		langPrefix: 'hljs language-',
		highlight(code, lang) {
		const language = hljs.getLanguage(lang) ? lang : 'plaintext';
		return hljs.highlight(code, { language }).value;
		}
	})
);

function copyCodeContent(button){
	navigator.clipboard.writeText(button.parentElement.querySelector('code.hljs').innerText).then(
		() => {alert('Copied code content to clipboard.', 'compleat')}, 
		() => {alert('Code content copy failed, unable to write to clipboard.', 'error')}
	);
}

var dataLoaded = () => {};
(() => {
	const html = document.documentElement;
	if(localStorage.getItem('theme')){
		html.setAttribute('theme', localStorage.getItem('theme'));
	}
	else {
		html.setAttribute('theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'bright');
	}
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
		let systemThemeNow = event.matches ? 'dark' : 'bright';
		if(systemThemeNow !== html.getAttribute('theme')){
			html.setAttribute('theme', systemThemeNow);
			if(localStorage.getItem('theme')){
				localStorage.setItem('theme', systemThemeNow);
			}
		}
	})
	const main = $('main');
	// marked = new marked.Marked(
	// 	markedHighlight({
	// 		langPrefix: 'hljs language-',
	// 		highlight(code, lang) {
	// 		const language = hljs.getLanguage(lang) ? lang : 'plaintext';
	// 		return hljs.highlight(code, { language }).value;
	// 		}
	// 	})
	// );
	let _marked_parse = function(mdContent){
		let htmlContent;
		if(mdContent.toLowerCase().indexOf('<!-- don\'tparseasarticle -->') > -1 || mdContent.toLowerCase().indexOf('<!-- don\'t parse as article -->') > -1){
			htmlContent = marked.parse(mdContent);
		}
		else{
			mdContent = mdContent.replace(/( |\n)# (.[^#]*)(#+)(?=($|\n))/g, '$1#$3 $2');
			htmlContent = marked.parse(mdContent);
			let container = $e('div');
			container.innerHTML = htmlContent;
			let noDeclareKeywords = ['if', 'else', 'elseif', 'elif', 'elsif', 'while', 'for', 'return', 'switch', 'case', 'when', 'default', 'try', 'catch', 'break', 'continue'];
			$$('code.hljs .hljs-keyword', container).forEach(element => {
				if(noDeclareKeywords.indexOf(element.innerText) > -1){
					element.className += ' notDeclare_';
				}
			});
			$$('code.hljs, code.hljs *', container).filter(element => ['hljs-comment', 'hljs-string', 'hljs-regexp'].indexOf(element.className) === -1).map(element => [...element.childNodes]).flat().filter(node => node.tagName === undefined).forEach(node => {
				var span = $e('span');
				span.innerHTML = node.textContent.replace(/([()[\]{}:;=+\-*/.,!<>|^&?%@~])/g, '<span class="hljs-mark">$1</span>');
				node.parentElement.insertBefore(span, node);
				node.remove();
			});
			$$('code.hljs', container).forEach(element => {
				var lineNumber = $e('code'), 
					copyCodeButton = $e('button');
				lineNumber.innerHTML = new Array(element.innerText.split('\n').length - 1).fill(0).map((v, i) => (i + 1).toString()).join('\n') || '';
				element.parentElement.insertBefore(lineNumber, element);
				copyCodeButton.className = 'copyCodeButton';
				copyCodeButton.innerText = 'copy';
				copyCodeButton.setAttribute('onclick', 'copyCodeContent(this);');
				element.parentElement.appendChild(copyCodeButton);
				element.parentElement.className += 'codeBlock';
			});
			$$('img', container).forEach(img => {
				let imageBox = $e('div');
				let imgAlt = img.getAttribute('alt');
				imageBox.className = 'imageBox';
				if(imgAlt !== undefined){
					imageBox.setAttribute('data-alt', imgAlt);
				}
				else{
					imageBox.setAttribute('data-alt', '');
				}
				img.after(imageBox);
				imageBox.appendChild(img);
			});
			$$(':where([href], [src])', container).forEach(element => {
				for(let attribute of ['href', 'src']){
					var value = element.getAttribute(attribute );
					if(value && /^.[^\/(http://)(https://)]/g.test(value)){
						element.setAttribute(attribute, `${CUSTOM_DIR_PATH}/${value}`);
					}
				}
			});
			htmlContent = container.innerHTML;
		}
		return htmlContent;
	}

	function goto(queryString){
		if(queryString !== undefined){
			history.pushState({}, `${queryString}`, queryString);
		}
		refreshGet();
		main.innerHTML = '';
		document.title = `${TITLE} - ${$_GET['page'][0].toUpperCase()}${$_GET['page'].split('').slice(1).join('')}`;
		searchInput.value = '';
		slidesPlayerBox.innerHTML = '';
		generatePage();
	}
	document.title = $_GET['page'] ? `${TITLE} - ${$_GET['page'][0].toUpperCase()}${$_GET['page'].split('').slice(1).join('')}` : `${TITLE} - Home`;
	$$('[data-href]').forEach(element => element.addEventListener('click', function(){
		goto(this.getAttribute('data-href'));
	}));
	window.addEventListener('popstate', () => {goto();});

	const styleToTopPath = new Array((($('#mainCss') || $('link[rel="stylesheet"]'))?.getAttribute('href')?.split(/\\|\//g)?.filter(s => s.length > 0)?.length || 1) - 1).fill('..').join('/');

	function setCategoryColorProperty(categoryElement, categoryName){
		var colorData = categoryName in CATEGORY_COLORS ? CATEGORY_COLORS[categoryName] : {bright: 'var(--defaultCategory-color)', dark: 'var(--defaultCategory-color)'};
		categoryElement.style.setProperty('--category-colorBright', colorData.bright);
		categoryElement.style.setProperty('--category-colorDark', colorData.dark);
	}

	const bgAniSettings = () => {return{
		cvs: $('#bgAniCvs'), 
		width: window.innerWidth, 
		height: window.innerHeight, 
		dotAmount: Math.floor(window.innerWidth*window.innerHeight/2e4), 
		maxLineLength: 80, 
		speed: 2
	};};
	const bgAni = new BGAnimation(bgAniSettings());
	window.addEventListener('resize', () => {
		[bgAni.width, bgAni.height] = [window.innerWidth, window.innerHeight];
		bgAni.generateDots(bgAniSettings());
	});
	bgAni.play(30);

	const effects = $('#effects');
	const pool_ClickAnimation = [];
	window.addEventListener('click', event => {
		// object pool
		let usableCA = pool_ClickAnimation.filter(CA => !CA.displayed)[0];
		if(usableCA == undefined){
			usableCA = new ClickAnimation();
			if(pool_ClickAnimation.length < 5) pool_ClickAnimation.push(usableCA);
		}
		[usableCA.x, usableCA.y] = [event.clientX, event.clientY]
		effects.appendChild(usableCA.display());
	});

	const badgeDescription = $('#badgeDescription');
	function showBadgeDescription(event, badge){
		badgeDescription.innerText = badge.getAttribute('data-title');
		badgeDescription.setAttribute('visible', '');
	}
	function setBadgeDescriptionPos(event){
		badgeDescription.style.setProperty('--x', `${event.clientX}px`);
		badgeDescription.style.setProperty('--y', `${event.clientY+30}px`);
	}
	function hideBadgeDescription(event){
		// badgeDescription.innerText = '';
		badgeDescription.removeAttribute('visible');
	}
	hideBadgeDescription();
	$$('#badges > div').forEach(badge => {
		badge.addEventListener('mouseover', event => {showBadgeDescription(event, badge);});
		badge.addEventListener('mousemove', setBadgeDescriptionPos);
		badge.addEventListener('mouseleave', hideBadgeDescription);
	});

	function switchSwitcher(switcher, controlFunc = () => {}){
		var newValue = switcher.getAttribute('value') == 'on' ? 'off' : 'on';
		switcher.setAttribute('value', newValue);
		controlFunc(newValue);
	}
	
	$('#rssUrlCopy').addEventListener('click', () => {
		navigator.clipboard.writeText(`${location.origin}${location.pathname.replace(/(\/|\\).[^\/\\]*\.html/g, '')}/rss`).then(
			() => {alert('Copied RSS URL to clipboard.', 'compleat');}, 
			() => {alert('RSS url copy failed, unable to write to clipboard.', 'error');}
		);
	});

	const backgroundMusicSwitch = $('#backgroundMusicSwitch');
	const bgm = new Audio(backgroundMusicSwitch.getAttribute('data-path'));
	bgm.addEventListener('play', () => {
		if(backgroundMusicSwitch.getAttribute('value') !== 'on'){
			backgroundMusicSwitch.setAttribute('value', 'on');
		}
	});
	bgm.addEventListener('pause', () => {
		if(backgroundMusicSwitch.getAttribute('value') !== 'off'){
			backgroundMusicSwitch.setAttribute('value', 'off');
		}
	});
	bgm.loop = true;
	bgm.volume = parseFloat(backgroundMusicSwitch.getAttribute('data-volume'));
	function controlBackgroundMusic(command){
		if(command == 'on'){
			this.play();
		}
		else{
			this.pause();
		}
	}
	backgroundMusicSwitch.addEventListener('click', () => {
		switchSwitcher(backgroundMusicSwitch, controlBackgroundMusic.bind(bgm));
	});

	function switchDarkMode(){
		var theme = html.getAttribute('theme') == 'dark' ? 'bright' : 'dark';
		html.setAttribute('theme', theme);
		themeChanged();
		localStorage.setItem('theme', theme);
	}
	$('#darkModeSwitch').addEventListener('click', switchDarkMode);
	function themeChanged(){
		bgAni.color = {
			null: '0, 0, 0', 
			bright: '0, 0, 0', 
			dark: '255, 255, 255', 
		}[html.getAttribute('theme')];
	}
	themeChanged();

	$('#scrollToArticle').addEventListener('click', () => {
		window.scroll(0, window.innerHeight - window.innerWidth*0.2);
	});

	data.articleContent = {keys: [], dict: {}};
	async function getArticleContent(articlePath){
		let content = '', status = -1;

		if(data.articleContent.keys.indexOf(articlePath) > -1){
			status = 200;
			content = data.articleContent.dict[articlePath];
		}
		else{
			let articleResponse, articleContent;
			try{
				articleResponse = await fetch(articlePath);
				articleContent = await articleResponse.text();
			}
			catch(error){
				status = -1;
			}
			if(articleResponse.status === 200){
				if(data.articleContent.keys.length >= 10){
					delete data.articleContent.dict[data.articleContent.keys.shift()];
				}
				status = 200;
				content = articleContent;
				data.articleContent.keys.push(articlePath);
				data.articleContent.dict[articlePath] = articleContent;
			}
			else{
				status = articleResponse.status;
			}
		}
		return {content, status};
	}

	let generateFilterPageDone = false
	const searchInput = $('#searchInput');
	function generateFilterPage(){
		if(generateFilterPageDone) return;
		if(searchInput){
			searchInput.addEventListener('keydown', event => {
				if(event.key == 'Enter'){
					var targetUrl = `?page=articles&search=${searchInput.value}`;
					if(event.ctrlKey) window.open(targetUrl, '_blank');
					else goto(targetUrl);
				}
			});
		}
		if(data?.article?.archives){
			let archiveButtons = $('#archiveButtons');
			if(archiveButtons){
				for(let archiveName in data.article.archives){
					let button = $e('button');
					button.innerText = archiveName;
					button.addEventListener('click', () => {goto(`?page=articles&archive=${archiveName}`);});
					archiveButtons.appendChild(button);
				}
			}
		}
		if(data?.article?.categories){
			let categoryButtons = $('#categoryButtons');
			if(categoryButtons){
				for(let categoryName in data.article.categories){
					let button = $e('button');
					button.innerText = categoryName;
					setCategoryColorProperty(button, categoryName);
					button.addEventListener('click', () => {goto(`?page=articles&category=${categoryName}`);});
					categoryButtons.appendChild(button);
				}
			}
		}
		if(data?.article?.tags){
			let tagButtons = $('#tagButtons');
			if(tagButtons){
				for(let tagName in data.article.tags){
					let button = $e('button');
					button.innerText = tagName;
					button.addEventListener('click', () => {goto(`?page=articles&tags=${tagName}`);});
					tagButtons.appendChild(button);
				}
			}
		}
		generateFilterPageDone = true;
	}
	function failedPage(){
		main.innerHTML = '<article class="row" style="border-width: 0px;"><h1 class="title" style="color: var(--text-color3);">The page you are looking for does not exist.</h1></article>';
	}
	function generatePage(){
		dataLoaded = () => {};
		function tabNow(tabId){
			$$(`#tabs > li.now:not(#${tabId})`).forEach(tab => {
				tab.className = tab.className.replace(/ *now */g, ' ');
			});
			var targetTab = $(`#${tabId}`);
			if(targetTab){
				targetTab.className += ' now';
				return true;
			}
			return false;
		}
		function asidePageNow(pageId){
			let aside = $('aside');
			if(pageId === false){
				aside.removeAttribute('visible');
			}
			else{
				aside.setAttribute('visible', '');
				/* attribute and property are not synchronized */
				// $$(`[name="pageRadio"][checked]:not(#${pageId})`).forEach(radio => {
				// 	radio.removeAttribute('checked');
				// });
				// $(`#${pageId}`).setAttribute('checked', '');
				$(`#${pageId}`).checked = true;
			}
		}
		if($_GET['page'] == undefined || $_GET['page'] == 'home'){
			if(!tabNow('tab-home')){failedPage(); return;}
			asidePageNow('pageRadio-filter');
			dataLoaded = () => {
				generateFilterPage();
				if(data?.article?.articleDatas){
					let outline = $('#pageRadio-outline + label > .page'), 
						outlineList = $e('ul');
					outline.innerHTML = '';
					outline.appendChild(outlineList);
					for(let articleData of data.article.articleDatas.slice(0, 10)){
						let article = $e('article'), 
							title = $e('h1'), 
							info = $e('p'), 
							publishedTime = $e('span'), 
							readingTime = $e('span');
						article.className = 'closed';
						article.addEventListener('click', () => {
							if(article.className.includes('closed')){
								goto(`?page=article&article=${articleData.name}`);
							}
						});
						if(articleData.cover){
							let cover = $e('div');
							cover.className = 'cover';
							cover.style.setProperty('--bgi', `url('${styleToTopPath}/${articleData.cover}')`);
							article.appendChild(cover);
						}
						title.className = 'title';
						title.innerText = articleData.title || articleData.path;
						article.appendChild(title);
						if(articleData.description){
							let description = $e('p');
							description.className = 'description';
							description.innerText = articleData.description;
							article.appendChild(description);
						}
						info.className = 'info';
						publishedTime.className = 'publishedTime';
						publishedTime.innerText = new Date(articleData.publishedTime).toJSON().split('T')[0];
						info.appendChild(publishedTime);
						readingTime.className = 'readingTime';
						readingTime.innerText = articleData.readingTime;
						info.appendChild(readingTime);
						article.appendChild(info);
						if(articleData.category){
							let category = $e('p');
							category.className = 'category';
							setCategoryColorProperty(category, articleData.category);
							category.innerText = articleData.category;
							category.addEventListener('click', event => {
								event.stopPropagation();
								goto(`?page=articles&category=${articleData.category}`);
							});
							article.appendChild(category);
						}
						main.appendChild(article);
	
						let listItem = $e('li');
						listItem.for = article;
						listItem.innerText = articleData.title || articleData.path;
						listItem.addEventListener('click', () => {
							let articleRect = article.getBoundingClientRect();
							window.scroll(0, articleRect.y + window.scrollY);
						});
						outlineList.appendChild(listItem);
					}
					if(data.article.articleDatas.length > 10){
						var bottomText = $e('article');
						bottomText.className = 'row';
						bottomText.style.borderWidth = '0px';
						bottomText.innerHTML = '<h1 class="title" style="color: var(--text-color3);">Head to the articles page to see more previous articles.</h1>';
						main.appendChild(bottomText);
					}
				}
			};
			if(isMobileStyle()) window.scroll(0, 0);
		}
		else if($_GET['page'] == 'article'){
			if(!tabNow('tab-articles')){failedPage(); return;}
			asidePageNow('pageRadio-outline');

			let content = $e('div');
			let outline = $('#pageRadio-outline + label > .page');

			function articleNotFound(){
				main.innerHTML = '<article class="row" style="border-width: 0px;"><h1 class="title" style="color: var(--text-color3);">The article you are visiting has not been created or has been deleted.</h1></article>';
			}
			dataLoaded = () => {
				generateFilterPage();
				if(data?.article?.articleDatas){
					let articleData = data.article.articleDatas.filter(articleData => articleData.name == $_GET['article']);
					let playButton;
					if(articleData.length >= 1){
						articleData = articleData[0];
						let article = $e('article'), 
							titleBox = $e('div'), 
							title = $e('h1'), 
							info = $e('p'), 
							publishedTime = $e('span'), 
							readingTime = $e('span');
						article.className = '';
						article.addEventListener('click', () => {
							if(article.className.includes('closed')){
								goto(`?page=article&article=${articleData.name}`);
							}
						});
						if(articleData.cover){
							let cover = $e('div');
							cover.className = 'cover';
							cover.style.setProperty('--bgi', `url('${styleToTopPath}/${articleData.cover}')`);
							article.appendChild(cover);
						}
						title.className = 'title';
						title.innerText = articleData.title || articleData.path;
						titleBox.appendChild(title);
						if(articleData.description){
							let description = $e('p');
							description.className = 'description';
							description.innerText = articleData.description;
							titleBox.appendChild(description);
						}
						info.className = 'info';
						publishedTime.className = 'publishedTime';
						publishedTime.innerText = new Date(articleData.publishedTime).toJSON().split('T')[0];
						info.appendChild(publishedTime);
						readingTime.className = 'readingTime';
						readingTime.innerText = articleData.readingTime;
						info.appendChild(readingTime);
						titleBox.appendChild(info);
						titleBox.style.width = '100%';
						titleBox.style.position = 'relative';
						if(slidesUseable){
							playButton = $e('button');
							playButton.className = 'playButton';
							playButton.appendChild($e('div'));
							playButton.setAttribute('disable', '');
							playButton.addEventListener('click', playSlides);
							titleBox.appendChild(playButton);
						}
						article.appendChild(titleBox);
						content.className = 'content';
						article.appendChild(content);
						if(typeof LIKER_ACCOUNT !== 'undefined'){
							let likerFrame = $e('iframe');
							likerFrame.className = 'likerFrame';
							likerFrame.src = `https://button.like.co/in/embed/${LIKER_ACCOUNT}/button/?referrer=${encodeURI(location.href)}`;
							article.appendChild(likerFrame);
						}
						if(articleData.category){
							let category = $e('p');
							category.className = 'category';
							setCategoryColorProperty(category, articleData.category);
							category.innerText = articleData.category;
							category.addEventListener('click', () => {goto(`?page=articles&category=${articleData.category}`);});
							article.appendChild(category);
						}
						main.appendChild(article);
					}

					let articlePath = articleData.path;
					(async () => {
						let result = await getArticleContent(articlePath), 
							[articleContent, articleStatus] = [result.content, result.status];
						if(articleStatus === 404){
							articleNotFound();
							return;
						}
						else if(articleStatus !== 200){
							main.innerHTML = `<article class="row" style="border-width: 0px;"><h1 class="title" style="color: var(--text-color3);">Error ${articleStatus}.</h1></article>`;
							return;
						}
						if(slidesUseable){
							playButton.removeAttribute('disable');
							data.slidesContent = articleContent.replace(/\!\[(.[^\]]*)\]\((.[^\/\:].[^\:\)]*)\)/g, `![$1](${CUSTOM_DIR_PATH}/$2)`);
						}
						articleContent = _marked_parse(articleContent);
						content.innerHTML = articleContent;
						
						function processElementLevel(oldElementLevelList, parent = false, parentIndexText = ''){
							if(oldElementLevelList.length == 0){
								return [];
							}
							let elementLevelNow = Math.min(...oldElementLevelList.map(elementData => elementData[0]))
							let newElementLevelList = [];
							let childList = [];
							let orderedList = $e('ol');
							for(let elementData of oldElementLevelList){
								if(elementData[0] === elementLevelNow){
									newElementLevelList.push(elementData);
									elementData[2] = [];
									childList = elementData[2];
								}
								else{
									childList.push(elementData);
								}
							}
							for(let i = 0; i < newElementLevelList.length; i++){
								let elementData = newElementLevelList[i]
								let listItem = $e('li');
								listItem.for = elementData[1];
								var nthId = $$(`[id^="h-${elementData[1].innerText}"]`).length+1;
								elementData[1].id = `h-${elementData[1].innerText}${nthId === 1 ? '' : nthId}`;
								listItem.innerText = `${parentIndexText}${i+1}. ${elementData[1].innerText}`;
								listItem.addEventListener('click', event => {
									event.stopPropagation();
									let elementRect = elementData[1].getBoundingClientRect();
									window.scroll(0, elementRect.y + window.scrollY);
									history.pushState({}, `${$_GET['article']} ${elementData[1].innerText}`, `?page=article&article=${$_GET['article']}&anchor=${elementData[1].id}`);
								});
								processElementLevel(elementData[2], listItem, `${parentIndexText}${i+1}-`);
								orderedList.appendChild(listItem);
							}
							if(parent) parent.appendChild(orderedList);
							else return orderedList;
						}
						let elementLevelList;
						function waitForElementLevelList(){
							var anyContent = $$('.content > *)', content);
							elementLevelList = $$('.content > :where(h1, h2, h3, h4, h5, h6)', content).map(element => [['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].indexOf(element.tagName.toLowerCase()), element]);
							if(anyContent){
								let ol = processElementLevel(elementLevelList);
								if(ol.childElementCount > 0){
									outline.innerHTML = '';
									outline.appendChild(ol);
								}
								else{
									outline.innerHTML = '<ol><li style="color: var(--text-color3);">Could not find any header tags.</li></ol>';
								}
								if($_GET['anchor']){
									function waitForElementRect(){
										let anchorElement;
										try{
											anchorElement = $(`#${decodeURI($_GET['anchor'])}`, content);
										}catch(error){}
										let elementRect = anchorElement ? anchorElement.getBoundingClientRect() : null;
										if(elementRect === null || elementRect.height === 0){
											setTimeout(waitForElementRect, 30);
										}
										else{
											window.scroll(0, elementRect.y + window.scrollY);
										}
									}
									waitForElementRect();
								}
							}
							else{
								setTimeout(waitForElementLevelList, 30);
							}
						}
						waitForElementLevelList();
					})();
				}
			};
		}
		else if($_GET['page'] == 'articles'){
			if(!tabNow('tab-articles')){failedPage(); return;}
			asidePageNow('pageRadio-filter');
			dataLoaded = () => {
				generateFilterPage();
				if(data?.article?.articleDatas){
					let outline = $('#pageRadio-outline + label > .page'), 
						outlineList = $e('ul');
					outline.innerHTML = '';
					outline.appendChild(outlineList);
	
					let articleDatas = data.article.articleDatas;
					let useFilter = false;
					let keywordRegExp;
					if($_GET['search']){
						searchInput.value = $_GET['search'];
						searchInput.focus({preventScroll: true});
						let get_keywordList = decodeURI($_GET['search']).replace(/ *, */g, ' ').split(/ +/g);
						keywordRegExp = new RegExp('('+decodeURI($_GET['search']).replace(/ *, */g, ' ').split(/ +/g).map(keyword => '('+keyword.replace(/[()[\]{}\\\/\|\-\+]/g, '\\$1')+')').join('|')+')', 'g');
						articleDatas = articleDatas.filter(articleData => {
							for(let keyword of get_keywordList){
								if(!articleData?.title?.includes(keyword) && !articleData?.description?.includes(keyword)){
									return false;
								}
							}
							return true;
						});
						useFilter = true;
					}
					else if($_GET['archive']){
						articleDatas = articleDatas.filter(articleData => articleData.archive == $_GET['archive']);
						useFilter = true;
					}
					else if($_GET['category']){
						articleDatas = articleDatas.filter(articleData => articleData.category == $_GET['category']);
						useFilter = true;
					}
					else if($_GET['tags']){
						let get_tagList = $_GET['tags'].split(/ *, */g);
						if($_GET['tags-mode'] === undefined || $_GET['tags-mode'] === 'and'){
							articleDatas = articleDatas.filter(articleData => {
								for(let tagName of get_tagList){
									if(!articleData?.tags?.includes(tagName)){
										return false;
									}
								}
								return true;
							});
							useFilter = true;
						}
						else if($_GET['tags-mode'] === 'or'){
							articleDatas = articleDatas.filter(articleData => {
								for(let tagName of articleData.tags){
									if(get_tagList.includes(tagName)){
										return true;
									}
								}
								return false;
							});
							useFilter = true;
						}
					}

					if(useFilter){
						let filterBar = $e('div'), 
							filterRotateBox = $e('div');
						filterRotateBox.className = 'filterRotateBox';
						filterBar.appendChild(filterRotateBox);
						filterBar.className = 'filterBar';
						setCategoryColorProperty(filterBar, $_GET['category']);
						main.appendChild(filterBar);
						[['search', $_GET['search']], ['archive', $_GET['archive']], ['category', $_GET['category']], ['tags', $_GET['tags']]].forEach(data => {
							if(data[1] == undefined) return;
							let filterBox = $e('div'), 
								filterTitle = $e('h2'), 
								filterValue = $e('p');
							filterTitle.innerText = data[0];
							filterBox.appendChild(filterTitle);
							filterValue.innerText = data[1];
							filterBox.appendChild(filterValue);
							filterRotateBox.appendChild(filterBox);
						});
					}
					else{
						let timeLine = $e('div');
						timeLine.className = 'timeLine';
						main.appendChild(timeLine);
					}
					let startAt = 0;
					let articlesPerPage = 20;
					if($_GET['start'] && parseInt($_GET['start']).toString() === $_GET['start']){
						startAt = parseInt($_GET['start']);
					}
					for(let articleData of articleDatas.slice(startAt, startAt + articlesPerPage)){
						let article = $e('article'), 
							title = $e('h1'), 
							info = $e('p'), 
							publishedTime = $e('span');
						article.className = 'closed row';
						article.addEventListener('click', () => {
							if(article.className.includes('closed')){
								goto(`?page=article&article=${articleData.name}`);
							}
						});
						title.className = 'title';
						if($_GET['search'] && keywordRegExp) title.innerHTML = (articleData.title || articleData.path).replace(keywordRegExp, '<mark>$1</mark>');
						else title.innerText = articleData.title || articleData.path;
						article.appendChild(title);
						info.className = 'info';
						publishedTime.className = 'publishedTime';
						publishedTime.innerText = new Date(articleData.publishedTime).toJSON().split('T')[0];
						info.appendChild(publishedTime);
						article.appendChild(info);
						if(!useFilter){
							let timePoint = $e('div');
							timePoint.className = 'timePoint';
							article.appendChild(timePoint);
						}
						main.appendChild(article);
	
						let listItem = $e('li');
						listItem.for = article;
						listItem.innerText = articleData.title || articleData.path;
						listItem.addEventListener('click', () => {
							let articleRect = article.getBoundingClientRect();
							window.scroll(0, articleRect.y + window.scrollY);
						});
						outlineList.appendChild(listItem);
					}
					if(articleDatas.length > articlesPerPage){
						let articlePageSwitcher = $e('div'), 
							buttonFirst = $e('button'), 
							buttonPrevious = $e('button'), 
							pageNumberBox = $e('div'), 
							pageNumberInput = $e('input'), 
							pageNumberSpan = $e('span'), 
							buttonNext = $e('button'), 
							buttonLast = $e('button');
						let startQuery = `?page=articles${$_GET['archive'] ? `&archive=${$_GET['archive']}` : ''}${$_GET['category'] ? `&category=${$_GET['category']}` : ''}${$_GET['tags'] ? `&tags=${$_GET['tags']}` : ''}&start=`
						buttonFirst.addEventListener('click', () => {goto(startQuery + '0');});
						articlePageSwitcher.appendChild(buttonFirst);
						buttonPrevious.addEventListener('click', () => {goto(startQuery + (startAt > 0 ? startAt - articlesPerPage : startAt).toString());});
						articlePageSwitcher.appendChild(buttonPrevious);
						pageNumberInput.value = Math.ceil(startAt/articlesPerPage) + 1;
						pageNumberBox.appendChild(pageNumberInput);
						pageNumberSpan.innerText = ` / ${Math.ceil(articleDatas.length/articlesPerPage)}`;
						pageNumberBox.appendChild(pageNumberSpan);
						articlePageSwitcher.appendChild(pageNumberBox);
						buttonNext.addEventListener('click', () => {goto(startQuery + (startAt < Math.floor(articleDatas.length/articlesPerPage)*articlesPerPage ? startAt + articlesPerPage : startAt).toString());});
						articlePageSwitcher.appendChild(buttonNext);
						buttonLast.addEventListener('click', () => {goto(startQuery + (Math.floor(articleDatas.length/articlesPerPage)*articlesPerPage).toString());});
						articlePageSwitcher.appendChild(buttonLast);
						articlePageSwitcher.className = 'articlePageSwitcher';
						main.appendChild(articlePageSwitcher);
					}
					if(main.childElementCount === 1){
						main.innerHTML = '<article class="row" style="border-width: 0px;"><h1 class="title" style="color: var(--text-color3);">No articles matching filter criteria found.</h1></article>';
					}
				}
			};
			if(isMobileStyle()) window.scroll(0, window.innerHeight - window.innerWidth*0.2);
		}
		else if($_GET['page'] == 'portfolio'){
			if(!tabNow('tab-portfolio')){failedPage(); return;}
			asidePageNow(false);
			dataLoaded = () => {
				if(data?.portfolio?.works?.data){
					let portfolioGroup = $e('div'), 
						portfolioText = $e('h2'), 
						portfolioBox = $e('div');
					portfolioText.className = 'portfolioText';
					portfolioText.innerText = data.portfolio.works.text ? data.portfolio.works.text : 'Works';
					portfolioGroup.appendChild(portfolioText);
					portfolioBox.className = 'portfolioBox';
					portfolioGroup.appendChild(portfolioBox);
					portfolioGroup.className = 'portfolioGroup';
					main.appendChild(portfolioGroup);
					for(let worksData of data.portfolio.works.data){
						let portfolioItem = $e('div'), 
						portfolioItemCover = $e('div'), 
						portfolioItemMask = $e('div'), 
						portfolioItemName = $e('h2'), 
						portfolioItemDescription = $e('p');
						portfolioItemCover.className = 'cover';
						portfolioItemCover.style.setProperty('--bgi', `url('${styleToTopPath}/${worksData.coverPath}')`);
						portfolioItem.appendChild(portfolioItemCover);
						portfolioItemMask.className = 'mask';
						portfolioItem.appendChild(portfolioItemMask);
						portfolioItemName.innerText = worksData.name;
						portfolioItemMask.appendChild(portfolioItemName);
						portfolioItemDescription.innerText = worksData.description;
						portfolioItemMask.appendChild(portfolioItemDescription);
						portfolioItem.addEventListener('click', () => {window.open(worksData.link, '_blank');})
						portfolioBox.appendChild(portfolioItem);
					}
				}
				if(data?.portfolio?.videos?.data){
					let portfolioGroup = $e('div'), 
						portfolioText = $e('h2'), 
						portfolioBox = $e('div');
					portfolioText.className = 'portfolioText';
					portfolioText.innerText = data.portfolio.videos.text ? data.portfolio.videos.text : 'videos';
					portfolioGroup.appendChild(portfolioText);
					portfolioBox.className = 'portfolioBox';
					portfolioGroup.appendChild(portfolioBox);
					portfolioGroup.className = 'portfolioGroup';
					main.appendChild(portfolioGroup);
					for(let albumData of data.portfolio.videos.data){
						let albumBox = $e('div'), 
							albumNameBox = $e('div'), 
							albumName = $e('h3'), 
							iframeBox = $e('div'), 
							iframe = $e('iframe'), 
							nameList = $e('ul');
						albumName.innerText = albumData.name;
						albumNameBox.appendChild(albumName);
						albumNameBox.className = 'albumNameBox';
						albumBox.appendChild(albumNameBox);
						iframeBox.appendChild(iframe);
						albumBox.appendChild(iframeBox);
						albumBox.appendChild(nameList);
						albumBox.className = 'albumBox';
						portfolioBox.appendChild(albumBox);
						for(let i = 0; i < albumData.data.length; i++){
							let videoData = albumData.data[i];
							let videoRadio = $e('input'), 
								videoLabel = $e('label'), 
								videoName = $e('li');
							videoRadio.type = 'radio';
							var sameNameAmount = $$(`#a-${albumData.name}`).length;
							videoRadio.name = `a-${albumData.name}${sameNameAmount === 0 ? '' : sameNameAmount+1}`;
							videoRadio.id = `${videoRadio.name}-${i}`;
							if(i === 0){
								videoRadio.checked = true;
								iframe.src = videoData.iframeLink;
							}
							videoName.appendChild(videoRadio);
							videoLabel.innerText = videoData.name;
							videoLabel.setAttribute('for', videoRadio.id);
							videoName.appendChild(videoLabel);
							videoName.addEventListener('click', () => {
								iframe.src = videoData.iframeLink;
							});
							nameList.appendChild(videoName);
						}
					}
				}
			};
		}
		else if($_GET['page'] == 'about'){
			if(!tabNow('tab-about')){failedPage(); return;}
			asidePageNow(false);
			let aboutPath = $('#tab-about').getAttribute('data-aboutPath'), 
				aboutBasicPath = aboutPath.replace(/(\/|\\).*(?=(\.md))\.md/g, '');
			let content = $e('div');
			main.appendChild(content);
			(async () => {
				let aboutContent = await fetch(aboutPath).then(r => r.text());
				aboutContent = aboutContent.replaceAll('<?=basicPath?>', aboutBasicPath);
				aboutContent = _marked_parse(aboutContent);
				if(!(aboutContent.toLowerCase().indexOf('<!-- don\'tparseasarticle -->') > -1 || aboutContent.toLowerCase().indexOf('<!-- don\'t parse as article -->') > -1)){
					let article = $e('article');
					content.className = 'content';
					content.remove();
					article.appendChild(content);
					main.appendChild(article);
				}
				content.innerHTML = aboutContent;
			})();
		}
		else{
			failedPage();
			return;
		}
		
		function checkLoadDone(){
			if(loadDataDone){
				dataLoaded();
			}
			else{
				setTimeout(checkLoadDone, 30);
			}
		}
		checkLoadDone();
	}
	generatePage();

	window.addEventListener('scroll', () => {
		var focusedSegmentDatas = $$('#pageRadio-outline + label > .page li');
		if(focusedSegmentDatas.length == 0) return;
		focusedSegmentDatas = focusedSegmentDatas
			.map(li => [li, li.for?.getBoundingClientRect()])
			.filter(liData => liData[1] && liData[1].y < liData[1].height);
		if(focusedSegmentDatas.length > 0){
			var maxY = Math.max(...focusedSegmentDatas.map(liData => liData[1].y));
			var focusedSegment = focusedSegmentDatas.find(liData => liData[1].y == maxY)[0];
			if(!focusedSegment.className.includes('now')){
				var removeClassTarget = $('#pageRadio-outline + label > .page li.now');
				if(removeClassTarget){
					removeClassTarget.className = removeClassTarget.className.replace(/ *now */g, ' ');
				}
				focusedSegment.className += ' now';
				// if(focusedSegment.for.id){
				// 	history.pushState({}, `${$_GET['article']} ${focusedSegment.for.innerText}`, `?page=${$_GET['page']}&${$_GET[$_GET['page']] ? `${$_GET['page']}=${$_GET[$_GET['page']]}&` : ''}anchor=${focusedSegment.for.id}`);
				// }
			}
		}
		else{
			var removeClassTarget = $('#pageRadio-outline + label > .page li.now');
			if(removeClassTarget){
				removeClassTarget.className = removeClassTarget.className.replace(/ *now */g, ' ');
			}
		}
	});

	window.addEventListener('scroll', () => {
		if(isMobileStyle()){
			html.style.setProperty('--window-scrollY', window.scrollY);
		}
	}, false);


	function scaleSlides(slides){
		let [width, height] = [slides.getAttribute('width'), slides.getAttribute('height')];
		slides.style.setProperty('--scale', Math.min(window.innerHeight/height*width, window.innerWidth)/width);
	}
	window.addEventListener('resize', () => {
		$$('.slides').forEach(slides => scaleSlides(slides));
	});

	const slidesPlayer = $('#slidesPlayer');
	slidesPlayer.opening = false;
	const slidesPlayerBox = $('#slidesPlayer > .box');
	const slidesThemeSelector = $('#slidesThemeSelector');
	if(localStorage.getItem('slidesTheme')){
		slidesPlayer.setAttribute('theme', localStorage.getItem('slidesTheme'));
	}
	else {
		slidesPlayer.setAttribute('theme', 'none');
	}
	[
		{name: 'none', color: 'white'}, 
		{name: 'berry', color: '#ee9fb2'}, 
		{name: 'honey', color: '#ffdf97'}, 
		{name: 'lemon', color: '#bfffb3'}, 
		{name: 'glitch', color: 'black'}, 
	].forEach(themeData => {
		var button = $e('button');
		button.style.setProperty('--bgc', themeData.color);
		button.setAttribute('title', themeData.name);
		button.addEventListener('click', () => {
			slidesPlayer.setAttribute('theme', themeData.name);
			localStorage.setItem('slidesTheme', themeData.name);
		});
		slidesThemeSelector.appendChild(button);
	});
	function displaySlides(){
		var slides = new Slides(data.slidesContent);
		var slidesElement = slides.getElement();
		slidesPlayerBox.innerHTML = '';
		scaleSlides(slidesElement);
		slidesPlayerBox.appendChild(slidesElement);
	}
	function playSlides(){
		if(slidesUseable){
			if(slidesPlayerBox.childElementCount === 0){
				displaySlides();
			}
			slidesPlayer.setAttribute('visible', '');
			$('.slides', slidesPlayerBox).scroll(0, 0);
			slidesPlayer.opening = true;
			document.body.style.overflow = 'hidden';
		}
	}
	function exitSlides(){
		if(slidesUseable){
			if(document.webkitIsFullScreen || document.mozIsFullScreen){
				fullScreenSlides(false);
			}
			slidesPlayer.removeAttribute('visible');
			slidesPlayer.opening = false;
			document.body.style.overflow = 'auto';
		}
	}
	function fullScreenSlides(targetStatus = !(document.webkitIsFullScreen || document.mozIsFullScreen)){
		if(slidesUseable){
			if(targetStatus){
				if (slidesPlayer.requestFullscreen) slidesPlayer.requestFullscreen();
				else if (slidesPlayer.webkitRequestFullscreen) slidesPlayer.webkitRequestFullscreen();
			}
			else{
				if (document.exitFullscreen) document.exitFullscreen();
				else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
			}
		}
	}
	const slidesUseable = !isMobileStyle();
	const slidesUpKeys = ['arrowup', 'arrowleft', 'w', 'a', 'backspace'];
	const slidesDownKeys = ['arrowdown', 'arrowright', 's', 'd', 'enter'];
	const slidesListeningKeys = [...slidesUpKeys, ...slidesDownKeys, 'escape', 'f11'];
	document.addEventListener('keydown', event => {
		if(slidesPlayer.opening){
			var key = event.key.toLowerCase();
			if(!event.shiftKey && !event.ctrlKey && slidesListeningKeys.indexOf(key) > -1){
				event.preventDefault();
				let slides = $('.slides', slidesPlayerBox);
				if(key === 'escape'){
					exitSlides();
				}
				else if(key === 'f11'){
					fullScreenSlides();
				}
				else{
					event.stopPropagation();
					slides.scroll(0, slides.scrollTop + parseInt(slides.getAttribute('height'))*(slidesUpKeys.indexOf(key) > -1 ? -1 : 1));
				}
			}
		}
	});
	$('#slidesButton-close').addEventListener('click', () => {
		exitSlides();
	});
	$('#slidesButton-fullScreen').addEventListener('click', () => {fullScreenSlides();});
})();