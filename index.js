

function getRandColorString() {
	let colors = [ 1, 2, 3, 4, 5, ,6, 7, 8, 9 ,'a', 'b', 'c', 'd', 'e', 'f' ]
	// let rand1 = Math.floor(Math.random() * colors.length - 1)
	return `#${colors[Math.floor(Math.random() * (colors.length - 1))]}${colors[Math.floor(Math.random() * (colors.length - 1))]}${colors[Math.floor(Math.random() * colors.length - 1)]}`
}

class Segment {
	constructor(x, y, size, color) {
		Object.assign(this, { x, y, size, color } );
	}

	draw(ctx) {
		ctx.fillStyle = this.color;
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
		ctx.fill()
	}
}

class Snake {
	constructor(opts = {}){
		let defaults = { startX: 10000, startY: 10000 , len: 150, thickness: 50, startAngle: null }
		opts = Object.fromEntries(Object.entries(opts).filter(elem => defaults[elem[0]]!= undefined));
		Object.assign(this, defaults, opts);

		this.angle = this.startAngle || 2;
		this.speed = 10;

		this.head = new Segment(this.startX, this.startY, 50, 'red');
		this.tail = [this.head];

		this._init();
	}

	_init() {
		for(let i = 0; i < this.len; i++) {
			let color = getRandColorString();
			this.tail.push(new Segment(this.head.x, this.head.y + 1 + i * 10, 50, getRandColorString()));
		}
	}

	go() {
		this.angle += Math.random() / 3 - 0.15;
		// this.speed = (Math.random() - 0.5) * 50 + 10

		this.dx = Math.sin(this.angle) * this.speed;
		this.dy = - Math.cos(this.angle) * this.speed;

		for(let i = this.tail.length - 1; i > 0; i--) {
			this.tail[i].x = this.tail[i - 1].x;
			this.tail[i].y = this.tail[i - 1].y;
		}

		this.head.x += this.dx;
		this.head.y += this.dy;

	}

	

	draw(ctx) {

		this.tail.forEach(elem => {
			elem.draw(ctx);
		})
	}
}

class Game {
	constructor(opts) {
		let defaults = { fps: 60, canvas }
		opts = Object.fromEntries(Object.entries(opts).filter(elem => defaults[elem[0]]!= undefined));
		Object.assign(this, defaults, opts);

		this.snake = new Snake(100, 100);
		this.context = this.canvas.getContext('2d');
	}

	watchBorders() {
		if(this.snake.head.y > this.canvas.height) 
			this.snake.head.y = 0
		if(this.snake.head.x > this.canvas.width)
			this.snake.head.x = 0
		if(this.snake.head.y < 0)
			this.snake.head.y = this.canvas.height
		if(this.snake.head.x < 0)
			this.snake.head.x = this.canvas.width
	}

	start() {
		setInterval(() => {

			this.context.fillStyle = 'black';
			this.context.fillRect(0, 0, this.canvas.width,this.canvas.height)

			this.watchBorders();
			this.snake.go();
			this.snake.draw(this.context)
		}, 1000 / this.fps);
	}
}

let canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let game = new Game({
	canvas,
	fps: 60
})

game.start();


let context = canvas.getContext('2d');
// let segment = new Segment(10, 10, 50);
// segment.draw(context);

let snake = new Snake()
snake.draw(context)

