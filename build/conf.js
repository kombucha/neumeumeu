var args = require('yargs').argv,
    gUtil = require('gulp-util');

var env = args.env || 'mock';

module.exports = {
    pkg: require('../package.json'),
    paths: {
        srcBase: 'src',
        distBase: 'dist'
    },
    env: env,
    codeStyle: !!args.strict,
    optimize: args.hasOwnProperty('optimize') ? args.optimize : (['preprod', 'prod'].indexOf(env) >= 0 || false),
    devMode: args._.indexOf('dev') >= 0,
    plumber: {
        errorHandler: process.argv.indexOf('dev') > -1 ? function (err) {
            gUtil.log(err);
            this.emit('end');
        } : false
    }
};
