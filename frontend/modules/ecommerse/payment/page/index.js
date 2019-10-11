import '../../../../scripts/common/app'
import Payment from '../../../../models/ecommerse/payment'

import formItems from './table/form-items'
import columns from './table/columns'
import View from '../../../../views/domain/page.vue'
import ViewOrderDetails from '../../../../components/order/order-details-components/view-order-details.vue'
const defaultCriterias = [{
	property: 'paid',
	filterType: 'EQ',
	value: true
}]
new Vue({
	el: '#app',
	components: {
		ViewOrderDetails
	},
	render: h => {
		const v = h(View, { props: {
			formItems,
			columns,
			domain: Payment,
			defaultCriterias,
			actions: ['view', 'create']
		}})
		return <card>{v}</card>
	}
})
