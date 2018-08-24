const tetris = {
	//每个格子的大小
	CSIZE: 26,

	//边框需要修正的距离
	OFFSET: 15,

	//总行数
	RN: 20,

	//总列数
	CN: 10,

	//正在下落的主角图形
	shape: null,

	//保存游戏主界面div
	pg: null,

	//保存定时器序号
	timer: null,

	//保存下落的时间间隔(速度)
	interval: 1000,

	//保存停止下落的格子的墙数组
	wall: null,

	//保存消除的总行数
	lines: 0,

	//保存总分数
	score: 0,
	SCORES: [0, 10, 30, 60, 150],

	//保存下一个备胎图形
	nextShape: null,
	state: 1,
	GAMEOVER: 0,
	RUNNING: 1,
	PAUSE: 2,
	IMGS: {
		GAMEOVER: "img/game-over.png",
		PAUSE: "img/pause.png"
	},

	//保存当前的级别
	level: 1,
	//每10行一级

	//保存每几行升一级
	levelIn: 10,

	//保存每升一级减的秒数
	levelS: 200,

	//负责根据当前状态,绘制对应图片
	paintState() {
		let img = new Image();
		if (this.state == this.PAUSE) {
			img.src = this.IMGS.PAUSE;
		} else if (this.state == this.GAMEOVER) {
			img.src = this.IMGS.GAMEOVER;
		}
		this.pg.appendChild(img);
	},
	myContinue() {
		this.state = this.RUNNING;
		this.paint();
		this.timer = setInterval(() => {
			this.moveDown()
		}, this.interval);
	},
	pause() {
		clearInterval(this.timer);
		this.timer = null;
		this.state = this.PAUSE;
		this.paint();
	},

	//随机生成图形
	randomShape() {
		//在0~6之间生成随机数,保存在变量r中
		//判断r
		//如果是0,就返回一个新的O对象
		//如果是1,就返回一个新的I对象
		//如果是2,就返回一个新的T对象
		let r = parseInt(Math.random() * 7);
		//console.log(r);
		switch (r) {
			case 0: return new L();
			case 1: return new S();
			case 2: return new T();
			case 3: return new Z();
			case 4: return new I();
			case 5: return new J();
			case 6: return new O();
		}
	},

	//启动游戏
	start() {
		this.state = this.RUNNING;
		this.lines = 0;
		this.score = 0;
		this.level = 1;
		this.interval = 1000;
		this.wall = [];
		for (let r = 0; r < this.RN; r++) {
			this.wall[r] = new Array(this.CN);
		}
		this.pg = document.getElementsByClassName("playground")[0];
		this.shape = this.randomShape();
		this.nextShape = this.randomShape();
		this.paint();

		this.timer = setInterval(() => {
			this.moveDown()
		}, this.interval);

		//为当前页面绑定键盘按下事件为
		document.onkeydown = (e) => {
			//判断键盘好
			//如果是40:就调moveDown,break
			//如果是37:就调moveLeft,break
			//如果是39:就调moveRight,break
			switch (e.keyCode) {
				case 40: this.state == this.RUNNING && this.moveDown(); break;//下
				case 37: this.state == this.RUNNING && this.moveLeft(); break;//左
				case 38: this.state == this.RUNNING && this.rotateR(); break;//上
				case 90: this.state == this.RUNNING && this.rotateL(); break;//Z
				case 39: this.state == this.RUNNING && this.moveRight(); break;//右
				case 80: this.state == this.RUNNING && this.pause(); break;//P
				case 67: this.state == this.PAUSE && this.myContinue(); break;//C
				case 81: this.state != this.GAMEOVER && this.quit(); break;//Q 
				case 83: this.state == this.GAMEOVER && this.start(); break;//S 重启
				case 32: this.state == this.RUNNING && this.hardDrop(); break;//空格
			}
		}
	},

	//一键到底
	hardDrop() {
		while (this.canDown()) {
			this.moveDown();
		}
	},
	//检查旋转是否成功
	canRotate() {
		for (let i = 0; i < this.shape.cells.length; i++) {
			let cell = this.shape.cells[i];
			if (cell.r < 0 || cell.r >= this.RN || cell.c < 0 || cell.c >= this.CN) {
				return false;
			}
			if (this.wall[cell.r][cell.c]) {
				return false;
			}
		}
		return true;
	},

	//顺时针旋转
	rotateR() {
		this.shape.rotateR();
		if (!this.canRotate()) {
			this.shape.rotateL();
		}
		this.paint();
	},

	//逆时针旋转
	rotateL() {
		this.shape.rotateL();
		if (!this.canRotate()) {
			this.shape.rotateR();
		}
		this.paint();
	},

	//绘制主角图形
	paintShape() {
		let frag = document.createDocumentFragment();
		for (let i = 0; i < this.shape.cells.length; i++) {
			let cell = this.shape.cells[i];
			this.paintCell(cell, frag);
		}
		this.pg.appendChild(frag);
	},

	//判断是否可以下落
	canDown() {
		for (let i = 0; i < this.shape.cells.length; i++) {
			let cell = this.shape.cells[i];
			if (cell.r == this.RN - 1) {
				return false;
			}
			if (this.wall[cell.r + 1][cell.c]) {
				return false;
			}
		}
		return true;
	},

	//将停止下落的主角图形,放入墙中相同位置
	landIntoWall() {
		for (let i = 0; i < this.shape.cells.length; i++) {
			var cell = this.shape.cells[i];
			this.wall[cell.r][cell.c] = cell;
		}
	},
	moveDown() {
		if (this.canDown()) {
			this.shape.moveDown();
		} else {
			this.landIntoWall();
			let In = this.deleteRows();
			this.lines += In;
			//如果lines>level*levelIn
			//level+1
			//interval-=(level-1)*levelS
			//停止周期性定时器
			//再次启动定时器
			if (this.lines > this.level * this.levelIn) {
				this.level++;
				this.interval -= (this.level - 1) * this.levelS;
				clearInterval(this.timer);
				this.timer = setInterval(() => {
					this.moveDown()
				}, this.interval);
			}
			this.score += this.SCORES[In];
			//如果游戏没有结束
			if (!this.isGameOver()) {
				this.shape = this.nextShape;//备胎转正
				this.nextShape = this.randomShape();//随机生成新的备胎
			} else {
				this.quit();
			}
		}
		this.paint();
	},

	//退出游戏
	quit() {
		this.state = this.GAMEOVER;
		clearInterval(this.timer);
		this.timer = null;
		this.paint();
	},

	//判断游戏结束
	isGameOver() {
		for (let i = 0; i < this.nextShape.cells.length; i++) {
			let cell = this.nextShape.cells[i];
			if (this.wall[cell.r][cell.c]) {
				return true;
			}
		}
		return false;
	},

	//将分数写到页面
	paintScore() {
		score.innerHTML = this.score;
		lines.innerHTML = this.lines;
		level.innerHTML = this.level;
	},

	//删除所有行
	deleteRows() {
		for (let r = this.RN - 1, In = 0; r >= 0; r--) {
			if (this.wall[r].join("") == "") {
				return In;
			}
			if (String(this.wall[r]).search(/^,|,,|,$/) == -1) {
				this.deleteRow(r);
				r++;
				In++;
				if (In == 4) {
					return In;
				}
			}
		}
	},

	//删除第r行
	deleteRow(r) {
		for (; r >= 0; r--) {
			this.wall[r] = this.wall[r - 1];//底层数据的变化
			for (let c = 0; c < this.CN; c++) {
				if (this.wall[r][c]) {
					this.wall[r][c].r++;//保证能够绘出图
				}
			}
			this.wall[r - 1] = new Array(this.CN);
			if (this.wall[r - 2].join("") == "") {
				break;
			}
		}
	},

	//重绘一切
	paint() {
		this.pg.innerHTML = this.pg.innerHTML.replace(/<img[^>]+>/g, "");
		this.paintShape();//绘制主角图形
		this.paintWall();//绘制墙
		this.paintScore();//将分数写到页面
		this.paintNext();//重绘备胎图形
		this.paintState();//负责根据当前状态,绘制对应图片
	},

	//重绘备胎图形
	paintNext() {
		let frag = document.createDocumentFragment();
		for (let i = 0; i < this.nextShape.cells.length; i++) {
			let cell = this.nextShape.cells[i];
			let img = new Image();
			img.src = cell.src;
			img.style.top = (cell.r + 1) * this.CSIZE + this.OFFSET + "px";
			img.style.left = (cell.c + 10) * this.CSIZE + this.OFFSET + "px";
			frag.appendChild(img);
		}
		this.pg.appendChild(frag);
	},
	paintCell(cell, frag) {
		let img = new Image();
		img.src = cell.src;
		img.style.top = this.CSIZE * cell.r + this.OFFSET + "px";
		img.style.left = this.CSIZE * cell.c + this.OFFSET + "px";
		frag.appendChild(img);
	},
	paintWall() {
		let frag = document.createDocumentFragment();
		for (let r = this.RN - 1; r >= 0; r--) {
			if (this.wall[r].join("") == "") {
				break;
			}
			for (let c = 0; c < this.CN; c++) {
				let cell = this.wall[r][c];
				if (cell) {
					this.paintCell(cell, frag);
				}
			}
		}
		this.pg.appendChild(frag);
	},

	//用于检查能否左移
	canLeft() {
		for (let i = 0; i < this.shape.cells.length; i++) {
			let cell = this.shape.cells[i];
			if (cell.c == 0) {
				return false;
			}
			if (this.wall[cell.r][cell.c - 1]) {
				return false;
			}
		}
		return true;
	},

	//将主角左移一步
	moveLeft() {
		if (this.canLeft()) {
			this.shape.moveLeft();
			this.paint();
		}
	},
	canRight() {
		for (let i = 0; i < this.shape.cells.length; i++) {
			let cell = this.shape.cells[i];
			if (cell.c == this.CN - 1) {
				return false;
			}
			if (this.wall[cell.r][cell.c + 1]) {
				return false;
			}
		}
		return true;
	},
	moveRight() {
		if (this.canRight()) {
			this.shape.moveRight();
			this.paint();
		}
	},
}
window.onload = () => {
	tetris.start();
}