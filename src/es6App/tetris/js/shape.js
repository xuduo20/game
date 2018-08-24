//描述图形中一个格子的统一类型
function Cell(r,c,src){
	this.r=r;
	this.c=c;
	this.src=src;
}
//所有图形的公共父类型
function Shape(cells,src,orgi,states){
	this.cells=cells;
	//遍历cells中每个cell
		//设置当前cell的src属性为src
	for(var i=0;i<this.cells.length;i++){
		this.cells[i].src=src;
	}
	this.orgi=orgi;
	this.states=states;
	this.statei=0;//保存图形当前正在使用的状态的下标
}
Shape.prototype.IMGS={
	T:"img/T.png",
	O:"img/O.png",
	I:"img/I.png",
	J:"img/J.png",
	L:"img/L.png",
	S:"img/S.png",
	Z:"img/Z.png"
}
Shape.prototype.moveDown=function(){
	//遍历当前图形的cells数组中每个格子
		//将当前格子的r+1
	for(var i=0;i<this.cells.length;i++){
		this.cells[i].r++;
	}
}
Shape.prototype.moveLeft=function(){
	//遍历当前图形的cells数组中每个格子
		//将当前格子的c-1
	for(var i=0;i<this.cells.length;i++){
		this.cells[i].c--;
	}
}
Shape.prototype.moveRight=function(){
	//遍历当前图形的cells数组中每个格子
		//将当前格子的c+1
	for(var i=0;i<this.cells.length;i++){
		this.cells[i].c++;
	}
}
Shape.prototype.rotateR=function(){
	//将当前对象的statei+1
	//如果statei=当前对象的states数组中状态的个数,就将statei变回0
	//获取当前对象的states数组中statei位置的状态,保存在变量state中
	this.statei++;
	this.statei==this.states.length&&(this.statei=0);
	this.rotate();
}
Shape.prototype.rotateL=function(){
	//将当前对象的statei-1
	//如果statei=-1,就将statei变回states数组的length-1
	this.statei--;
	this.statei==-1&&(this.statei=this.states.length-1);
	this.rotate();
}
Shape.prototype.rotate=function(){
    //获取当前对象的states数组中statei位置的状态，保存在变量state中
    //获得当前图形的cells中orgi位置的格子，保存在变量oCell中
    //遍历当前图形中每个cell
       //如果i!=orgi时
       //设置当前格子的r为oCell的r+state对象的ri属性值
       //设置当前格子的c为oCell的c+state对象的ci属性值
	var state=this.states[this.statei];
	var oCell=this.cells[this.orgi];
	for(var i=0;i<this.cells.length;i++){
		if(i!=this.orgi){
			this.cells[i].r=oCell.r+state["r"+i];
			this.cells[i].c=oCell.c+state["c"+i];
		}
	}
}
function State(r0,c0,r1,c1,r2,c2,r3,c3){//定义图形的某种状态
	this.r0=r0;this.c0=c0;
	this.r1=r1;this.c1=c1;
	this.r2=r2;this.c2=c2;
	this.r3=r3;this.c3=c3;
}
//T
function T(){
	Shape.call(this,[
		new Cell(0,3),//0
		new Cell(0,4),//1
		new Cell(0,5),//2
		new Cell(1,4)//3
		],
		this.IMGS.T,
		1,//参照格下标
		[
			new State(0,-1,0,0,0,+1,+1,0),
			new State(-1,0,0,0,+1,0,0,-1),
			new State(0,+1,0,0,0,-1,-1,0),
			new State(+1,0,0,0,-1,0,0,+1),
		]
	);
}
Object.setPrototypeOf(T.prototype,Shape.prototype);
//O
function O(){
	Shape.call(this,[
		new Cell(0,4),
		new Cell(0,5),
		new Cell(1,4),
		new Cell(1,5)
		],
		this.IMGS.O,
		0,
		[new State(0,0,0,+1,+1,0,+1,+1)]
		);
}
Object.setPrototypeOf(O.prototype,Shape.prototype);
//I
function I(){
	Shape.call(this,[
		new Cell(0,3),
		new Cell(0,4),
		new Cell(0,5),
		new Cell(0,6)
		],
		this.IMGS.I,
		1,
		[
			new State(0,-1,0,0,0,+1,0,+2),
			new State(-1,0,0,0,+1,0,+2,0),
		]
	);
}
Object.setPrototypeOf(I.prototype,Shape.prototype);
//S 04,05,13,14 orgi 3 states2
function S(){
	Shape.call(this,[
			new	Cell(0,4),
			new	Cell(0,5),
			new	Cell(1,3),
			new	Cell(1,4),
		],
		this.IMGS.S,
		2,
		[
			new State(-1,0,-1,+1,0,0,0,-1),
			new State(-1,-1,0,-1,0,0,+1,0),
		]
	);
}
Object.setPrototypeOf(S.prototype,Shape.prototype);
//Z 03,04,14,15 orgi 2 states 2
function Z(){
	Shape.call(this,[
			new	Cell(0,3),
			new	Cell(0,4),
			new	Cell(1,4),
			new	Cell(1,5),
		],
		this.IMGS.Z,
		2,
		[
			new State(-1,-1,-1,0,0,0,0,+1),
			new State(-1,-1,0,-1,0,0,+1,0),
		]
	);
}
Object.setPrototypeOf(Z.prototype,Shape.prototype);
//L 03,04,05,13 orgi 1 states4
function L(){
	Shape.call(this,[
			new	Cell(0,3),
			new	Cell(0,4),
			new	Cell(0,5),
			new	Cell(1,3),
		],
		this.IMGS.L,
		1,
		[
			new State(0,-1,0,0,0,+1,+1,-1),
			new State(-1,0,0,0,+1,0,-1,-1),
			new State(0,+1,0,0,0,-1,-1,+1),
			new State(+1,0,0,0,-1,0,+1,+1),
		]
	);
}
Object.setPrototypeOf(L.prototype,Shape.prototype);
//J 03,04,05,15 orgi 1 states 4
function J(){
	Shape.call(this,[
			new	Cell(0,3),
			new	Cell(0,4),
			new	Cell(0,5),
			new	Cell(1,5),
		],
		this.IMGS.J,
		1,
		[
			new State(0,-1,0,0,0,+1,+1,+1),
			new State(-1,0,0,0,+1,0,+1,-1),
			new State(0,+1,0,0,0,-1,-1,-1),
			new State(+1,0,0,0,-1,0,-1,+1),
		]
	);
}
Object.setPrototypeOf(J.prototype,Shape.prototype);