import '../../../../scripts/common/app'
import View from './index.vue'

// import ViewOrderDetails from '../../../../components/order/order-details-components/view-order-details.vue'
// import ViewRefundDetails from '../../../../components/order/refund-details-components/view-refund-details.vue'
// import ApplyRefundProcess from '../../../../components/order/apply-refund-process.vue'
// import AddLogistics from '../../../../components/order/add-logistics.vue'
// import OrderTransform from '../../../../components/order/order-transform.vue'

(() => {
	new Vue({
		el: '#app',
		components: {
			// ViewOrderDetails,
			// ViewRefundDetails,
			// ApplyRefundProcess,
			// AddLogistics,
			// OrderTransform,
		},
		render: h => {
			const v = h(View)
			return <card>{v}</card>
		}
	})
})()
