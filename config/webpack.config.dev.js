const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")//抽离html 到目标文件
const webpack = require("webpack")

module.exports = {
    //entry,可以是字符串(一个入口)，可以是数组（多入口），可以是对象的形式
    // entry:["./src/main.js","./src/app.js"],
    entry: {
        'app': "./src/index.js",
        // 'scripts／app': "./src/main.js",//入口文件可以加路径，暂时这个我还没有明白是什么意思？？？？
        // 'app2': "./src/index.js",
        //'vendor/react':"react",//抽离第三方库的入口
        //'vendor/react-dom':"react-dom",//抽离第三方库的入口


    },
    output: {
        // mode:"development",//哪一个环境

        path: path.resolve(__dirname, '../dev'),
        filename: "[name].js",//[key的名字（此处是app，app1），当作打包之后的名字]
    },
    devServer: {
        contentBase: path.resolve(__dirname, '../dev'),//设置基本目录结构
        host: "localhost",//服务器端ip，可以写电脑ip，也可以写成localhost
        compress: true,//服务器端压缩是否开启
        port: 8999,//配置端口号
        // quit:false,//不打印异常信息
        clientLogLevel: "warning",//定义控制台日志
    },
    module: {
        rules: [
            {//样式的处理
                test: /\.(css|scss)$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
                //顺序需要注意，style-loader需要 放到前面，（style-loader 是把样式抽离放到html中，css-loader,是把样式放到js文件中，）不然没有效果
                //sass-loader先把scss文件编译成css，然后css-loader把css文件编译成js文件，然后style-loader把js文件中的css部分提取出来放到header中 

            },
            {//图片的处理
                test: /\.(jpg|jpeg|png|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 5000,
                            outputPath: 'img/'
                        }
                    }
                ]
            },
            // {//react的处理
            //     test:/\.jsx?$/,
            //     use:{
            //         loader:'babel-loader',
            //         options:{
            //             presets:[
            //                 "env","react"
            //             ]
            //         }
            //     },
            //     exclude:/node_modules/   //排除
            // }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        }),
        // 提供全局变量包
        new webpack.ProvidePlugin({
            _: 'lodash',
            IMU: 'immutable',
            moment: 'moment'
        }),

    ],
    // optimization:{//抽离第三方库，现在以抽离react库和react-dom为例
    //     splitChunks:{
    //         cacheGroups:{
    //             react:{//vendor/react
    //                 test:/react/,
    //                 chunks:'initial',
    //                 name:'vendor/react',//打包到这个路径下面，名字为react
    //                 priority:10//优先级
    //             },
    //             'react-dom':{//vendor/react-dom
    //                 test:/react-dom/,
    //                 chunks:'initial',
    //                 name:'vendor/react-dom',//打包到这个路径下面，名字为react-dom
    //                 priority:10//优先级
    //             }
    //         }
    //     }

    // }
}
/**
 * 1.webpack最主要的部分有：entry，output，loader，插件plugin
 * 2.webpack4,直接就做好了热更新
 * 3.把样式抽离成一个单独的文件  ExtractTextPlugin
 *
 */