var browserSync = require('browser-sync'),
    webpack = require('webpack'),
    webpackDevMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware'),
    buildConf = require('./conf'),
    webpackConf = require('./webpack.conf'),
    path = require('path');

function startServer() {
    var compiler = webpack(webpackConf),
        devMiddleware = webpackDevMiddleware(compiler, {
            noInfo: true,
            publicPath: webpackConf.output.publicPath
        }),
        hotMiddleware = webpackHotMiddleware(compiler, {
            log: console.log,
            path: '/__webpack_hmr',
            heartbeat: 10 * 1000
        });

    browserSync({
        files: path.join(buildConf.paths.distBase, '**'),
        watchOptions: {
            interval: 500
        },
        reloadDebounce: 1000,
        proxy: {
            target: 'localhost:8000',
            middleware: [
                devMiddleware,
                hotMiddleware
            ]
        },
        ghostMode: false,
        online: false,
        notify: false
    });
}

module.exports = startServer;
