'use strict';

define(function (require, exports, module) {

    var animation = require('./animation');

    var game = {

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
        init: function init() {
            // 向arr中压入：""+r+c
            var arr = [];
            for (var r = 0; r < this.RN; r++) {
                for (var c = 0; c < this.CN; c++) {
                    arr.push("" + r + c);
                }
            }
            var strGrid = '<div id="' + arr.join('" class="grid"></div><div id="g') + '" class="grid"></div>'; //背景格
            var strCell = '<div id="c' + arr.join('" class="cell"></div><div id="c') + '" class="cell"></div>'; //前景格
            //设置id为gridPanel的内容为strGrid+strCell
            gridPanel.innerHTML = strGrid + strCell;
            //计算gridPanel的宽
            var width = this.CN * (this.CSIZE + this.MARGIN) + this.MARGIN + 'px';
            var height = this.RN * (this.CSIZE + this.MARGIN) + this.MARGIN + 'px';
            //设置gridPanel的宽和高
            gridPanel.style.width = width;
            gridPanel.style.height = height;
        },
        start: function start() {
            var _this = this;

            //动态生成gridPanel中的div
            this.init();

            this.state = this.RUNNING;

            //从cookies中读取最高分
            this.topScore = getCookie("topScore");

            this.topScore == "" && (this.topScore = 0);

            //分数归零
            this.score = 0;

            //初始化空数组
            this.data = [];
            for (var r = 0; r < this.RN; r++) {
                this.data[r] = [];
                for (var c = 0; c < this.CN; c++) {
                    this.data[r][c] = 0;
                }
            }
            /*随机生成2个2或4*/
            this.randomNum();
            this.randomNum();

            //将data的数据，更新到界面div
            this.updataView();
            //console.log(this.data.join("\n"));
            document.onkeydown = function (e) {
                //console.log(this);
                if (_this.state == _this.RUNNING) {
                    switch (e.keyCode) {
                        case 37:
                            _this.moveLeft();
                            break;
                        case 38:
                            _this.moveUp();
                            break;
                        case 39:
                            _this.moveRight();
                            break;
                        case 40:
                            _this.moveDown();
                            break;
                    }
                }
            };
        },


        //判断游戏是否结束
        isGameOver: function isGameOver() {
            for (var r = 0; r < this.RN; r++) {
                for (var c = 0; c < this.CN; c++) {
                    if (this.data[r][c] == 0) {
                        return false;
                    } else if (c < this.CN - 1 && this.data[r][c] == this.data[r][c + 1]) {
                        return false;
                    } else if (r < this.RN - 1 && this.data[r][c] == this.data[r + 1][c]) {
                        return false;
                    }
                }
            }
            return true;
        },


        /*在随机的空白位置生成一个2或4*/
        randomNum: function randomNum() {
            // if (!this.isFull()) {
            while (true) {
                var r = parseInt(Math.random() * this.RN);
                var c = parseInt(Math.random() * this.CN);
                //console.log(r,c);
                if (this.data[r][c] == 0) {
                    this.data[r][c] = Math.random() > 0.5 ? 4 : 2;
                    break;
                }
            }
            // }
        },


        //判断数组是否已满
        isFull: function isFull() {
            for (var r = 0; r < this.data.length; r++) {
                for (var c = 0; c < this.data[r].length; c++) {
                    if (this.data[r][c] == 0) {
                        return false;
                    }
                }
            }
            return true;
        },
        updataView: function updataView() {
            topScore.innerHTML = this.topScore;
            for (var r = 0; r < this.RN; r++) {
                for (var c = 0; c < this.CN; c++) {
                    var div = document.getElementById('c' + r + c);
                    if (this.data[r][c] != 0) {
                        div.innerHTML = this.data[r][c];
                        div.className = "cell n" + this.data[r][c];
                    } else {
                        div.innerHTML = "";
                        div.className = "cell";
                    }
                }
            }
            score.innerHTML = this.score;
            //如果游戏的状态是GAMEOVER
            if (this.state == this.GAMEOVER) {
                finalScore.innerHTML = this.score;
                gameOver.style.display = "block";
            } else {
                gameOver.style.display = "none";
            }
        },
        move: function move(iterator) {
            var _this2 = this;

            //拍照，保存在before中
            var before = String(this.data);
            iterator(); //this->game
            var after = String(this.data);
            //给data拍照，保存在after中
            if (before != after) {
                this.state = this.PLAYING;
                animation.start(function () {
                    _this2.randomNum();
                    //如果游戏结束
                    if (_this2.isGameOver() == true) {
                        _this2.state = _this2.GAMEOVER;
                        //如果当前的分大于最高分
                        if (_this2.score > _this2.topScore) {
                            //向cookie中写入最高分
                            setCookie("topScore", _this2.score, new Date("2099/1/1"));
                        }
                    }
                    _this2.updataView();
                    _this2.state = _this2.RUNNING;
                });
            }
        },


        //左移所有行
        moveLeft: function moveLeft() {
            var _this3 = this;

            this.move(function () {
                for (var r = 0; r < _this3.RN; r++) {
                    _this3.moveLeftInRow(r);
                }
            });
        },


        //左移第r行
        moveLeftInRow: function moveLeftInRow(r) {
            for (var c = 0; c < this.CN - 1; c++) {
                var nextc = this.getRightNext(r, c);
                if (nextc == -1) {
                    break;
                } else {
                    if (this.data[r][c] == 0) {
                        this.data[r][c] = this.data[r][nextc];
                        this.data[r][nextc] = 0;
                        animation.addTask(r, nextc, c - nextc, 0);
                        c--;
                    } else {
                        if (this.data[r][c] == this.data[r][nextc]) {
                            this.data[r][c] *= 2;
                            this.data[r][nextc] = 0;
                            this.score += this.data[r][c];
                            animation.addTask(r, nextc, c - nextc, 0);
                        }
                    }
                }
            }
        },


        //专门找当前位置右侧下一个
        getRightNext: function getRightNext(r, c) {
            for (var nextc = c + 1; nextc < this.CN; nextc++) {
                if (this.data[r][nextc] != 0) {
                    return nextc;
                }
            }
            return -1;
        },


        //右移所有行
        moveRight: function moveRight() {
            var _this4 = this;

            this.move(function () {
                for (var r = 0; r < _this4.RN; r++) {
                    _this4.moveRightInRow(r);
                }
            });
        },


        //右移第r行
        moveRightInRow: function moveRightInRow(r) {
            for (var c = this.CN - 1; c > 0; c--) {
                var prevc = this.getPrevInRow(r, c);
                if (prevc == -1) {
                    break;
                } else {
                    if (this.data[r][c] == 0) {
                        this.data[r][c] = this.data[r][prevc];
                        this.data[r][prevc] = 0;
                        animation.addTask(r, prevc, c - prevc, 0);
                        c++;
                    } else if (this.data[r][c] == this.data[r][prevc]) {
                        this.data[r][c] *= 2;
                        this.data[r][prevc] = 0;
                        this.score += this.data[r][c];
                        animation.addTask(r, prevc, c - prevc, 0);
                    }
                }
            }
        },
        getPrevInRow: function getPrevInRow(r, c) {
            for (var prevc = c - 1; prevc >= 0; prevc--) {
                if (this.data[r][prevc] != 0) {
                    return prevc;
                }
            }
            return -1;
        },


        //上移所有列
        moveUp: function moveUp() {
            var _this5 = this;

            this.move(function () {
                for (var c = 0; c < _this5.CN; c++) {
                    _this5.moveUpInCol(c);
                }
            });
        },


        //上移第c列
        moveUpInCol: function moveUpInCol(c) {
            for (var r = 0; r < this.RN - 1; r++) {
                var nextr = this.getNextInCol(r, c);
                if (nextr == -1) {
                    break;
                } else {
                    if (this.data[r][c] == 0) {
                        this.data[r][c] = this.data[nextr][c];
                        this.data[nextr][c] = 0;
                        animation.addTask(nextr, c, 0, r - nextr);
                        r--;
                    } else if (this.data[r][c] == this.data[nextr][c]) {
                        this.data[r][c] *= 2;
                        this.data[nextr][c] = 0;
                        this.score += this.data[r][c];
                        animation.addTask(nextr, c, 0, r - nextr);
                    }
                }
            }
        },
        getNextInCol: function getNextInCol(r, c) {
            for (var nextr = r + 1; nextr < this.RN; nextr++) {
                if (this.data[nextr][c] != 0) {
                    return nextr;
                }
            }
            return -1;
        },


        //下移所有列
        moveDown: function moveDown() {
            var _this6 = this;

            this.move(function () {
                for (var c = 0; c < _this6.CN; c++) {
                    _this6.moveDownInCol(c);
                }
            });
        },


        //下移第c列
        moveDownInCol: function moveDownInCol(c) {
            for (var r = this.RN - 1; r > 0; r--) {
                var prevr = this.getPrevInCol(r, c);
                if (prevr == -1) {
                    break;
                } else {
                    if (this.data[r][c] == 0) {
                        this.data[r][c] = this.data[prevr][c];
                        this.data[prevr][c] = 0;
                        animation.addTask(prevr, c, 0, r - prevr);
                        r++;
                    } else if (this.data[r][c] == this.data[prevr][c]) {
                        this.data[r][c] *= 2;
                        this.data[prevr][c] = 0;
                        this.score += this.data[r][c];
                        animation.addTask(prevr, c, 0, r - prevr);
                    }
                }
            }
        },
        getPrevInCol: function getPrevInCol(r, c) {
            for (var prevr = r - 1; prevr >= 0; prevr--) {
                if (this.data[prevr][c] != 0) {
                    return prevr;
                }
            }
            return -1;
        }
    };

    module.exports = game;
});
/**
 * 设置cookie
 */
var setCookie = function setCookie(name, value, expires) {
    document.cookie = name + '=' + value + ';expires=' + expires.toGMTString();
};

/**
 * 获取cookie
 */
var getCookie = function getCookie(name) {
    var cookies = document.cookie;
    var namei = cookies.indexOf(name);
    if (namei != -1) {
        var starti = namei + name.length + 1;
        var spi = cookies.indexOf(";", starti);
        var value = spi != -1 ? cookies.slice(starti, spi) : cookies.slice(starti);
        return value;
    } else {
        return "";
    }
};