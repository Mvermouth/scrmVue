import '../../../../scripts/common/app'

import Order from '../../../../models/ecommerse/order'
import View from './index.vue'

(async() => {
	// 这里需要通过page来查找视图
	const orderPage = await Order.page(1, 1, [{ property: 'id', value: App.data.domain.id, filterType: 'EQ' }], [])
	const order = orderPage.content[0]

	new Vue({
		el: '#app',
		render: h => h(View, { props: { order }})
	})
})()
