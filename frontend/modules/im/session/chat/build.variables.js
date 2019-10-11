const path = require('path')

/**
 * 打包变量默认值
 */
module.exports = env => {
	const PROD = env.NODE_ENV === 'production'

	return {

		// 前置插入的第三方脚本
		prependScripts: [

			// 百度地图
			{ path: 'https://api.map.baidu.com/api?v=3.0&ak=3xa8vDoXFrRu3xNQ4T9VDaD4cXo8KFzR', type: 'js' }

		]

	}
}

