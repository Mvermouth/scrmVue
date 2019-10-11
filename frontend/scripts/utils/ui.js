/**
 * UI相关
 */

import _ from 'lodash'

/**
 * 对话框的默认布局配置
 *
 * 格式
 *  {
 *      // 宽度布局
 *      width: {
 *          // 最大宽度
 *          max: [ { breakpoint: 100, value: 80 } ...],
 *
 *          // 响应式布局
 *          responsive: [ { breakpoint: 100, value: .9 } ...]
 *      },
 *
 *      // 高度布局
 *      height: {
 *          // 最大高度
 *          max: [ { breakpoint: 100, value: 80 } ...],
 *
 *          // 响应式布局
 *          responsive: [ { breakpoint: 100, value: .9 } ...]
 *      }
 *  }
 */
let _modalLayouts
export function modalLayouts() {
	if (!_modalLayouts) {
		const calcLayouts = (breakpoints, values) => {
			return _.keys(breakpoints)
				.map(it => { return { breakpoint: breakpoints[it], value: values[it] || 0 } })
				.sort((it1, it2) => it1.breakpoint - it2.breakpoint)
		}

		const breakpoints = App.options.styles.layout.breakpoints
		const modalLayouts = App.options.styles.modal

		_modalLayouts = {
			width: {
				max: calcLayouts(breakpoints.width, modalLayouts.width.max),
				responsive: calcLayouts(breakpoints.width, modalLayouts.width.responsive)
			},
			height: {
				max: calcLayouts(breakpoints.height, modalLayouts.height.max),
				responsive: calcLayouts(breakpoints.height, modalLayouts.height.responsive)
			}
		}
	}
	return _modalLayouts
}

/**
 * 计算对话框宽度
 *
 * @param {*} constraintWidth   容器宽度
 * @param {*} modalSize         尺寸规格 small|normal|large
 */
export function modalWidth(constraintWidth, modalSize) {
	const breakpoints = App.options.styles.layout.breakpoints.width
	const layouts = App.options.styles.modal.width.fixed
	const breakpoint = _.keys(breakpoints)
		.sort((it1, it2) => breakpoints[it1] - breakpoints[it2])
		.find(it => constraintWidth < breakpoints[it])
	return layouts[breakpoint][modalSize || 'normal']
}

// Find components upward
export function findComponentUpward(context, componentName, componentNames) {
	if (typeof componentName === 'string') {
		componentNames = [componentName]
	} else {
		componentNames = componentName
	}

	let parent = context.$parent
	let name = parent.$options.name
	while (parent && (!name || componentNames.indexOf(name) < 0)) {
		parent = parent.$parent
		if (parent) name = parent.$options.name
	}
	return parent
}

// Find component downward
export function findComponentDownward(context, componentName) {
	const childrens = context.$children
	let children = null

	if (childrens.length) {
		for (const child of childrens) {
			const name = child.$options.name
			if (name === componentName) {
				children = child
				break
			} else {
				children = findComponentDownward(child, componentName)
				if (children) break
			}
		}
	}
	return children
}

// Find components downward
export function findComponentsDownward(context, componentName) {
	return context.$children.reduce((components, child) => {
		if (child.$options.name === componentName) components.push(child)
		const foundChilds = findComponentsDownward(child, componentName)
		return components.concat(foundChilds)
	}, [])
}

// Find components upward
export function findComponentsUpward(context, componentName) {
	const parents = []
	const parent = context.$parent
	if (parent) {
		if (parent.$options.name === componentName) parents.push(parent)
		return parents.concat(findComponentsUpward(parent, componentName))
	} else {
		return []
	}
}

// Find brothers components
export function findBrothersComponents(context, componentName, exceptMe = true) {
	const res = context.$parent.$children.filter(item => {
		return item.$options.name === componentName
	})
	const index = res.findIndex(item => item._uid === context._uid)
	if (exceptMe) res.splice(index, 1)
	return res
}
