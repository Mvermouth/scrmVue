import '../../../../scripts/common/app'

import Payment from '../../../../models/ecommerse/payment'
import formItems from './form/form-items'
import Order from '../../../../models/ecommerse/order'
import View from '../../../../views/domain/create.vue'
import Constant from '../../../../configs/constant'
const create = async data => {
	// data.value = data.value.map(it => { return { name: it.name } })
	// data.value = JSON.stringify(data.value)
	// return Spec.create(data)
	const orderPage = await Order.page(1, 1, [{ filterType: 'EQ', property: 'sn', value: data.sn }])
	if (_.isEmpty(orderPage.content)) {
		this.$Message.error('未找到该订单编号')
		return
	}
	const order = orderPage.content[0]
	if (order.payStatus === Constant.PayStatus.Payed) {
		this.$Message.error('该订单已经支付!请勿重复付款!')
		return
	}
	data.orderId = order.id
	const result = await Payment.createQrcode(data)
	App.modal({
		width: 400,
		title: '支付二维码',
		closable: false,
		render: h => {
			// h = this.$root.$createElement
			const style = { width: '100%' }
			const cardStyle = { width: '300px', height: '360px', display: 'table-cell', 'vertical-align': 'middle', 'text-align': 'center' }
			return <card style = {cardStyle}><img style = {style} src ={result}/></card>
		},
		onOk: async(OrderTransform) => {
			await OrderTransform.submit()
			App.removeModal()
		}
	})
}
new Vue({
	el: '#app',
	render: h => {
		const v = h(View, { props: {
			domain: Payment,
			formItems,
			formProps: {
				labelWidth: 120
			},
			create
		}})
		return App.target === 'dialog' ? v : <card>{v}</card>
	}
})
