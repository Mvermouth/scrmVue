
export function parseQuery(query) {
	const queryObj = {}
	query.split('&').forEach(param => {
		const parts = param.replace(/\+/g, ' ').split('=')
		const key = decodeURIComponent(parts.shift())
		const val = parts.length > 0 ? decodeURIComponent(parts.join('=')) : null
		if (queryObj[key] === undefined) {
			queryObj[key] = val
		} else if (Array.isArray(queryObj[key])) {
			queryObj[key].push(val)
		} else {
			queryObj[key] = [queryObj[key], val]
		}
	})
	return queryObj
}

export function stringifyQuery(queryObj) {
	if (!queryObj) {
		return ''
	}
	return Object.keys(queryObj)
		.sort()
		.map(key => {
			const val = queryObj[key]
			if (val === undefined) {
				return ''
			}
			if (val === null) {
				return encodeURIComponent(key)
			}
			if (Array.isArray(val)) {
				const result = []
				val.forEach(val2 => {
					if (val2 === undefined) {
						return
					}
					if (val2 === null) {
						result.push(encodeURIComponent(key))
					} else {
						result.push(`${encodeURIComponent(key)}=${encodeURIComponent(val2)}`)
					}
				})
				return result.join('&')
			}
			return `${encodeURIComponent(key)}=${encodeURIComponent(val)}`
		})
		.filter(it => it.length > 0)
		.join('&')
}
