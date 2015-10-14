var Webpack = require('webpack'),
    conf = require('./conf.js');

var webpackConf = {
    entry: {
        app: process.cwd() + '/src/client/scripts/index.js',
        // FIXME: If package.json is shared between client and server, we'll have to specify vendors manually
        vendor: Object.keys(conf.pkg.dependencies)
    },
    output: {
        path: 'dist/scripts/',
        filename: 'app.js'
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
        }]
    },
    plugins: [
        new Webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js')
    ]
};

if (conf.optimize) {
    webpackConf.plugins = webpackConf.plugins.concat([
        new Webpack.optimize.DedupePlugin(),
        new Webpack.optimize.OccurenceOrderPlugin(),
        new Webpack.optimize.AggressiveMergingPlugin(),
        new Webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false
            }
        })
    ]);
}

module.exports = webpackConf;
