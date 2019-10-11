import _ from 'lodash'
import VueRouter from 'vue-router'
import { install } from './install'
import { normalizeLocation } from './util/location'
import { inBrowser } from './util/dom'

/**
 * iframe & vue-router 混合路由
 */
export default class HybridRouter extends VueRouter {
    static install
    static version

    // 打开的对话框
    dialogs

    constructor(options) {
    	super(options)
    	this.dialogs = []
    }

    push(location, onComplete, onAbort) {
    	if (/^((https|http|ftp|rtsp|mms)?:\/\/)/.test(location)) {
			// iframe嵌入外站链接
    		location = {
    			_normalized: true,
    			path: '/',
    			query: { _tgt: 'fr', _r: location },
    			hash: ''
    		}
    	} else {
    		location = location._normalized ? location : normalizeLocation(location, this.history.current, false, this)
    	}
    	const route = this.match(location, this.history.current)
    	const target = routeTarget(route)
    	location = locationByTarget(location, target)

    	if (!this.openTarget(location, route, target)) {
    		super.push(location, onComplete, onAbort)
    	}
    }

    replace(location, onComplete, onAbort) {
    	location = location._normalized ? location : normalizeLocation(location, this.history.current, false, this)
    	const route = this.match(location, this.history.current)
    	const target = routeTarget(route)
    	location = locationByTarget(location, target)
    	if (!this.openTarget(location, route, target)) {
    		super.replace(location, onComplete, onAbort)
    	}
    }

    /**
     * 关闭对话框
     *
     * @param {*} id
     */
    close(id) {
    	const idx = this.dialogs.findIndex(it => it.id === id)
    	if (idx >= 0) {
    		this.dialogs.splice(idx, 1)
    	}
    }

    /**
     * 注册对话框执行钩子
     *
     * @param {*} id
     * @param {*} action
     *
     * action 结构
     * {
     *      // 按钮文本
     *      title: '确定',
     *
     *      // 按钮类型
     *      type: 'primary',
     *
     *      // 是否异步操作，如果是，onAction必须async
     *      isAsync: false,
     *
     *      // action执行逻辑
     *      onAction: () => {}
     * }
     */
    registerDialogAction(id, action) {
    	const idx = this.dialogs.findIndex(it => it.id === id)
    	if (idx < 0) {
    		return
    	}
    	const dialog = _.cloneDeep(this.dialogs[idx])
    	dialog.actions.push(action)
    	Object.freeze(dialog)
    	this.dialogs.splice(idx, 1, dialog)
    }

    /**
     * 清除对话框执行钩子
     *
     * @param {*} id
     */
    unregisterDialogActions(id) {
    	const idx = this.dialogs.findIndex(it => it.id === id)
    	if (idx < 0) {
    		return
    	}
    	const dialog = _.cloneDeep(this.dialogs[idx])
    	dialog.actions = []
    	Object.freeze(dialog)
    	this.dialogs.splice(idx, 1, dialog)
    }

    dialogRoute(id) {
    	const dialog = this.dialogs.find(it => it.id === id)
    	return dialog && dialog.route
    }

    get currentTarget() {
    	return routeTarget(this.currentRoute)
    }

    openTarget(location, route, target, args) {
    	switch (target) {
    		case 'dialog': {
    			args = args || {}
    			const id = assignDialogId()
    			const actions = []
    			const dialog = Object.assign({ id, route, actions }, args)
    			Object.freeze(dialog)
    			this.dialogs.push(dialog)
    			return true
    		}
    		default: {
    			break
    		}
    	}
    	return false
    }
}

/**
 * 路由目标类型
 *
 * @param {*} route
 */
const routeTarget = function(route) {
	if (route.meta && route.meta.target) {
		// 指定类型
		return route.meta.target
	}
	if (!route.matched || route.matched.length === 0) {
		// 没有路由配置
		return 'iframe'
	}
	const matched = route.matched[route.matched.length - 1]
	if (!matched.components.default) {
		// 没有关联component的路由
		return 'iframe'
	}
	return 'spa'
}

/**
 * 根据路由目标设置参数
 *
 * @param {*} location
 * @param {*} target
 */
const locationByTarget = function(location, target) {
	switch (target) {
		case 'iframe': {
			location.query._tgt = 'fr'
			break
		}
		default: {
			break
		}
	}
	return location
}

let dialogId = 0
const assignDialogId = () => ++dialogId

HybridRouter.install = function(Vue) {
	VueRouter.install(Vue)
	install(Vue)
}
HybridRouter.version = VueRouter.version

if (inBrowser && window.Vue) {
	window.Vue.use(HybridRouter)
}
