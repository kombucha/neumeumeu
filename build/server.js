var browserSync = require('browser-sync'),
    webpack = require('webpack'),
    webpackDevMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware'),
    historyMiddleware = require('connect-history-api-fallback'),
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
        }),
        bsServer = browserSync.create(),
        bsConf = {
            files: path.join(buildConf.paths.distBase, '**'),
            watchOptions: {
                interval: 500
            },
            reloadDebounce: 1000,
            ghostMode: false,
            online: false,
            notify: false
        };

    if (buildConf.useMocks) {
        bsConf.server = {
            baseDir: buildConf.paths.distBase,
            middleware: [
                devMiddleware,
                hotMiddleware,
                historyMiddleware()
            ]
        };
    } else {
        bsConf.proxy = {
            target: 'localhost:8000',
            middleware: [
                devMiddleware,
                hotMiddleware,
                history()
            ]
        };
    }

    bsServer.init(bsConf);

    return bsServer;
}

module.exports = startServer;
