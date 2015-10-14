var gulp = require('gulp'),
    GulpUtil = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
    plumber = require('gulp-plumber'),
    gIf = require('gulp-if'),

    buildConf = require('./build/conf.js'),
    webpackConf = require('./build/webpack.conf.js'),

    webpack = require('webpack'),
    mocha = require('gulp-mocha'),
    eslint = require('gulp-eslint'),

    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCss = require('gulp-minify-css'),

    runSequence = require('run-sequence'),
    browserSync = require('browser-sync'),
    del = require('del'),
    path = require('path');

gulp.task('scripts', ['lint'], function(callback) {
    var webpackCallback = function(err, stats) {
            GulpUtil.log('webpack', 'BUILD OK');

            if (stats.hasErrors()) {
                throw new GulpUtil.PluginError('webpack:build', stats.toString({
                    colors: true
                }));
            }

            if (!callback._called) {
                callback(err);
                callback._called = true;
            }
        },
        compiler;

    compiler = webpack(webpackConf);
    if (buildConf.devMode) {
        compiler.watch(300, webpackCallback);
    } else {
        compiler.run(webpackCallback);
    }
});

gulp.task('lint', function() {
    return gulp.src(path.join(buildConf.paths.srcBase, 'scripts', '**', '*.js'))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(gIf(!buildConf.devMode, eslint.failOnError()));
});

gulp.task('test', function() {
    return gulp.src('test/spec/**/*.js')
        .pipe(require('gulp-debug')())
        .pipe(mocha({
            require: [
                'babel-core/register-without-polyfill',
                path.resolve('./test/helpers/index.js')
            ]
        }));
});

gulp.task('styles', function() {
    return gulp.src(path.join(buildConf.paths.srcBase, 'styles', 'main.less'))
        .pipe(plumber(buildConf.plumber))
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['ie >= 9', 'last 2 versions']
        }))
        .pipe(gIf(buildConf.optimize, minifyCss()))
        .pipe(gIf(buildConf.devMode, sourcemaps.write()))
        .pipe(gulp.dest(path.join(buildConf.paths.distBase, 'styles')));
});

gulp.task('assets', function() {
    return gulp.src([
        path.join(buildConf.paths.srcBase, 'assets/**'),
        path.join(buildConf.paths.srcBase, '*.html')
    ])
    .pipe(gulp.dest(buildConf.paths.distBase));
});

gulp.task('serve', ['build'], function() {
    browserSync({
        files: path.join(buildConf.paths.distBase, '**'),
        watchOptions: {
            interval: 500
        },
        reloadDebounce: 1000,

        server: {
            baseDir: buildConf.paths.distBase
        },
        online: false,
        notify: false
    });
});

gulp.task('watch', function() {
    // Script watch/rebuild is handled directly by webpack
    gulp.watch(path.join(buildConf.paths.srcBase, '**', '*.js'), ['lint']);
    gulp.watch(path.join(buildConf.paths.srcBase, '**', '*.less'), ['styles']);
    gulp.watch([
        path.join(buildConf.paths.srcBase, 'assets', '**'),
        path.join(buildConf.paths.srcBase, '**', '*.html')
    ], ['assets']);
});

gulp.task('clean', function() {
    return del([buildConf.paths.distBase], {
        force: true
    });
});

gulp.task('build', function(cb) {
    return runSequence('clean', ['scripts', 'styles', 'assets'], cb);
});

gulp.task('dev', function(cb) {
    return runSequence(['serve', 'watch'], cb);
});

gulp.task('default', ['build']);
