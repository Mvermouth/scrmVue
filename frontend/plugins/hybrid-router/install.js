import SingleIframeRouterView from './components/single-iframe-router-view'
import MultiIframeRouterView from './components/multi-iframe-router-view/index.vue'
import DialogView from './components/dialog-view/index.vue'

export let _Vue

export function install (Vue) {
    if (install.installed && _Vue === Vue) return
    install.installed = true 
    
    _Vue = Vue

    const isDef = v => v !== undefined

    Vue.mixin({
        beforeCreate () {
            if (isDef(this.$options.router)) {
                Vue.util.defineReactive(this, '_dialogs', this._router.dialogs)
            }
        }
    })
    
    Object.defineProperty(Vue.prototype, '$dialogs', {
        get () { return this._routerRoot._dialogs }
    })

    Vue.component('SingleIframeRouterView', SingleIframeRouterView)
    Vue.component('MultiIframeRouterView', MultiIframeRouterView)
    Vue.component('DialogView', DialogView)
}