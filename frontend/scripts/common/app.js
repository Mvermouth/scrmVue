/**
 * 初始化APP
 */
import window from 'global/window'
import _ from 'lodash'
import axios from 'axios'
import dateformat from 'dateformat'
import Vue from 'vue'

import ResultfulDomainModel from '../../models/base/RestfulDomainModel'

// 配置
import options from '../../configs/app.options'

// ui模块
import { initializeUI } from './ui'

import { parseUrl } from '../utils/url'

window._ = _

window.axios = axios

window.dateformat = dateformat

window.Vue = Vue

// APP实例
const App = {

	// 顶级vue实例
	vm: null,

	// 自己的路由实例
	router: null,

	// 应用数据
	data: window.AppData || {},

	// 应用配置
	options,

	// 是否在iframe中加载
	iframe: (() => {
		try {
			return window.self !== window.top
		} catch (e) {
			console.error(e)
			return true
		}
	})(),

	// 页面容器类型
	target: (() => {
		try {
			return window.frameElement ? window.frameElement.getAttribute('target') : null
		} catch (e) {
			console.error(e)
			return null
		}
	})(),

	// 当前url
	url: (() => {
		try {
			return window.top.location.href
		} catch (e) {
			console.error(e)
			return ''
		}
	})(),

	// 页面跳转
	redirect: url => {
		try {
			window.top.location.href = url
		} catch (e) {
			console.error(e)
		}
	}
}

// 注册顶级vue实例
if (App.iframe) {
	App.vm = (() => {
		try {
			return window.top.App && window.top.App.vm
		} catch (e) {
			console.error(e)
			return null
		}
	})()
}

// vue实例
App.vmInstances = (() => {
	try {
		return App.iframe ? ((window.top.App && window.top.App.vmInstances) || []) : []
	} catch (e) {
		console.error(e)
		return []
	}
})()

// 事件发布订阅
App.event = (() => {
	try {
		return App.iframe ? ((window.top.App && window.top.App.event) || new Vue()) : new Vue()
	} catch (e) {
		console.error(e)
		return null
	}
})()

// 为对话框中页面注册接口
if (App.target === 'dialog') {
	// 获取对话框ID
	App.dialogId = (() => {
		try {
			const id = window.frameElement ? window.frameElement.getAttribute('id') : null
			if (!id) return null
			return parseInt(_.last(id.split('-')))
		} catch (e) {
			console.error(e)
			return null
		}
	})()

	/**
     * 注册钩子
     */
	App.registerDialogAction = function(id, action) {
		// 对话框中的页面，是由上一级app的router创建
		try {
			const router = window.parent && window.parent.App && window.parent.App.router
			if (!router) {
				console.error('没有注册router!')
				return
			}
			router.registerDialogAction(id, action)
		} catch (e) {
			console.error(e)
		}
	}

	/**
     * 解除所有钩子
     */
	App.unregisterDialogActions = function(id) {
		// 对话框中的页面，是由上一级app的router创建
		try {
			const router = window.parent && window.parent.App && window.parent.App.router
			if (!router) {
				console.error('没有注册router!')
				return
			}
			router.unregisterDialogActions(id)
		} catch (e) {
			console.error(e)
		}
	}

	/**
	 * 关闭对话框
	 */
	App.closeDialog = function(id) {
		// 对话框中的页面，是由上一级app的router创建
		try {
			const router = window.parent && window.parent.App && window.parent.App.router
			if (!router) {
				console.error('没有注册router!')
				return
			}
			router.unregisterDialogActions(id)
			router.close(id)
		} catch (e) {
			console.error(e)
		}
	}
}

// 注册当前路由信息
App.route = (() => {
	try {
		if (App.target === 'dialog') {
			// 对话框中的页面，路由信息在上一级
			const router = window.parent && window.parent.App && window.parent.App.router
			return router.dialogRoute(App.dialogId)
		}

		if (App.target === 'iframe') {
			// iframe中打开的页面，路由信息在上一级
			const router = window.parent && window.parent.App && window.parent.App.router
			return router.currentRoute
		}

		return App.router && App.router.currentRoute
	} catch (e) {
		console.error(e)
		return null
	}

	if (App.target === 'dialog') {
		return
	}

	if (App.router) {
		return App.target === 'dialog'
	}
})()

// 注册路由跳转
const initializeRoutes = function(App) {
	const registerRoutes = func => {
		App[func] = function() {
			try {
				const vm = window.top.App && window.top.App.vm
				if (!vm) {
					console.error('没有注册Vue实例')
					return
				}
				if (!vm.$router) {
					console.error('没有$router实例')
					return
				}
				vm.$router[func](...arguments)
			} catch (e) {
				console.error(e)
			}
		}
	}

	['push', 'go', 'replace', 'back', 'forward', 'close'].forEach(registerRoutes)
}
initializeRoutes(App)

// ui初始化
initializeUI(App)

// 统一错误处理
ResultfulDomainModel.errorHandler(

	async response => {
		const data = response.data
		const code = data.code
		const msg = data.msg
		const api = parseUrl(response.config.url).path

		if (code === -1006) {
			// 会话超时重新登录
			App.redirect(`/auth/login?url=${encodeURIComponent(App.url)}`)
			return
		}

		Vue.prototype.$Notice.error({
			title: '调用接口失败',
			desc: `接口: ${api}<br/>错误码: ${code}<br/>错误消息: ${msg}`
		})
	},

	async error => {
		if (error.response) {
			// const api = parseUrl(error.response.config.url).path
			// Vue.prototype.$Notice.error({
			// 	title: '调用接口失败',
			// 	desc: `接口: ${api}<br/>返回超时`
			// })
			return
		}

		Vue.prototype.$Notice.error({
			title: '调用接口失败',
			desc: error.message
		})
	}
)

// 注册自定义的错误处理
App.registerApiError = ResultfulDomainModel.registerErrorHandler
App.registerApiFailed = ResultfulDomainModel.registerFailedHandler

import appProxy from './appProxy'
appProxy.app = App

window.App = App
