define((require, exports, module) => {
    const game = require('./2048')

    //页面加载后，启动游戏
    window.onload = () => {
        game.start();
        btnGameStart.onclick = () => {
            game.start()
        };

    }
})