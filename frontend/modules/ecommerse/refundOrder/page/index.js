import '../../../../scripts/common/app'
import RefundOrder from '../../../../models/ecommerse/refundOrder'
import formItems from './table/form-items'
import columns from './table/columns'
import View from '../../../../views/domain/tabs-page.vue'
import ViewRefundDetails from '../../../../components/order/refund-details-components/view-refund-details.vue'
import RefundOrderTransform from '../../../../components/order/refund-order-transform.vue'
import ViewOrderDetails from '../../../../components/order/order-details-components/view-order-details.vue'
import Constant from '../../../../configs/constant'

const defaultSort = [
	{
		'ignoreCase': false,
		'property': 'ctime',
		'type': 'DSC'
	}
]
// 动态获取订单类型
const createTabs = () => {
	const refundStatus = Constant.RefundStatus
	const keys = Object.keys(Constant.RefundStatus)
	const tabs = keys.map(it => {
		return {
			name: refundStatus[it].value,
			label: refundStatus[it].text,
			columns,
			defaultSort,
			defaultCriterias: [
				{
					filterType: 'EQ',
					property: 'status',
					value: refundStatus[it].value
				}
			],
			actions: ['view']
		}
	})
	// 追加所有显示所有订单列表的类型（all）
	tabs.unshift(
		{
			name: 'all',
			label: '全部',
			columns,
			defaultSort,
			actions: ['view']
		}
	)
	return tabs
}
(() => {
	const tabs = createTabs()
	new Vue({
		el: '#app',
		components: {
			ViewRefundDetails,
			RefundOrderTransform,
			ViewOrderDetails
		},
		render: h => {
			const v = h(View, { props: {
				formItems,
				formProps: {
					labelWidth: 150
				},
				domain: RefundOrder,
				tabs: tabs
			}})
			return <card>{v}</card>
		}
	})
})()

