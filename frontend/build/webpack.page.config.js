const path = require('path')
const fs = require('fs')
const _ = require('lodash')

const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

const buildUtils = require('./build.utils')

module.exports = env => {
	// 构建参数
	const PROD = env.NODE_ENV === 'production'
	const variables = require('../configs/build.variables')(env)
	const options = require('../configs/build.options')(env) || {}

	// 配置骨架
	const config = {

		mode: PROD ? 'production' : 'development',

		devtool: PROD ? false : 'inline-source-map',

		entry: {},

		output: {
			path: options.outputPath || path.resolve(__dirname, '../dist'),
			publicPath: options.publicPath || '/',
			filename: `[name].${PROD ? 'min' : 'dev'}.js?v=[chunkhash]`,
			chunkFilename: `[name].${PROD ? 'min' : 'dev'}.js?v=[chunkhash]`
		},

		module: {
			rules: [
				{
					test: /\.(ejs|html)$/,
					// 加载模版页，支持递归嵌套
					use: ['nested-html-loader']
				},
				{
					test: /\.vue$/,
					use: ['vue-loader']
				},
				{
					test: /\.js$/,
					use: ['babel-loader'],
					exclude: /node_modules/
				},
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
							// 小资源直接内联，减少网络请求数
							limit: 8192,
							name: `${PROD ? '' : '[name].'}[md5:hash:base64:8].[ext]`
						}
					}
				}
			]
		},

		plugins: [

			new VueLoaderPlugin(),

			new MiniCssExtractPlugin({ filename: `[name].${PROD ? 'min' : 'dev'}.css?v=[hash]` }),

			new webpack.DefinePlugin({
				// 资源路径
				PUBLIC_PATH: options.publicPath
			})
			//,new UglifyJsPlugin()
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
					cssProcessorOptions: { discardComments: { removeAll: true }, safe: true },
					canPrint: true
				})

			],

			splitChunks: {

				name: true,

				cacheGroups: {

					default: false,

					'lib.ui': {
						test: /[\\/]node_modules[\\/](iview)[\\/]/,
						chunks: 'all',
						priority: 30,
						name: 'lib.ui'
					},

					'lib.vendors': {
						test: /[\\/]node_modules[\\/]/,
						chunks: 'initial',
						priority: 25,
						name: 'lib.vendors'
					},

					'lib.core': {
						chunks: 'initial',
						minChunks: 2,
						priority: 20,
						name: 'lib.core'
					},

					/**
                     * 可按需加载的组件需要异步加载
                     */
					'lib.router': {
						test: /[\\/]node_modules[\\/]vue-router[\\/]/,
						chunks: 'async',
						priority: 10,
						name: 'lib.router'
					},

					'lib.store': {
						test: /[\\/]node_modules[\\/]vuex[\\/]/,
						chunks: 'async',
						priority: 10,
						name: 'lib.store'
					},

					/**
                     * 异步加载的公共模块
                     */
					'lib.common': {
						test: /[\\/]node_modules[\\/]/,
						chunks: 'async',
						priority: 5,
						name: 'lib.common'
					}
				}
			},

			runtimeChunk: { name: 'manifest' }
		}
	}

	// 页面配置

	// 目录结构 modules/{module}/{controller}/{page}/index.(js|ejs|html)
	const baseDir = path.resolve(__dirname, '../modules')

	// 拷贝的资源
	const assetInfos = {}
	const copyAssets = []
	// 页面的插件
	const htmlPlugins = []
	const htmlIncludePlugins = []

	// 遍历module
	const modules = fs.readdirSync(baseDir)
	modules.forEach(module => {
		const moduleDir = path.resolve(baseDir, module)

		// 遍历controller
		const controllers = fs.readdirSync(moduleDir)
		controllers.forEach(controller => {
			const controllerDir = path.resolve(moduleDir, controller)

			// 遍历page
			const pages = fs.readdirSync(controllerDir)
			pages.forEach(page => {
				const pageDir = path.resolve(controllerDir, page)
				const pageName = `${module}.${controller}.${page}`
				const pageType = getPageType(pageDir)
				const pageVariables = getPageVariables(variables, env, pageDir)

				// 打包入口
				config.entry[pageName] = path.resolve(pageDir, 'index.js')

				// 生成模版/静态页面
				if (!pageType) {
					return
				}

				const pageSrcPath = path.resolve(pageDir, `index.${pageType}`)
				const pageDistPath = (options.pageOutputPath[pageType] || path.resolve(__dirname, `../dist/${pageType}`)) + `/${module}/${controller}/${page}.${pageType}`

				// 生成页面
				htmlPlugins.push(new HtmlWebpackPlugin({
					chunks: ['manifest', 'lib.ui', 'lib.vendors', 'lib.core', pageName],
					minify: PROD,
					inject: true,
					filename: pageDistPath,
					template: pageSrcPath
				}))

				// 需要注入页面的资源
				const prepends = [
					...pageVariables.prependStyles,
					...pageVariables.prependScripts
				]
				const appends = [
					...pageVariables.appendStyles,
					...pageVariables.appendScripts
				]

				// 拷贝的资源
				const assets = [...pageVariables.copy, ...prepends, ...appends]
				if (assets.length === 0) {
					return
				}

				assets.forEach(it => {
					if (!isLocalPath(it)) return

					assetInfos[it] = assetInfos[it] || buildUtils.collectAssetInfo(it)
					if (copyAssets.indexOf(it) >= 0) {
						// 避免重复拷贝
						return
					}
					if (!assetInfos[it].stat) {
						// 文件不存在
						return
					}
					// 文件存在需要拷贝到发布目录
					copyAssets.push(it)
				})

				// 资源注入页面
				const injects = [prepends, appends]
				injects.forEach((it, idx) => {
					const partitions = _.partition(it, isLocalPath)
					const localPaths = partitions[0]
					const remotePaths = partitions[1]

					if (localPaths.length > 0) {
						htmlIncludePlugins.push(new HtmlWebpackIncludeAssetsPlugin({
							assets: localPaths.map(it => {
								// 本地资源路径
								const assetInfo = assetInfos[it]
								if (assetInfo.stat) {
									// 文件拷贝到发布目录根目录
									return `${path.basename(it)}${assetInfo.version ? '?v=' + assetInfo.version : ''}`
								} else {
									// 文件不存在，直接将完整路径注入到页面
									return it
								}
							}),
							// 只注入到当前页面
							files: path.relative(__dirname, pageDistPath),
							hash: false,
							append: idx === 1
						}))
					}

					if (remotePaths.length > 0) {
						htmlIncludePlugins.push(new HtmlWebpackIncludeAssetsPlugin({
							assets: remotePaths,
							// 只注入到当前页面
							files: path.relative(__dirname, pageDistPath),
							hash: false,
							append: idx === 1,
							publicPath: ''
						}))
					}
				})
			})
		})
	})

	config.plugins = [

		...config.plugins,

		// 拷贝资源
		new CopyWebpackPlugin(copyAssets.map(it => {
			const toBase = options.outputPath || path.resolve(__dirname, '../dist')
			// 文件直接拷贝到发布根目录，目录整体拷贝到发布根目录
			const to = assetInfos[it].stat.isFile() ? toBase : path.join(toBase, path.basename(it))
			return { from: it, to }
		})),

		// 生成页面
		...htmlPlugins,

		// 页面包含第三方资源
		...htmlIncludePlugins
	]

	return config
}

const getPageType = pageDir => {
	if (fs.existsSync(path.resolve(pageDir, 'index.ejs'))) {
		return 'ejs'
	}
	if (fs.existsSync(path.resolve(pageDir, 'index.html'))) {
		return 'html'
	}
	return ''
}

const getPageVariables = (variables, env, pageDir) => {
	const pageVariablesPath = path.resolve(pageDir, 'build.variables.js')
	if (!fs.existsSync(pageVariablesPath)) {
		return variables
	}
	return _.assign(_.cloneDeep(variables), require(pageVariablesPath)(env) || {})
}

const isLocalPath = path => {
	return typeof path === 'string' && !(path.startsWith('http://') || path.startsWith('https://'))
}
