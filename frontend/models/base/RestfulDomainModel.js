import _ from 'lodash'
import axios from 'axios'
import DomainModel from './DomainModel'

const DEBUG = false
const debug = function () {
	if (DEBUG) console.log(...arguments)
}

axios.defaults.headers.common['HTTP_X_REQUESTED_WITH'] = 'XMLHttpRequest'
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

// 自定义错误处理 { code => [handler1, handler2 ... ] }
const failedHandlers = {}
// 自定义错误处理，{ status => [handler1, handler2 ...] }
const errorHandlers = {}
// 全局通用的错误处理，处理各类异常
let globalErrorHandler = null

export default class RestfulDomainModel extends DomainModel {
	constructor(descriptor, baseUrl) {
		super(descriptor)
		this.baseUrl = baseUrl

		const eventPrefix = baseUrl.split('/').filter(it => !!it).map(it => it[0].toUpperCase() + it.substr(1)).join('')

		this.events = {
			Create: `${eventPrefix}Create`,
			Update: `${eventPrefix}Update`,
			Delete: `${eventPrefix}Delete`
		}
	}

	// 默认的错误处理
	static errorHandler(onFailed, onError) {
		if (onError) {
			globalErrorHandler = onError
		}

		axios.interceptors.response.use(async response => {
			const data = response.data
			const code = data.code
			if (code === 0) {
				return response
			}
			if (failedHandlers[code]) {
				for (const handler of failedHandlers[code]) {
					await handler(response)
				}
			} else if (onFailed) {
				await onFailed(response)
			}
			throw response
		}, async error => {
			if (!error.response) {
				if (onError) await onError(error)
				throw error
			}

			const response = error.response
			const status = response.status
			if (errorHandlers[response.status]) {
				for (const handler of errorHandlers[status]) {
					await handler(error)
				}
			} else if (onError) {
				await onError(error)
			}

			const data = response.data
			const code = data.code
			if (failedHandlers[code]) {
				for (const handler of failedHandlers[code]) {
					await handler(response)
				}
			} else if (onFailed) {
				await onFailed(response)
			}
			throw error
		})
	}

	static registerErrorHandler(status, onError) {
		errorHandlers[status] = errorHandlers[status] || []
		errorHandlers[status].push(onError)
	}

	static registerFailedHandler(code, onFailed) {
		failedHandlers[code] = failedHandlers[code] || []
		failedHandlers[code].push(onFailed)
	}

	_result(response) {
		return response.data.data
	}

	async _retrieveIncludes(data) {
		if (_.isEmpty(data)) return

		// 计算include的引用关系
		const includedBy = this._includedBy(this)

		// 根据引用关系加载
		debug(`开始加载引用 ${this.baseUrl}`)
		await this._fetchIncludes(includedBy, { [this.baseUrl]: data })
	}

	_includedBy(parentModel, result, detectCircularRef) {
		detectCircularRef = detectCircularRef || 1
		result = result || {}

		if (detectCircularRef > 100) {
			throw new Error('Model存在循环依赖！')
		}

		_.each(parentModel.descriptor, it => {
			const field = _.keys(it)[0]
			const fieldProps = it[field]

			// 不是include字段
			if (!fieldProps.include) return

			// 不需要获取include
			if (!fieldProps.retrieve) return

			// include的是数组
			const asArray = _.isArray(fieldProps.include)

			// include的模型
			let model = asArray ? fieldProps.include[0] : fieldProps.include
			// include的是自身
			if (model === 'self') model = parentModel
			const includedBySelf = model === parentModel

			// include后的数据字段名
			const asField = fieldProps.as || `_include_${field}`

			// 被引用关系
			result[model.baseUrl] = result[model.baseUrl] || []
			const exists = result[model.baseUrl].findIndex(it => it.parentModel === parentModel && it.field === field) >= 0
			if (!exists) {
				result[model.baseUrl].push({
					model,
					parentModel,
					includedBySelf,
					field,
					asArray,
					asField,
					// 当前模型的数据已经加载完成，所以直接标记
					parentFetched: this === parentModel
				})

				// 需要递归加载
				if (fieldProps.deep) {
					// 引用的是自身，不可以递归加载，否则循环引用
					if (includedBySelf) return

					this._includedBy(model, result, detectCircularRef + 1)
				}
			}
		})

		return result
	}

	async _fetchIncludes(includedBy, dataMap, fetchedMap) {
		// 避免重复加载
		fetchedMap = fetchedMap || { other: {}, self: {} }

		// 计算出当次可以加载的引用
		const couldFetch = { other: [], self: [] }
		_.each(_.keys(includedBy), it => {
			const groups = _.groupBy(includedBy[it], it => it.includedBySelf ? 'self' : 'other')
			_.each(_.keys(groups), group => {
				// 已经加载过
				if (fetchedMap[group][it]) return

				const includes = groups[group]
				// 须等待所有父模型都加载完成
				if (!_.isEmpty(includes) && includes.every(it => it.parentFetched)) {
					couldFetch[group].push(it)
				}
			})
		})

		// 全部加载完成
		if (_.every(_.keys(couldFetch), it => _.isEmpty(couldFetch[it]))) {
			debug(`引用加载完成 ${this.baseUrl}`)
			return
		}

		for (const group of _.keys(couldFetch)) {
			const includedBySelf = group === 'self'

			for (const it of couldFetch[group]) {
				const includes = includedBy[it].filter(it => it.includedBySelf === includedBySelf)
				const model = includes[0].model

				// 获取加载的Id
				let fetchIds = []
				_.each(includes, it => {
					const data = dataMap[it.parentModel.baseUrl] || []
					const ids = _.flatMap(data, it2 => it2[it.field] || [])
					fetchIds = fetchIds.concat(ids)
				})
				fetchIds = _.uniq(fetchIds).filter(it => it !== undefined && it !== null)

				// 进行加载
				debug(`\t加载${includedBySelf ? '自身' : '其它'}引用 ${it} => ${fetchIds}`)

				if (!_.isEmpty(fetchIds)) {
					// 查询
					const results = await model.batchRetrieve(fetchIds, true)

					// 记录结果，用于后续include
					if (!includedBySelf) dataMap[it] = results

					// 父模型设置结果
					const resultMap = _.keyBy(results, model.primaryKey)
					_.each(includes, it => {
						const data = dataMap[it.parentModel.baseUrl] || []
						_.each(data, it2 => {
							const id = it2[it.field]
							if (_.isArray(id)) {
								it2[it.asField] = it.asArray ? _.map(id, it => resultMap[it]).filter(it => !!it) : resultMap[id[0]]
							} else {
								it2[it.asField] = it.asArray ? (resultMap[id] ? [resultMap[id]] : []) : resultMap[id]
							}
						})
					})
				}

				// 标记加载完成
				fetchedMap[group][it] = true

				// 为引用的模型标记父加载完成
				if (!includedBySelf) {
					_.each(_.keys(includedBy), it => {
						_.each(includedBy[it], it => {
							if (it.parentModel === model) {
								it.parentFetched = true
							}
						})
					})
				}
			}
		}

		// 继续加载
		await this._fetchIncludes(includedBy, dataMap, fetchedMap)
	}

	async post(url, params) {
		try {
			const result = await axios.post(url, params || {})
			return this._result(result)
		} catch (e) {
			console.error(e)
			throw e
		}
	}

	async get(url, query) {
		try {
			const result = await axios.get(url, { params: query })
			return this._result(result)
		} catch (e) {
			console.error(e)
			throw e
		}
	}

	async page(pageNo, pageSize, filter, sort, shallow) {
		const filterKey = _.isArray(filter) ? 'filter' : 'filters'
		const result = await this.post(`${this.baseUrl}/page`, { pageNo, pageSize, [filterKey]: filter, sort })
		if (!shallow) {
			await this._retrieveIncludes(result.content)
		}
		result.content.forEach(this.transformResult)
		return result
	}

	async retrieve(id, include) {
		const result = await this.get(`${this.baseUrl}/retrieve/${id}`, {})
		if (include) {
			await this._retrieveIncludes([result])
		}
		this.transformResult(result)
		return result
	}

	async create(model) {
		return await this.post(`${this.baseUrl}/create`, model)
	}

	async update(model) {
		return await this.post(`${this.baseUrl}/update`, model)
	}

	async delete(id) {
		return await this.post(`${this.baseUrl}/delete/${id}`)
	}

	async batchRetrieve(ids, shallow) {
		const results = await this.post(`${this.baseUrl}/batchRetrieve`, { ids })
		if (!shallow) {
			await this._retrieveIncludes(results)
		}
		results.forEach(this.transformResult)
		return results
	}

	async batchCreate(models) {
		return await this.post(`${this.baseUrl}/batchCreate`, models)
	}

	async batchDelete(ids) {
		return await this.post(`${this.baseUrl}/batchDelete`, { ids })
	}

	error(e) {
		globalErrorHandler && globalErrorHandler(e)
	}

	/**
	 * 处理结果数据
	 *
	 * @param {*} data
	 */
	transformResult(data) {
		return
	}

	/**
	 * 模型缺省值
	 */
	defaults() {
		return this.descriptor.reduce((obj, it) => {
			const key = _.keys(it)[0]
			obj[key] = it[key].defaultValue === undefined ? '' : it[key].defaultValue

			const include = it[key].include
			const as = it[key].as
			if (include && as) {
				if (_.isArray(include)) {
					obj[as] = [include[0].defaults()]
				} else if (_.isObject(include)) {
					obj[as] = include.defaults()
				}
			}

			return obj
		}, {})
	}
}
