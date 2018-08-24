'use strict';

define(function (require, exports, module) {
    var game = require('./main');

    //页面加载后，启动游戏
    window.onload = function () {
        game.start();
        btnGameStart.onclick = function () {
            game.start();
        };
    };
});