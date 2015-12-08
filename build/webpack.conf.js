var Webpack = require('webpack'),
    conf = require('./conf.js'),
    path = require('path');

var webpackConf = {
    entry: {
        app: [conf.files.clientEntryJs],
        vendor: conf.clientVendorPackages
    },
    output: {
        publicPath: '/scripts/',
        path: path.resolve(conf.paths.distBase, 'scripts'),
        filename: conf.files.clientAppBundleName
    },

    cache: conf.devMode,
    debug: conf.devMode,
    devtool: conf.devMode ? 'source-map' : false,
    stats: {
        colors: true,
        reasons: conf.devMode
    },

    resolve: {
        extensions: ['', '.js']
    },

    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel'
        }, {
            test: /\.json$/,
            exclude: /node_modules/,
            loader: 'json'
        }]
    },
    plugins: [
        new Webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"' + conf.env + '"'
            },
            '__USE_MOCKS__': conf.useMocks,
            '__SERVER_PORT__': conf.serverPort
        }),
        new Webpack.optimize.CommonsChunkPlugin('vendor', conf.files.clientVendorBundleName),
        new Webpack.optimize.OccurenceOrderPlugin()
    ]
};

if (conf.devMode) {
    // Add hot reloading
    var hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';
    webpackConf.entry.app.unshift(hotMiddlewareScript);
    webpackConf.entry.vendor.unshift(hotMiddlewareScript);
    webpackConf.plugins.push(new Webpack.HotModuleReplacementPlugin(), new Webpack.NoErrorsPlugin());
    webpackConf.module.loaders[0].query = {
        plugins: ['react-transform'],
        extra: {
            'react-transform': {
                transforms: [{
                    transform: 'react-transform-hmr',
                    imports: ['react'],
                    locals: ['module']
                }]
            }
        }
    };
}

if (conf.optimize) {
    webpackConf.plugins.push(
        new Webpack.optimize.DedupePlugin(),
        new Webpack.optimize.AggressiveMergingPlugin(),
        new Webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false
            }
        })
    );
}

module.exports = webpackConf;
