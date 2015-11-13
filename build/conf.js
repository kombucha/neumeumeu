var args = require('yargs').argv,
    path = require('path'),
    gUtil = require('gulp-util');

var env = args.env || 'development',
    pkg = require('../package.json'),
    isDevMode = args._.indexOf('dev') >= 0,
    paths = {
        srcBase: 'src',
        clientIndex: 'src/client/index.html',
        clientJsBase: 'src/client/scripts',
        commonJsBase: 'src/common',
        serverJsBase: 'src/server',
        clientStylesBase: 'src/client/styles',
        clientAssetsBase: 'src/client/assets',
        testBase: 'test',
        distBase: 'dist',
        distScripts: 'dist/scripts'
    },
    files = {
        allJs: path.join(paths.srcBase, '**', '*.js'),

        clientEntryJs: path.resolve(path.join(paths.clientJsBase, 'index.js')),
        clientJs: [
            path.join(paths.clientJsBase, '**', '*.js'),
            path.join(paths.commonJsBase, '**', '*.js')
        ],
        clientAppBundleName: 'app.js',
        clientVendorBundleName: 'vendor.js',
        clientEntryStyles: path.join(paths.clientStylesBase, 'main.less'),
        clientStyles: path.join(paths.clientStylesBase, '**', '*.less'),

        testSpecsJs: path.join(paths.testBase, 'spec', '**', '*.js')
    };

module.exports = {
    pkg: pkg,
    clientVendorPackages: [
        'react',
        'react-dom',
        'react-router',
        'react-addons-shallow-compare',
        'react-redux',
        'redux',
        'redux-simple-router',
        'redux-thunk',
        'history',
        'classnames',
        'socket.io-client'
    ],
    paths: paths,
    files: files,
    env: env,
    codeStyle: args.hasOwnProperty('codeStyle') ? !!args.codeStyle : !isDevMode,
    optimize: args.hasOwnProperty('optimize') ? args.optimize : (env === 'production' || false),
    devMode: isDevMode,
    plumber: {
        errorHandler: isDevMode ? function(err) {
            gUtil.log(err);
            this.emit('end');
        } : false
    }
};
