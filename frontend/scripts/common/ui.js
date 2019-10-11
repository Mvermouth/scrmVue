/**
 * ui模块
 */

// import()时需要添加注释指定chunkName
// import(/* webpackChunkName : "ui" */'/path/to/ui')
// 注意: babel 需要关闭 comments，否则注释会被trim

import window from 'global/window'
import _ from 'lodash'
import Vue from 'vue'
import iView from 'iview'
import ImageViewer from '../../plugins/image-viewer'
import resize from 'vue-resize-directive'
import VueUeditorWrap from '../../vendors/vue-ueditor-wrap'

import registerComponents from '../../components'
import registerDirectives from '../../directives'

import { modalWidth } from '../utils/ui'

// 引入字体
import '../../vendors/fontawesome/less/fontawesome.less'
import '../../vendors/fontawesome/less/fa-brands.less'
import '../../vendors/fontawesome/less/fa-regular.less'
import '../../vendors/fontawesome/less/fa-solid.less'
import '../../vendors/iconfont/iconfont.css'

const initializeUI = function(App) {
	// 页面挂载ui时注册实例
	(function() {
		const isVueRoot = instance => instance.constructor && instance.constructor.name === Vue.prototype.constructor.name

		const mount = Vue.prototype.$mount
		Vue.prototype.$mount = function() {
			isVueRoot(this) && App.vmInstances.push(this)
			return mount.call(this, ...arguments)
		}

		const destroy = Vue.prototype.$destroy
		Vue.prototype.$destroy = function() {
			if (isVueRoot(this)) {
				const idx = App.vmInstances.indexOf(this)
				idx >= 0 && App.vmInstances.splice(idx, 1)
			}
			return destroy.call(this, ...arguments)
		}
	})()

	// 配置vue组件
	Vue.use(iView)
	Vue.use(ImageViewer)
	Vue.directive('resize', resize)
	Vue.component('VueUeditorWrap', VueUeditorWrap)

	registerComponents(Vue)
	registerDirectives(Vue)

	// iframe内，替换iview单例组件为全局
	if (App.iframe) {
		const register = comp => {
			const pVue = window.top && window.top.Vue
			if (pVue) {
				// $_XXX 为iframe内组件，如 this.$_Loading
				Vue.prototype[`$_${comp}`] = Vue.prototype[`$${comp}`]
				// $XXX 为全局组件，如 this.$Loading
				Vue.prototype[`$${comp}`] = pVue.prototype[`$${comp}`]
			}
		}
		['Loading', 'Message', 'Modal', 'Notice', 'Spin', 'Viewer'].forEach(register)
	}

	// 为了能够处理对话框在iframe上拖拽，需要将事件冒泡到上级
	if (App.iframe && App.target !== 'dialog') {
		const evts = ['mousemove', 'mouseup', 'touchmove', 'touchend', 'touchcancel']
		evts.forEach(it => {
			const frame = window.frameElement
			window.addEventListener(it, function(e) {
				const boundingClientRect = frame.getBoundingClientRect()
				const evt = new CustomEvent('mousemove', { bubbles: true, cancelable: false })
				evt.clientX = e.clientX + boundingClientRect.left
				evt.clientY = e.clientY + boundingClientRect.top
				frame.dispatchEvent(evt)
			})
		})
	}

	/**
     * 打开模态对话框
     *
     * @param options   参考 iview Modal 文档
	 * @param type		对话框类型 info|success|warning|error|confirm，默认confirm
     */
	App.modal = (options, type) => {
		options = Object.assign({ crossFrame: true }, options)

		type = type || 'confirm'

		// 默认显示右上角关闭按钮
		options.closable = options.closable === undefined ? true : options.closable

		// 预定义的尺寸规格
		if (options.width === undefined) {
			options.width = 'normal'
		}

		if (typeof options.width === 'string') {
			options.width = modalWidth(document.body.clientWidth, options.width)
		}

		// 对话框render的实例
		let vnode

		// 替换render，保存render的实例
		if (options.render) {
			const func = options.render
			options.render = function(h) {
				vnode = func.call(this, h)
				return vnode
			}
		}

		// modal实例
		let $modal

		// 等待创建后获取modal实例
		setTimeout(() => {
			const vm = App.vmInstances.find(it => it.$children[0].classes && typeof (it.$children[0].classes) === 'string' && it.$children[0].classes.endsWith('-modal'))
			if (vm) {
				$modal = vm.$children[0]

				// 监听modal的取消关闭操作
				$modal.$on('on-cancel', function() {
					// 激发用户钩子
					if (options.onClose) {
						options.onClose.call(this, vnode && vnode.componentInstance)
					}

					// 关闭
					App.removeModal()
				})

				// 重置modal的按钮loading状态
				$modal.cancelLoading = () => {
					vm.buttonLoading = false
				}
			}
		}, 100)

		// 替换钩子，透传render & modal 的实例
		if (options.onOk) {
			const func = options.onOk
			options.onOk = function() {
				return func.call(this, vnode && vnode.componentInstance, $modal)
			}
		}

		if (options.onCancel) {
			const func = options.onCancel
			options.onCancel = function() {
				return func.call(this, vnode && vnode.componentInstance, $modal)
			}
		}

		if (options.crossFrame) {
			// 全局打开
			Vue.prototype.$Modal[type](options)
		} else {
			// iframe 局部打开
			Vue.prototype.$_Modal[type](options)
		}
	}

	/**
     * 关闭模态对话框
     */
	App.removeModal = () => {
		Vue.prototype.$_Modal.remove()

		Vue.prototype.$Modal.remove()
	}

	/**
     * 打开图片查看器
     *
     * @param images	图片地址列表
	 * @param index		默认打开图片索引
	 * @param options	图片查看器配置，参考 https://mirari.cc/v-viewer/
     */
	App.viewImages = (images, index, options) => {
		if (typeof index === 'object') {
			options = index
			index = 0
		}

		index = index || 0

		options = _.assign({
			title: false,
			tooltip: false,
			hidden: App.removeImageViewer
		}, options || {})

		Vue.prototype.$Viewer.open({ images, index, options })
	}

	/**
	 * 关闭图片查看器
	 */
	App.removeImageViewer = () => {
		Vue.prototype.$Viewer.remove()
	}
}

export { initializeUI, iView }
