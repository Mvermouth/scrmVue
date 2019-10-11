import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import $Viewer from './viewer'

const install = function(Vue) {
	if (install.installed) return
	install.installed = true

	Vue.use(Viewer)

	Vue.prototype.$Viewer = $Viewer
}

// auto install
if (typeof window !== 'undefined' && window.Vue) {
	install(window.Vue)
}

export default {
	install
}
