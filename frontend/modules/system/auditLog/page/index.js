import '../../../../scripts/common/app'
import View from './index.vue'
new Vue({
	el: '#app',
	render: h => {
		const v = h(View)
		return <card>{v}</card>
	}
})
