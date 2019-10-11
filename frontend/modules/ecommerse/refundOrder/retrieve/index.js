import '../../../../scripts/common/app'

import View from './views/index.vue'
import RefundOrderTransform from '../../../../components/order/refund-order-transform.vue'
const refundOrder = App.data.domain
new Vue({
	el: '#app',
	components: {
		RefundOrderTransform
	},
	render: h => h(View, { props: { refundOrder }})
})
