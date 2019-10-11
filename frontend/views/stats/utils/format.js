import _ from 'lodash'
import dateformat from 'dateformat'
import Constant from '../../../configs/constant'

export default (value, formatter) => {
	if (!formatter) return value
	switch (formatter.type) {
		case 'constant': return formatConstant(value, formatter.value)
		case 'datetime': return dateformat(value, formatter.value)
		case 'money': return formatMoney(value)
		default: return value
	}
}

function formatMoney(value) {
	return Math.floor(value / 100)
}

function formatConstant(value, key) {
	const constantMap = Constant[key]
	if (!constantMap) return value
	// 这里值的类型可能不同，不需要严格匹配
	const matchKey = _.keys(constantMap).find(it => constantMap[it].value == value)
	if (!matchKey) return value
	return constantMap[matchKey].text
}