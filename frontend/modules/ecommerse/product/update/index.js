import '../../../../scripts/common/app'
import '../create/style/index.less'
import View from './index.vue'

(async() => {
	new Vue({
		el: '#app',
		render: h => h(View)
	})
})()

