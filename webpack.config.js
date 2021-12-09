const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin"); // css压缩

process.env.NODE_ENV = "development"
const commoncssloader = [
    MiniCssExtractPlugin.loader, 
    'css-loader',
    {
        loader: 'postcss-loader',
        options: {
            postcssOptions: {
                plugins: [
                  require('autoprefixer')({
                    "overrideBrowserslist": [
                      "> 1%",
                      "last 7 versions",
                      "not ie <= 8",
                      "ios >= 8",
                      "android >= 4.0"
                    ]
                  })
                ]
              }
        }
    }
]

module.exports = {
    entry: './index.js', 
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        // 编译css image等资源
        rules: [
            {
                test: /\.css$/,
                use: [...commoncssloader]
            },
            {
                test: /\.less$/,
                use: [
                    ...commoncssloader,
                    'less-loader'
                ]
            },
            // 处理图片
            {
                test: /\.(png|jpg|gif)$/,
                type: 'asset/resource'
    
            },
            {
                exclude: /\.(css|js|html)$/,
                type: 'asset',
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    // 'react-loader-spinner',
                    // 'react-loader',
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                [
                                    '@babel/preset-react',
                                    {
                                        useBuiltIns: 'usage',
                                        corejs: {
                                            version: 3
                                        },
                                        targets: {
                                            chrome: '60',
                                            firefox: '60',
                                            ie: '9',
                                            safari: '10',
                                            edge: '17'
                                        }
                                    },
                                    '@babel/preset-typescript',
                                    
                                    
                                ]
                            ],
                            plugins: [
                                "react-hot-loader/babel"
                            ]

                        }
                    }
                    
                ]
            },
        ] 
        
    },
    optimization: {
        minimizer: [
          new CssMinimizerPlugin(),
        ],
      },
    // 插件
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            title: 'webpack笔记',
            // html压缩
            minify: {
                // 移除空格
                collapseWhitespace: true,
                // 移除注释
                removeComments: true,
            }
        }),
        // 本插件会将css提取到单独的文件中，为每个包含css的js文件创建一个css文件，并且支持css和sourceMaps的按需加载 
        new MiniCssExtractPlugin({
            filename: 'css/build.css'
        })
        
    ],
    // 当mode为生产模式时,压缩js
    // mode: 'production',
    mode: 'development',
    devtool: 'source-map',
    // 开发服务器devSever用来自动化，特点：只会在内存中编译打包，不会有任何输出
    devServer: {
        static: {
            // 项目构建后路径
            directory: path.join(__dirname, 'dist'),
        },
        // 启动gzip压缩
        compress: true,
        port: 5000,
        open: true,
        hot: true
    }

}