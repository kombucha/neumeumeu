var browserSync = require('browser-sync'),
    webpack = require('webpack'),
    webpackDevMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware'),
    history = require('connect-history-api-fallback'),
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
        server: {
            baseDir: buildConf.paths.distBase,
            middleware: [
                devMiddleware,
                hotMiddleware,
                history()
            ]
        },
        online: false,
        notify: false
    });
}

module.exports = startServer;
