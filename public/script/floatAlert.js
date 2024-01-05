/*
 * 2023 © MaoHuPi
 * 浮動式提示框動畫
 * blogTemplate_thread > public > script > floatAlert.js
 */

'use strict';

class FloatAlert{
	#displayed = false;
	constructor(content = '', type = 'compleat', alive = 5){
		this.content = content;
		this.type = type;
		this.alive = alive;
		this.animationElement = $e('div');
		this.animationElement.className = "FloatAlert_animationElement";
		this.#displayed = false;
	}
	display(){
		this.animationElement.innerText = this.content;
		this.animationElement.className = `FloatAlert_animationElement ${this.type}`;
		setTimeout(() => {this.destroy();}, this.alive*1e3);
		this.#displayed = true;
		return this.animationElement;
	}
	destroy(){
		this.#displayed = false;
		this.animationElement.remove();
	}
	get displayed(){return this.#displayed;}
}