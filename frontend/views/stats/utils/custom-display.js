import _ from 'lodash'

const GranularityDatetimeFormat = {
	hour: 'HH:00',
	day: 'mm-dd',
	month: 'yyyy-mm'
}

export default (display, interval, granularity) => {
	const customDisplay = {}

	// 时间刻度插值规则
	if (display.timeInterpolate) {
		const timeInterpolatePolicy = { interval, granularity }
		customDisplay.timeInterpolatePolicy = timeInterpolatePolicy
	}

	// 根据时间粒度设置时间格式
	customDisplay.dimensionFormat = _.mapValues(display.dimensionFormat || {}, it => {
		switch (it.type.toUpperCase()) {
			case 'DATETIME': {
				const format = _.cloneDeep(it)
				format.value = GranularityDatetimeFormat[granularity]
				return format
			}
			default: {
				return it
			}
		}
	})

	return customDisplay
}
