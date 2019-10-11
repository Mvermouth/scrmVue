const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const Font = require('fonteditor-core').Font

const iconfonts = require('../configs/iconfont')

// 解析字体
;(() => {
	const fontConfigs = {}
	_.each(iconfonts, it => {
		const buffer = fs.readFileSync(it.file)
		const font = Font.create(buffer, {
			type: 'ttf', // support ttf,woff,eot,otf,svg
			subset: [65, 66], // only read `a`, `b` glyf
			hinting: true, // save font hinting
			compound2simple: true, // transform ttf compound glyf to simple
			inflate: null, // inflate function for woff
			combinePath: false // for svg path
		})
		const fontObject = font.get()
		// 16进制unicode
		fontConfigs[it.name] = _.keys(fontObject.cmap).map(it => parseInt(it).toString(16))
	})
	fs.writeFileSync(path.resolve(__dirname, '../configs/iconfont.json'), JSON.stringify(fontConfigs), 'utf8')
})()

// 打包
const pack = env => {
	return [
		// 打包皮肤
		require('./webpack.theme.config')(env),

		// 打包页面
		require('./webpack.page.config')(env)
	]
}

module.exports = pack
