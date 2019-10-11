const path = require('path')
const fs = require('fs')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = env => {

    // 构建环境变量
    const PROD = env.NODE_ENV === 'production'
    const options = require('../configs/build.options')(env) || {}

    // 配置骨架
    const config = {

        mode: PROD ? 'production' : 'development',
    
        entry: {},
    
        output: {
            path: options.outputPath || path.resolve(__dirname, '../dist'),
            publicPath: options.publicPath || '/',
            filename: `[name].${PROD ? 'min' : 'dev'}.js?v=[chunkhash]`
        },
    
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader'
                    ]
                },
                {
                    test: /\.(scss|sass)$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader',
                        'sass-loader'
                    ]
                },
                {
                    test: /\.less$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader',
                        'less-loader'
                    ]
                },
                {
                    test: /\.(mp3|ogg|ttf|eot|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            name: `${PROD ? '' : '[name].'}[md5:hash:base64:8].[ext]`
                        }
                    }
                },
                {
                    test: /\.(png|jpg|gif|svg)$/,
                    use: {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: `${PROD ? '' : '[name].'}[md5:hash:base64:8].[ext]`
                        }
                    }
                }
            ]
        },
    
        plugins: [
            new MiniCssExtractPlugin({filename: `[name].${PROD ? 'min' : 'dev'}.css?v=[hash]`}),
        ],
    
        optimization: {
    
            minimize: PROD,
    
            minimizer: [
    
                new UglifyJsPlugin({
                    cache: true,
                    parallel: true
                }),
    
                new OptimizeCssAssetsPlugin({
                    assetNameRegExp: /(\.css)(\?[a-z0-9=&.]+)?$/i,
                    cssProcessor: require('cssnano'),
                    cssProcessorOptions: { discardComments: {removeAll: true }, safe:true},
                    canPrint: true
                })
    
            ]
        }
    }

    // 主题配置
    const baseDir = path.resolve(__dirname, '../themes')
    const themes = fs.readdirSync(baseDir)
    themes.forEach(theme => { config.entry[`theme_${theme}`] = path.resolve(baseDir, theme, 'index.js') })

    return config
}
