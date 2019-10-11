import '../../../../scripts/common/app'
import Order from '../../../../models/ecommerse/order'
import View from './index.vue'
import { parseUrl } from '../../../../scripts/utils/url'

(async() => {
	const { query } = parseUrl(location.href, true)
	const type = query.type
	const orderPage = await Order.page(1, 1, [{ property: 'id', value: query.id, filterType: 'EQ' }], [])
	const order = orderPage.content[0]
	new Vue({
		el: '#app',
		render: h => h(View, { props: { order, type }})
	})
})()

