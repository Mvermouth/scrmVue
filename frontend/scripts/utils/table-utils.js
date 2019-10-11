import _ from 'lodash'

// 表格构造相关

/**
 * 过滤出有效的表格行操作
 *
 * @param {*} actions               操作配置
 * @param {*} permittedActions      允许的操作
 */
export function filterTableRowActions(actions, permittedActions) {
	return actions.map(it => {
		let type
		if (typeof it === 'string') {
			type = it
		}

		if (typeof it === 'object') {
			type = _.keys(it)[0]
		}

		if (permittedActions.indexOf(type) < 0) {
			return
		}
		return it
	}).filter(it => !!it)
}

/**
 * 根据 domain 构造表格列配置
 *
 * @param {*} domain
 */
export function tableColumnsByDomain(domain, options) {
	// 需要在表格中显示的domain属性
	const properties = collectProperties(domain, options)
	const propertyMap = _.reduce(properties, (map, it) => { map[_.keys(it)[0]] = _.values(it)[0]; return map }, {})

	// 表格列，优先按照domain定义顺序
	const keys = _.uniq(_.concat(_.map(properties, it => _.keys(it)[0]), _.keys(options)))

	// 根据位置选项排列
	const sortedKeys = sortColumns(keys, options)

	// 生成表格列配置
	const columns = _.map(sortedKeys, it => {
		const props = propertyMap[it]
		const option = options[it]

		// 设置 false 强制排除对应字段
		if (option === false) return

		let column = props ? { key: it, title: props.name, primaryKey: it === domain.primaryKey } : {}
		if (option) column = _.assign(column, option)

		// 表格列默认配置

		// 默认宽度
		if (column.width === undefined) {
			const widthConfig = App.options.styles.table.width
			if (props.dataType !== undefined && widthConfig.dataTypeDefaults[props.dataType] !== undefined) {
				// 根据数据类型设置
				column.width = widthConfig.dataTypeDefaults[props.dataType]
			} else {
				column.width = widthConfig.default
			}
		}

		return column
	}).filter(it => !!it)

	return columns
}

const sortColumns = function(columnKeys, options) {
	// 根据是否有排序规则区分
	const groups = _.groupBy(columnKeys, it => { return (!options[it] || (!options[it].before && !options[it].after)) ? 'sorted' : 'unsorted' })

	// 没有排序规则的直接计入结果
	const results = groups.sorted
	const resultMap = _.reduce(results, (map, it) => { map[it] = true; return map }, {})

	// 有排序规则的计算位置
	// 根据依赖关系计算出处理顺序
	let sortKeys = []
	let sortKeyMap = {}
	_.each(groups.unsorted, it => {
		if (sortKeyMap[it]) {
			return
		}

		const keys = [it]
		const keyMap = { [it]: true }

		let option = options[it]
		let parentKey = option.before || option.after

		while (parentKey && !resultMap[parentKey] && !sortKeyMap[parentKey]) {
			if (keyMap[parentKey]) {
				throw new Error(`表格字段顺序错误 => 循环依赖: ${parentKey}`)
			}
			keys.push(parentKey)
			keyMap[parentKey] = true

			option = options[parentKey]
			parentKey = option.before || option.after
		}

		sortKeys = _.concat(sortKeys, _.reverse(keys))
		sortKeyMap = _.assign(sortKeyMap, keyMap)
	})

	// 插入到对应位置
	_.each(sortKeys, it => {
		const option = options[it]
		const parentKey = option.before || option.after
		const parentPos = results.indexOf(parentKey)
		const insertPos = parentKey === option.before ? parentPos : parentPos + 1
		results.splice(insertPos, 0, it)
	})

	return results
}

const collectProperties = function(domain, options) {
	const results = []
	collectPropertiesRecursive(domain, null, options, 1, '', results)
	return results
}

const collectPropertiesRecursive = function(domain, parentDomain, options, depth, path, results) {
	const currentDomain = domain === 'self' ? parentDomain : domain
	_.each(currentDomain.descriptor, it => {
		const property = Object.keys(it)[0]
		const props = it[property]

		// 是否在表格中显示
		const propertyPath = `${path ? path + '.' : path}${property}`
		if (isPropertyInTable(propertyPath, props, options, depth)) {
			results.push({ [propertyPath]: _.cloneDeep(props) })
		}

		if (props.include && props.as && !_.isArray(props.include)) {
			if (props.include === 'self' && depth > 1) {
				// 引入自己的模型，无法界定深度，只引入一级，避免循环引用
				return
			}
			// 关联的模型，指定了关联属性，并且不是作为数组，则可以在表格中展开
			const childrenPath = (path ? path + '.' : path) + props.as
			collectPropertiesRecursive(props.include, currentDomain, options, depth + 1, childrenPath, results)
		}
	})
}

const isPropertyInTable = function(propertyPath, props, options, depth) {
	if (depth === 1 && props.dataOnly) {
		// 自身字段，只是数据字段，不需要在模型中显示
		return false
	}
	if (depth > 1 && !options[propertyPath]) {
		// 引入的嵌套字段，需要显式声明，才在表格中显示
		return false
	}
	return true
}
