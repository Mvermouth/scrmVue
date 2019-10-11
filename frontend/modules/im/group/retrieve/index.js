import '../../../../scripts/common/app'

import View from './views/index.vue'

(async() => {
	// 这里需要通过page来查找视图
	const group = App.data.domain
	new Vue({
		el: '#app',
		render: h => h(View, { props: { group }})
	})
})()
