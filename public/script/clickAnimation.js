/*
 * 2023 © MaoHuPi
 * 網頁點擊時的效果動畫
 * blogTemplate_thread > public > script > clickAnimation.js
 */

'use strict';

class ClickAnimation{
	#displayed = false;
	constructor(x = 0, y = 0, alive = 1){
		[this.x, this.y] = [x, y];
		this.alive = alive;
		this.animationElement = $e('div');
		this.animationElement.className = "ClickAnimation_animationElement";
		this.#displayed = false;
	}
	display(){
		this.animationElement.style.setProperty('--x', `${this.x}px`); // |- to allow to call this.display after set this.x, this.y outside.
		this.animationElement.style.setProperty('--y', `${this.y}px`); // |
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