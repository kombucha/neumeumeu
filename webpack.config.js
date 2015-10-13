var path = require('path');

module.exports = {
    entry: [
        'webpack-dev-server/client?http://localhost:8080',
        path.join(__dirname, 'src', 'scripts', 'index.js')
    ],
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel'
        }, {
            test: /\.css$/,
            loader: 'style!css!autoprefixer?browsers=last 2 versions'
        }, {
            test: /\.json$/,
            loader: 'json'
        }]
    },
    resolve: {
        extensions: ['', '.js']
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: './dist',
        hot: false
    },
    devtool: 'eval-source-map'
};
