import '../../../../scripts/common/app'
import Refund from '../../../../models/ecommerse/refund'

import formItems from './table/form-items'
import columns from './table/columns'
import View from '../../../../views/domain/page.vue'
import ViewOrderDetails from '../../../../components/order/order-details-components/view-order-details.vue'
import ViewRefundDetails from '../../../../components/order/refund-details-components/view-refund-details.vue'
new Vue({
	el: '#app',
	components: {
		ViewOrderDetails,
		ViewRefundDetails
	},
	render: h => {
		const v = h(View, { props: {
			formItems,
			columns,
			domain: Refund,
			actions: ['view']
		}})
		return <card>{v}</card>
	}
})
