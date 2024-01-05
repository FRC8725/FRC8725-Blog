/*
 * 2023 © MaoHuPi
 *
 * src https://tab-studio.github.io/TSJSlib/basic.js
 * version 2.0.4
 */
function $(e, f = document){
    let r;
    try {r = f.querySelector(e);}
    catch(error){r = false;}
    return(r);
}
function $$(e, f = document){
    let r;
    try {r = [...f.querySelectorAll(e)];}
    catch(error){r = [];}
    return(r);
}
function $e(name){return(document.createElement(name));}
function vw(){return(window.innerWidth/100);}
function vh(){return(window.innerHeight/100);}
function random(min, max){return(Math.floor(Math.random()*(max+1-min))+min);}
const keys = {}, 
$_GET = {}, 
$_COOKIE = {};
function refreshGet(){
    for(let key in $_GET){
        delete $_GET[key];
    }
    if(location.href.indexOf('?') > -1){
        location.href.split('?')[1].split('&').forEach(kv => {
            kv = kv.split('=');
            $_GET[kv[0]] = kv[1];
        });
    }
}
refreshGet();
function refreshCookie(){
    for(let key in $_COOKIE){
        delete $_COOKIE[key];
    }
    if(document.cookie !== ''){
        document.cookie.split('; ').forEach(kv => {
            kv = kv.split('=');
            $_COOKIE[kv[0]] = kv[1];
        });
    }
}
refreshCookie();
function getGet(key = false){
    let get = {};
    if(location.href.indexOf('?') > -1){
        location.href.split('?')[1].split('&').forEach(kv => {
            kv = kv.split('=');
            get[kv[0]] = kv[1];
        });
    }
    if(key !== false){
        return(get[key]);
    }
    else{
        return(get);
    }
}
function getCookie(key = false){
    let cookie = {};
    if(document.cookie !== ''){
        document.cookie.split('; ').forEach(kv => {
            kv = kv.split('=');
            cookie[kv[0]] = kv[1];
        });
    }
    if(key !== false){
        return(cookie[key]);
    }
    else{
        return(cookie);
    }
}
function setCookie(key = undefined, value = undefined, expire = undefined, path = undefined, domain = undefined, secure = undefined){
    let cookie = '';
    if(key !== undefined && value !== undefined){
        cookie = `${key}=${value}`;
        if(expire !== undefined){
            cookie += `; expires=${expire}`;
        }
        if(path !== undefined){
            cookie += `; path=${path}`;
        }
        if(domain !== undefined){
            cookie += `; domain=${domain}`;
        }
        if(secure !== undefined){
            cookie += `; secure`;
        }
        document.cookie = cookie;
    }
}
function sendXmlhttp(name = '', value = '', responseFunction = t => {console.log(t);}, type = 'get'){
    let xmlhttp = new XMLHttpRequest();
    let rf = function (){
        if (xmlhttp.readyState==4) {
            responseFunction(xmlhttp.responseText);
        }
    }
    type = type.toLowerCase();
    xmlhttp.addEventListener("readystatechange", rf);
    if(type == 'get'){
        xmlhttp.open("GET", name+value);
        xmlhttp.send();
    }
    else if(type == 'post'){
        xmlhttp.open("POST", name,true);
        xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xmlhttp.send(value);
    }
}
function webLoad(link){
    if(keys['Control']){
        window.open(link);
    }
    else{
        location.href = link;
    }
}
function webOpen(link){
    window.open(link);
}
function radians(deg){
    return(deg * (Math.PI / 180));
}
function deg(radians){
    return(radians / (Math.PI / 180));
}
function creatDataBuffer(valueFunc){
    let buffer = {};
    function func(key){
        let value = buffer[key];
        if(!value){
            value = valueFunc(key);
            buffer[key] = value;
        }
        return(value);
    }
    return(func);
}
function flatElement(element){
    let tempParent = document.createElement('div');
    function traverseChildren(element){
        for(let e of element.children){
            if(e.childElementCount > 0){
                traverseChildren(e);
            }
            else{
                e.remove();
                tempParent.appendChild(e);
            }
        }
    }
    traverseChildren(element);
    for(let e of tempParent.children){
        e.remove();
        element.appendChild(e);
    }
    return(element);
}
function flatJson(json){
    if(typeof json === 'string') json = JSON.parse(json);
    let json2 = [];
    function traverse(item){
        if(typeof item === 'object'){
            if('length' in item){
                for(let i of item){
                    traverse(i);
                }
            }
            else{
                for(let k in item){
                    json2.push(k);
                    traverse(item[k]);
                }
            }
        }
        else{
            json2.push(item);
        }
    }
    traverse(json);
    return(json2);
}
function textOffset(text, delta = 1){
    return(text.split('\n').map(row => row.split('').map(char => String.fromCharCode(char.charCodeAt() + delta)).join('')).join('\n'));
}
function isMobileStyle(){
    return(window.matchMedia('(max-width: 100vh)').matches);
}
function randId(length){
    let chars = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return(new Array(length).fill(0).map(() => chars[Math.floor(Math.random()*chars.length)]).join(''));
}