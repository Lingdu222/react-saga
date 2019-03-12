const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const eslintFormatter = require('eslint-friendly-formatter');
const { resolve, getLessVariables } = require('./utils');

module.exports = {
    context: resolve(''),
    entry: {
        app: './src/index.js'
    },
    output: {
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js',
        path: '/',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: [resolve('src')],
                options: {
                    // formatter: eslintFormatter,
                    emitWarning: true
                }
            },
            {
                test: /\.jsx?$/,
                include: [
                    resolve('src'),
                    resolve('node_modules/@didi')
                ],
                use: 'babel-loader'
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                include: [
                    resolve('src'),
                    resolve('node_modules/@didi')
                ],
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            modifyVars: getLessVariables(resolve('src/theme.less'))
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    name: '[name].[ext]',
                    limit: 10000
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            SAGA: resolve('src/store/saga/utils'),
            HELP: resolve('src/helpers'),
            CONST: resolve('src/constants'),
            CC: resolve('src/components'),
            '@': resolve('src')
        }
    },
    plugins: [
        // 提供全局变量包
        new webpack.ProvidePlugin({
            _: 'lodash',
            IMU: 'immutable',
            moment: 'moment'
        }),
        // 压缩css
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        })
    ],
    // 从输出的 bundle 中排除以下依赖
    externals: {
        AMap: 'AMap',
        AMapUI: 'AMapUI'
    }
};
