define((require, exports, module) => {
    const game = require('./main')

    //页面加载后，启动游戏
    window.onload = () => {
        game.start();
        btnGameStart.onclick = () => {
            game.start()
        };

    }
})