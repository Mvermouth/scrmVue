/**
 * 是否邮箱
 *
 * @param {*} val
 */
export const isEmail = function (val) {
	return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val.toLowerCase())
}

/**
 * 是否手机号
 *
 * @param {*} val
 */
export const isMobile = function (val) {
	return /^((1[3-9][0-9])+\d{8})$/.test(val)
}

export const validatePassword = function (password) {
	return /^(?![\d]+$)(?![a-zA-Z]+$)(?![~!@#$%^&*\(\)\-\+\=]+$)[\da-zA-Z~!@#$%^&*\(\)\-\+\=]{8,20}$/.test(password)
}

/**
 *
 * @param {*} constant 常量
 * @param {*} value 取text
 */
export const value2Text = function (constant, value) {
	const v2t = {}
	Object.keys(constant).forEach(key => {
		const v = constant[key].value
		if (Array.isArray(v)) {
			v.forEach(it => {
				v2t[it] = constant[key].text
			})
		} else {
			v2t[constant[key].value] = constant[key].text
		}
	})
	if (!v2t[value]) {
		return
	}

	return v2t[value]
}

/**
 *
 * @param {*} constant 常量
 */
export const constant2Array = function (constant) {
	const arr = []

	Object.keys(constant).forEach(key => {
		const it = constant[key]
		arr.push(it)
	})
	return arr
}

/**
 * 日期选择器快捷键
 */
export const datePickerShortcuts = function () {
	return [
		{
			text: '今天',
			value() {
				const start = new Date()
				const end = new Date()
				start.setHours(0, 0, 0, 0)
				return [start, end]
			}
		},
		{
			text: '昨天',
			value() {
				const start = new Date()
				const end = new Date()
				start.setDate(start.getDate() - 1)
				start.setHours(0, 0, 0, 0)
				end.setHours(0, 0, 0, 0)
				return [start, end]
			}
		},
		{
			text: '最近7天',
			value() {
				const start = new Date()
				const end = new Date()
				start.setDate(start.getDate() - 6)
				start.setHours(0, 0, 0, 0)
				return [start, end]
			}
		},
		{
			text: '最近30天',
			value() {
				const start = new Date()
				const end = new Date()
				start.setDate(start.getDate() - 29)
				start.setHours(0, 0, 0, 0)
				return [start, end]
			}
		},
		{
			text: '这个月',
			value() {
				const start = new Date()
				const end = new Date()
				start.setDate(1)
				start.setHours(0, 0, 0, 0)
				return [start, end]
			}
		},
		{
			text: '上个月',
			value() {
				const start = new Date()
				const end = new Date()
				start.setMonth(start.getMonth() - 1)
				start.setDate(1)
				start.setHours(0, 0, 0, 0)
				end.setDate(1)
				end.setHours(0, 0, 0, 0)
				return [start, end]
			}
		}
	]
}
/**
 * inputContent 内容
 * sensitiveArr 敏感词 数组对象 [{content:'fuck', type:1, replaceWord: '好'}]
 */
export const hightlightSensitiveWord = function (inputContent, sensitiveArr, constant) {
	let showContent = inputContent
	for (let i = 0; i < sensitiveArr.length; i++) {
		const r = new RegExp(sensitiveArr[i].content, 'ig')
		// 一般敏感操作
		if (sensitiveArr[i].level === constant.General.value) {
			showContent = showContent.replace(r, "<span style='color:red'>" + sensitiveArr[i].content + '</span>')
		}
		// 比较敏感，暂未按敏感级别区分颜色，待定
		if (sensitiveArr[i].level === constant.High.value) {
			showContent = showContent.replace(r, "<span style='color:red'>" + sensitiveArr[i].content + '</span>')
		}
		// 非常敏感， 暂未按敏感级别区分颜色，待定
		if (sensitiveArr[i].level === constant.Critical.value) {
			showContent = showContent.replace(r, "<span style='color:red'>" + sensitiveArr[i].content + '</span>')
		}
	}
	return showContent
}
/**
 * content  匹配的内容
 * query    查询关键字
 */
// 下划线显示查询匹配的文字
export const highlightKeywords = function (content, query) {
	let highlightContent = content
	const c = new RegExp(query, 'ig')
	if (!_.isEmpty(query)) {
		highlightContent = highlightContent.replace(c, "<span style='text-decoration: underline; color: #5cadff'>" + query + '</span>')
	}
	return highlightContent
}

export const toEmotion = function (text, isNoGif) {
	var list = ['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭', '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过', '酷', '冷汗', '抓狂', '吐', '偷笑', '愉快', '白眼', '傲慢', '饥饿', '困', '惊恐', '流汗', '憨笑', '大兵', '奋斗', '咒骂', '疑问', '嘘', '晕', '折磨', '衰', '骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险', '亲亲', '吓', '可怜', '菜刀', '西瓜', '啤酒', '篮球', '乒乓', '咖啡', '饭', '猪头', '玫瑰', '凋谢', '示爱', '爱心', '心碎', '蛋糕', '闪电', '炸弹', '刀', '足球', '瓢虫', '便便', '月亮', '太阳', '礼物', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引', '拳头', '差劲', '爱你', 'NO', 'OK', '爱情', '飞吻', '跳跳', '发抖', '怄火', '转圈', '磕头', '回头', '跳绳', '挥手', '激动', '街舞', '献吻', '左太极', '右太极', '嘿哈', '捂脸', '奸笑', '机智', '皱眉', '耶', '红包', '鸡']
	if (!text) {
		return text
	}

	text = text.replace(/\[[\u4E00-\u9FA5]{1,3}\]/gi, function (word) {
		var newWord = word.replace(/\[|\]/gi, '')
		var index = list.indexOf(newWord)
		var backgroundPositionX = -index * 24
		var imgHTML = ''
		if (index < 0) {
			return word
		}

		if (isNoGif) {
			if (index > 104) {
				return word
			}
			imgHTML = `<i class="static-emotion" style="background:url(https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/default218877.gif) ${backgroundPositionX}px 0;"></i>`
		} else {
			var path = index > 104 ? '/img' : 'https://res.wx.qq.com/mpres/htmledition/images/icon'
			imgHTML = `<img class="static-emotion-gif" src="${path}/emotion/${index}.gif">`
		}
		return imgHTML
	})
	return text
}

// 获取字符串长度
export const stringLength = (string = '') => {
	if (!string) {
		return false
	}
	let len = 0
	for (let i = 0; i < string.length; i++) {
		if (string.charCodeAt(i) > 127 || string.charCodeAt(i) == 94) {
			len += 2
		} else {
			len++
		}
	}
	return len
}

export const get_lang_zh = (strValue, defaultValue) => {
	if (strValue != null && strValue != '') {
		var reg = /[\u4e00-\u9fa5]/g
		const r = strValue.match(reg)
		if (r) return r.join('')
		else return defaultValue
	} else { return defaultValue }
}

/**
 * timestamp 时间字符串
 * 该项目已引入dateformate插件，为了不和dateformat插件的命名不产生歧义冲突，故命名为toTimeStamp
 */
export const toTimeStamp = (timestamp) => {
	if (!timestamp) {
		return null
	}
	return Math.floor(new Date(timestamp).getTime())
}

export const age = (brithday) => {
	if (!brithday) {
		return
	}
	let brithDate = brithday
	if (_.isNumber(brithDate)) {
		brithDate = new Date(brithDate)
	}
	const end = new Date().getFullYear()
	const start = brithDate.getFullYear()
	return end - start
}
