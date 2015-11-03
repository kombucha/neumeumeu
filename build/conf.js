var args = require('yargs').argv,
    path = require('path'),
    gUtil = require('gulp-util');

var env = args.env || 'mock',
    pkg = require('../package.json'),
    paths = {
        srcBase: 'src',
        clientIndex: 'src/client/index.html',
        clientJsBase: 'src/client/scripts',
        commonJsBase: 'src/common',
        serverJsBase: 'src/server',
        clientStylesBase: 'src/client/styles',
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

        testSpecsJs: path.join(paths.testBase, 'spec', '**', '*.js'),
        testHelperJs: path.resolve(path.join(paths.testBase, 'helpers', 'index.js'))
    };

module.exports = {
    pkg: pkg,
    // FIXME: If package.json is shared between client and server, we'll have to specify vendors manually
    clientVendorPackages: Object.keys(pkg.dependencies),
    paths: paths,
    files: files,
    env: env,
    codeStyle: !!args.strict,
    optimize: args.hasOwnProperty('optimize') ? args.optimize : (['preprod', 'prod'].indexOf(env) >= 0 || false),
    devMode: args._.indexOf('dev') >= 0,
    plumber: {
        errorHandler: process.argv.indexOf('dev') > -1 ? function(err) {
            gUtil.log(err);
            this.emit('end');
        } : false
    }
};
