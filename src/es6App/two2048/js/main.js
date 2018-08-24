

define((require, exports, module) => {

    const animation = require('./animation')

    const game = {

        //保存游戏的数据：二维数组
        data: null,

        //总列数
        RN: 4,

        //总列数
        CN: 4,

        //保存当前得分
        score: 0,

        //保存最高分
        topScore: 0,

        //保存游戏的状态中
        state: 1,

        //运行中
        RUNNING: 1,

        //游戏结束
        GAMEOVER: 0,

        //有动画正在播放
        PLAYING: 2,

        //格子的大小
        CSIZE: 100,

        //格子的间隔
        MARGIN: 16,

        /*动态生成gridPanel中的div*/
        init() {
            // 向arr中压入：""+r+c
            let arr = []
            for (let r = 0; r < this.RN; r++) {
                for (let c = 0; c < this.CN; c++) {
                    arr.push("" + r + c)
                }
            }
            let strGrid = `<div id="${arr.join('" class="grid"></div><div id="g')}" class="grid"></div>`//背景格
            let strCell = `<div id="c${arr.join('" class="cell"></div><div id="c')}" class="cell"></div>`//前景格
            //设置id为gridPanel的内容为strGrid+strCell
            gridPanel.innerHTML = strGrid + strCell
            //计算gridPanel的宽
            let width = `${this.CN * (this.CSIZE + this.MARGIN) + this.MARGIN}px`
            let height = `${this.RN * (this.CSIZE + this.MARGIN) + this.MARGIN}px`
            //设置gridPanel的宽和高
            gridPanel.style.width = width;
            gridPanel.style.height = height;
        },
        start() {
            //动态生成gridPanel中的div
            this.init()

            this.state = this.RUNNING

            //从cookies中读取最高分
            this.topScore = getCookie("topScore")

            this.topScore == "" && (this.topScore = 0)

            //分数归零
            this.score = 0

            //初始化空数组
            this.data = []
            for (let r = 0; r < this.RN; r++) {
                this.data[r] = [];
                for (let c = 0; c < this.CN; c++) {
                    this.data[r][c] = 0;
                }
            }
            /*随机生成2个2或4*/
            this.randomNum()
            this.randomNum()

            //将data的数据，更新到界面div
            this.updataView()
            //console.log(this.data.join("\n"));
            document.onkeydown = (e) => {
                //console.log(this);
                if (this.state == this.RUNNING) {
                    switch (e.keyCode) {
                        case 37:
                            this.moveLeft()
                            break
                        case 38:
                            this.moveUp()
                            break
                        case 39:
                            this.moveRight()
                            break
                        case 40:
                            this.moveDown()
                            break
                    }
                }

            }
        },

        //判断游戏是否结束
        isGameOver() {
            for (let r = 0; r < this.RN; r++) {
                for (let c = 0; c < this.CN; c++) {
                    if (this.data[r][c] == 0) {
                        return false
                    } else if ((c < this.CN - 1) && this.data[r][c] == this.data[r][c + 1]) {
                        return false
                    } else if ((r < this.RN - 1) && this.data[r][c] == this.data[r + 1][c]) {
                        return false
                    }
                }
            }
            return true;
        },

        /*在随机的空白位置生成一个2或4*/
        randomNum() {
            // if (!this.isFull()) {
            while (true) {
                let r = parseInt(Math.random() * this.RN)
                let c = parseInt(Math.random() * this.CN)
                //console.log(r,c);
                if (this.data[r][c] == 0) {
                    this.data[r][c] = Math.random() > 0.5 ? 4 : 2
                    break
                }
            }
            // }
        },

        //判断数组是否已满
        isFull() {
            for (let r = 0; r < this.data.length; r++) {
                for (let c = 0; c < this.data[r].length; c++) {
                    if (this.data[r][c] == 0) {
                        return false
                    }
                }
            }
            return true
        },

        updataView() {
            topScore.innerHTML = this.topScore
            for (let r = 0; r < this.RN; r++) {
                for (let c = 0; c < this.CN; c++) {
                    let div = document.getElementById(`c${r}${c}`)
                    if (this.data[r][c] != 0) {
                        div.innerHTML = this.data[r][c]
                        div.className = "cell n" + this.data[r][c]
                    } else {
                        div.innerHTML = ""
                        div.className = "cell"
                    }
                }
            }
            score.innerHTML = this.score
            //如果游戏的状态是GAMEOVER
            if (this.state == this.GAMEOVER) {
                finalScore.innerHTML = this.score;
                gameOver.style.display = "block";
            } else {
                gameOver.style.display = "none";
            }
        },
        move(iterator) {
            //拍照，保存在before中
            let before = String(this.data)
            iterator()//this->game
            let after = String(this.data)
            //给data拍照，保存在after中
            if (before != after) {
                this.state = this.PLAYING
                animation.start(() => {
                    this.randomNum();
                    //如果游戏结束
                    if (this.isGameOver() == true) {
                        this.state = this.GAMEOVER
                        //如果当前的分大于最高分
                        if (this.score > this.topScore) {
                            //向cookie中写入最高分
                            setCookie("topScore", this.score, new Date("2099/1/1"))
                        }
                    }
                    this.updataView();
                    this.state = this.RUNNING;
                })
            }
        },

        //左移所有行
        moveLeft() {
            this.move(() => {
                for (let r = 0; r < this.RN; r++) {
                    this.moveLeftInRow(r);
                }
            })
        },

        //左移第r行
        moveLeftInRow(r) {
            for (let c = 0; c < this.CN - 1; c++) {
                let nextc = this.getRightNext(r, c)
                if (nextc == -1) { break; }
                else {
                    if (this.data[r][c] == 0) {
                        this.data[r][c] = this.data[r][nextc]
                        this.data[r][nextc] = 0
                        animation.addTask(r, nextc, c - nextc, 0)
                        c--
                    }
                    else {
                        if (this.data[r][c] == this.data[r][nextc]) {
                            this.data[r][c] *= 2
                            this.data[r][nextc] = 0
                            this.score += this.data[r][c]
                            animation.addTask(r, nextc, c - nextc, 0)
                        }
                    }
                }

            }
        },

        //专门找当前位置右侧下一个
        getRightNext(r, c) {
            for (let nextc = c + 1; nextc < this.CN; nextc++) {
                if (this.data[r][nextc] != 0) {
                    return nextc;
                }
            }
            return -1;
        },

        //右移所有行
        moveRight() {
            this.move(() => {
                for (let r = 0; r < this.RN; r++) {
                    this.moveRightInRow(r)
                }
            })
        },

        //右移第r行
        moveRightInRow(r) {
            for (let c = this.CN - 1; c > 0; c--) {
                let prevc = this.getPrevInRow(r, c)
                if (prevc == -1) { break; }
                else {
                    if (this.data[r][c] == 0) {
                        this.data[r][c] = this.data[r][prevc]
                        this.data[r][prevc] = 0
                        animation.addTask(r, prevc, c - prevc, 0)
                        c++
                    } else if (this.data[r][c] == this.data[r][prevc]) {
                        this.data[r][c] *= 2
                        this.data[r][prevc] = 0
                        this.score += this.data[r][c]
                        animation.addTask(r, prevc, c - prevc, 0)
                    }
                }
            }
        },
        getPrevInRow(r, c) {
            for (let prevc = c - 1; prevc >= 0; prevc--) {
                if (this.data[r][prevc] != 0) {
                    return prevc
                }
            }
            return -1
        },

        //上移所有列
        moveUp() {
            this.move(() => {
                for (let c = 0; c < this.CN; c++) {
                    this.moveUpInCol(c);
                }
            })
        },

        //上移第c列
        moveUpInCol(c) {
            for (let r = 0; r < this.RN - 1; r++) {
                let nextr = this.getNextInCol(r, c)
                if (nextr == -1) { break; }
                else {
                    if (this.data[r][c] == 0) {
                        this.data[r][c] = this.data[nextr][c]
                        this.data[nextr][c] = 0
                        animation.addTask(nextr, c, 0, r - nextr)
                        r--
                    } else if (this.data[r][c] == this.data[nextr][c]) {
                        this.data[r][c] *= 2
                        this.data[nextr][c] = 0
                        this.score += this.data[r][c]
                        animation.addTask(nextr, c, 0, r - nextr)
                    }
                }
            }
        },
        getNextInCol(r, c) {
            for (let nextr = r + 1; nextr < this.RN; nextr++) {
                if (this.data[nextr][c] != 0) {
                    return nextr
                }
            }
            return -1
        },

        //下移所有列
        moveDown() {
            this.move(() => {
                for (var c = 0; c < this.CN; c++) {
                    this.moveDownInCol(c)
                }
            })
        },

        //下移第c列
        moveDownInCol(c) {
            for (let r = this.RN - 1; r > 0; r--) {
                let prevr = this.getPrevInCol(r, c)
                if (prevr == -1) { break; }
                else {
                    if (this.data[r][c] == 0) {
                        this.data[r][c] = this.data[prevr][c]
                        this.data[prevr][c] = 0
                        animation.addTask(prevr, c, 0, r - prevr);
                        r++
                    } else if (this.data[r][c] == this.data[prevr][c]) {
                        this.data[r][c] *= 2
                        this.data[prevr][c] = 0
                        this.score += this.data[r][c]
                        animation.addTask(prevr, c, 0, r - prevr)
                    }
                }
            }
        },
        getPrevInCol(r, c) {
            for (let prevr = r - 1; prevr >= 0; prevr--) {
                if (this.data[prevr][c] != 0) {
                    return prevr
                }
            }
            return -1
        },
    }

    module.exports = game
})
/**
 * 设置cookie
 */
const setCookie = (name, value, expires) => {
    document.cookie = `${name}=${value};expires=${expires.toGMTString()}`
}

/**
 * 获取cookie
 */
const getCookie = (name) => {
    let cookies = document.cookie
    let namei = cookies.indexOf(name)
    if (namei != -1) {
        let starti = namei + name.length + 1
        let spi = cookies.indexOf(";", starti)
        let value = spi != -1 ? cookies.slice(starti, spi) : cookies.slice(starti)
        return value
    } else {
        return ""
    }
}


