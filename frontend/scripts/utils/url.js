import { parseQuery, stringifyQuery } from './querystring'

export function parseUrl(path, parse) {
	let hash = ''
	let query = ''

	const hashIndex = path.indexOf('#')
	if (hashIndex >= 0) {
		hash = path.slice(hashIndex)
		path = path.slice(0, hashIndex)
	}

	const queryIndex = path.indexOf('?')
	if (queryIndex >= 0) {
		query = path.slice(queryIndex + 1)
		path = path.slice(0, queryIndex)
	}

	if (parse && query) {
		query = parseQuery(query)
	}

	return { path, query, hash }
}

export function stringifyUrl({ path, query, hash }) {
	query = typeof query === 'object' ? stringifyQuery(query) : query
	query = query ? `?${query}` : ''
	hash = hash ? `#${hash}` : ''
	return `${path}${query}${hash}`
}
