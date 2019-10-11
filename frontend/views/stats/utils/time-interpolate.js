import Constants from '../../../configs/constant'
import moment from 'moment'

/**
 * 获取时间序列
 */
export default (intervalType, granularity) => {
	const interval = getInterval(intervalType)
	const start = moment(interval[0]).startOf(granularity).toDate()
	const end = moment(interval[1]).startOf(granularity).toDate()
	const series = []
	let it = new Date(start.getTime())
	while (it < end) {
		series.push(it)
		it = moment(it).add(1, `${granularity}s`).toDate()
	}
	return series
}

function getInterval(intervalType) {
	const interval = []

	if (Array.isArray(intervalType)) {
		// 固定时间范围
		interval[0] = new Date(intervalType[0])
		interval[1] = new Date(intervalType[1])

	} else {
		// 动态时间范围
		switch (intervalType) {
			case Constants.StatsIntervalType.Today.value: {
				interval[0] = moment().startOf('day').toDate()
				interval[1] = new Date()
				break
			}
			case Constants.StatsIntervalType.Yesterday.value: {
				interval[0] = moment().subtract(1, 'days').startOf('day').toDate()
				interval[1] = moment().subtract(1, 'days').endOf('day').toDate()
				break
			}
			case Constants.StatsIntervalType.CurrentMonth.value: {
				interval[0] = moment().startOf('month').toDate()
				interval[1] = new Date()
				break
			}
			case Constants.StatsIntervalType.PrevMonth.value: {
				interval[0] = moment().subtract(1, 'months').startOf('month')
				interval[1] = moment().subtract(1, 'months').endOf('month')
				break
			}
			case Constants.StatsIntervalType.Prev7Days.value: {
				interval[0] = moment().subtract(6, 'days').startOf('day')
				interval[1] = new Date()
				break
			}
			case Constants.StatsIntervalType.Prev15Days.value: {
				interval[0] = moment().subtract(14, 'days').startOf('day')
				interval[1] = new Date()
				break
			}
			case Constants.StatsIntervalType.Prev30Days.value: {
				interval[0] = moment().subtract(29, 'days').startOf('day')
				interval[1] = new Date()
				break
			}
			default: {
				throw new Error("未知的时间范围" + intervalType)
			}
		}
	}

	return interval
}