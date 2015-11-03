var Webpack = require('webpack'),
    conf = require('./conf.js');


var webpackConf = {
    entry: {
        app: conf.files.clientEntryJs,
        vendor: conf.clientVendorPackages
    },
    output: {
        path: conf.paths.distScripts,
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
            loader: 'babel?plugins[]=react-require'
        }, {
            test: /\.json$/,
            exclude: /node_modules/,
            loader: 'json'
        }]
    },
    plugins: [
        new Webpack.optimize.CommonsChunkPlugin('vendor', conf.files.clientVendorBundleName)
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
