import dateformat from 'dateformat'

const GranularityDatetimeFormat = {
	hour: 'mm-dd HH:00',
	day: 'mm-dd',
	month: 'yyyy-mm'
}

export default function (title, interval, granularity) {
	const start = dateformat(interval[0], GranularityDatetimeFormat[granularity])
	const end = dateformat(interval[1], GranularityDatetimeFormat[granularity])
	return title.replace('%startTime%', start).replace('%endTime%', end)
}