const path=require("path")
const ExtractTextPlugin=require("extract-text-webpack-plugin")//抽离css文件，这个一般只在生产环境就好，开发环境想干嘛就干嘛，不需要给自己太多的东西，
const HtmlWebpackPlugin=require("html-webpack-plugin")//抽离html 到目标文件
module.exports={
    //entry,可以是字符串(一个入口)，可以是数组（多入口），可以是对象的形式
    // entry:["./src/main.js","./src/app.js"],
    entry:{
        // 'app':"./src/main.js",
        'scripts／app':"./src/main.js",//入口文件可以加路径，暂时这个我还没有明白是什么意思？？？？
        'app2':"./src/index.js"//路径是以当前项目最外层文件的路径为基准

    },
    output:{
        // mode:"development",//哪一个环境
        
        path:path.resolve(__dirname,'../dist'),//路径是以当前文件的路径为基准
        filename:"[name]_[hash].js",//[key的名字（此处是app，app1），当作打包之后的名字][hash（版本号）v，根据内容编译的，要是内容没有变的话，版本号不变]
    }, 
    module:{
        rules:[
            {//样式的处理
                test:/\.(css|scss)$/,
                //use:['style-loader','css-loader','sass-loader'],
                //顺序需要注意，style-loader需要 放到前面，（style-loader 是把样式抽离放到html中，css-loader,是把样式放到js文件中，）不然没有效果
                //sass-loader先把scss文件编译成css，然后css-loader把css文件编译成js文件，然后style-loader把js文件中的css部分提取出来放到header中 
                use:ExtractTextPlugin.extract({
                    fallback:'style-loader',
                    use:['css-loader','sass-loader']

                })
            },
            {//图片的处理
                test:/\.(jpg|jpeg|png|gif)$/i,
                use:[
                    {
                        loader:'url-loader',
                        options:{
                            limit:5000,
                            outputPath:'img/'
                        }
                    }
                ]
            },
            {
                test:/\.js$/,
                use:{
                    loader:'babel-loader',
                    options:{
                        presets:[
                            "env","react"
                        ]
                    }
                },
                exclude:/node_modules/   //排除
            }

        ]
    },
    plugins:[
        //抽离css情况一：写死文件名字
        //new ExtractTextPlugin("styles/styles.css")//抽离成styles.css文件放到styles文件夹中
        //抽离css情况二：根据入口文件名字，生产成对应的css名字
        new ExtractTextPlugin({
            filename:(getPath)=>{
                //styles/[name]_[hash:6].css也是加版本号，：6代表把版本号限制为6位数
                return getPath('styles/[name]_[hash:6].css').replace('styles/scripts','styles')
            },
            allChunks:true
        }),
        new HtmlWebpackPlugin({
            //这两个可以不写，不写的话用默认的，要是需要改的话，可以在下面进行修改
            template:'./src/index.html',//被编译的路径文件，可以是各种模版的，比如可以是ejs
            filename:'./dist/index.html'//编译之后的路径已经名字
        })
    ]
}
/**
 * 1.webpack最主要的部分有：entry，output，loader，插件plugin 
 * 2.webpack4,直接就做好了热更新
 * 3.把样式抽离成一个单独的文件  ExtractTextPlugin
 * 4.entry的路径和output的路径的根据点不一样
 * 
 */