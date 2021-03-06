//定义每次，每个格子，两个方向移动步长的对象
function Task(div,stepX,stepY){
	this.div=div;
	this.stepX=stepX;
	this.stepY=stepY;
}

define((require, exports, module) => {
	const animation = {
		//保存每个格子的大小
		CSIZE: 100,

		//保存格子之间的距离
		MARGIN: 16,

		//动画的总时间
		DURATION: 200,

		//动画的总步数
		STEPS: 40,

		//动画已经移动了的步数
		moved: 0,

		//动画的时间间隔
		interval: 0,

		//动画的序号
		timer: null,

		//保存所有移动的任务
		tasks: [],

		init() {
			this.interval = this.DURATION / this.STEPS
		},
		addTask(divR, divC, offsetC, offsetR) {
			let div = document.getElementById("c" + divR + divC)
			let stepX = offsetC * (this.CSIZE + this.MARGIN) / this.STEPS
			let stepY = offsetR * (this.CSIZE + this.MARGIN) / this.STEPS
			this.tasks.push(new Task(div, stepX, stepY))
		},
		start(callback) {
			this.timer = setInterval(this.moveStep.bind(this, callback), this.interval)
		},

		//没移动一步
		moveStep(callback) {
			for (let i = 0; i < this.tasks.length; i++) {
				let task = this.tasks[i]
				let style = getComputedStyle(task.div)
				task.div.style.left = parseFloat(style.left) + task.stepX + "px"
				task.div.style.top = parseFloat(style.top) + task.stepY + "px"
			}
			this.moved++
			if (this.moved == this.STEPS) {
				clearInterval(this.timer)
				this.timer = null
				this.moved = 0;
				for (let i = 0; i < this.tasks.length; i++) {
					let task = this.tasks[i]
					task.div.style.left = ""
					task.div.style.top = ""

				}
				this.tasks.length = 0
				callback()
			}
		}
	}
	module.exports = animation
})




