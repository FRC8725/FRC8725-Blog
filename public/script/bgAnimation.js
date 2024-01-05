/*
 * 2023 © MaoHuPi
 * 網頁背景的隨機點連線動畫
 * blogTemplate_thread > public > script > bgAnimation.js
 */

'use strict';

class BGAnimation_Dot{
	#xp = 0;
	#yp = 0;
	#direction = 0;
	#speed = 0;
	constructor(x = 0, y = 0, direction = 0, speed = 2){
		[this.x, this.y] = [x, y];
		this.#direction = direction;
		this.#speed = speed;
		this.#pUpdate();
	}
	get direction(){return this.#direction;}
	set direction(direction){
		this.#direction = direction;
		this.#pUpdate();
		return direction;
	}
	get speed(){return this.#speed;}
	set speed(speed){
		this.#speed = speed;
		this.#pUpdate();
		return speed;
	}
	#pUpdate = () => {
		this.#xp = Math.cos(this.#direction) * this.#speed;
		this.#yp = Math.sin(this.#direction) * this.#speed;
	}
	update(){
		this.x += this.#xp;
		this.y += this.#yp;
	}
	undo(){
		this.x -= this.#xp;
		this.y -= this.#yp;
	}
}
class BGAnimation{
	#dots = [];
	#cvs = undefined;
	#ctx = undefined;
	#playing = false;
	#frameKeep = 30;
	constructor(data){
		data = {cvs: undefined, width: 100, height: 100, dotAmount: 10, maxLineLength: 200, speed: 2, color: '0, 0, 0', ...data};
		[this.width, this.height] = [data.width, data.height];
		this.#cvs = data.cvs || $e('canvas');
		this.#ctx = this.#cvs.getContext('2d');
		this.maxLineLength = data.maxLineLength;
		this.color = data.color;
		this.generateDots(data);
	}
	generateDots(data){
		this.#dots = new Array(data.dotAmount).fill(0).map(() => new BGAnimation_Dot(
			Math.random()*this.width, 
			Math.random()*this.height, 
			Math.random()*2*Math.PI, 
			data.speed
		));
	}
	update(){
		this.#dots
			.forEach(dot => dot.update());
		this.#dots
			.filter(dot => dot.x < 0 || dot.x > this.width)
			.forEach(dot => {
				dot.undo();
				dot.direction = Math.PI - dot.direction;
			});
		this.#dots
			.filter(dot => dot.y < 0 || dot.y > this.height)
			.forEach(dot => {
				dot.undo();
				dot.direction = -dot.direction;
			});
		
		[this.#cvs.width, this.#cvs.height] = [this.width, this.height];
		// this.#ctx.fillStyle = 'red';
		// this.#ctx.fillRect(0, 0, this.width, this.height);
		for(let i = 0; i < this.#dots.length; i++){
			let d1 = this.#dots[i];
			this.#ctx.fillStyle = `rgb(${this.color})`;
			this.#ctx.fillRect(d1.x, d1.y, 1, 1);
			for(let j = i+1; j < this.#dots.length; j++){
				let d2 = this.#dots[j];
				var distance = Math.abs(d1.x-d2.x) + Math.abs(d1.y-d2.y);
				if(distance < this.maxLineLength){
					this.#ctx.strokeStyle = `rgba(${this.color}, ${1 - distance/this.maxLineLength})`;
					this.#ctx.beginPath();
					this.#ctx.moveTo(d1.x, d1.y);
					this.#ctx.lineTo(d2.x, d2.y);
					this.#ctx.closePath();
					this.#ctx.stroke();
				}
			}
		}
	}
	play(fps = 30){
		this.#playing = true;
		this.#frameKeep = 1e3/fps;
		this.#loop();
	}
	#loop = () => {
		if(this.#playing){
			this.update();
			setTimeout(() => {this.#loop();}, this.#frameKeep);
		}
	}
	pause(){this.#playing = false}
}