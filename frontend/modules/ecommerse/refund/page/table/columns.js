import { tableColumnsByDomain } from '../../../../../scripts/utils/table-utils'
import Refund from '../../../../../models/ecommerse/refund'
import Order from '../../../../../models/ecommerse/order'
import RefundOrder from '../../../../../models/ecommerse/refundOrder'
const width = App.options.styles.table.width
const options = {
	sn: {
		width: width.w_12,
		title: '订单编号',
		render(h, context) {
			const row = context.row
			const onClick = async() => {
				const orderPage = await Order.page(1, 10, [{ property: 'id', filterType: 'EQ', value: row.paymentOrderId }], [])
				const order = orderPage.content[0]
				App.modal({
					width: 900,
					okText: '关闭',
					render: h => {
						h = this.$root.$createElement
						return <view-order-details order={order}></view-order-details>
					}
				}, 'info')
			}
			return <a onClick={onClick}><span>{row.extStr2}</span></a>
		}
	},
	amount: {
		width: width.w_16,
		title: '金额',
		render(h, context) {
			return <span>{context.row.amount}</span>
		}
	},
	refundOrderSn: {
		width: width.w_12,
		title: '售后单号',
		render(h, context) {
			const row = context.row
			const onClick = async() => {
				const orderPage = await RefundOrder.page(1, 10, [{ property: 'id', filterType: 'EQ', value: row.metadata.refundOrderId }], [])
				const order = orderPage.content[0]
				App.modal({
					width: 900,
					okText: '关闭',
					render: h => {
						h = this.$root.$createElement
						return <view-refund-details refundOrder={order}></view-refund-details>
					}
				}, 'info')
			}
			return <a onClick={onClick}><span>{row.metadata.refundOrderSn}</span></a>
		}
	},
	ctime: {
		width: width.w_16,
		title: '创建时间',
		render(h, context) {
			return <span>{dateformat(new Date(context.row.ctime), 'yyyy-mm-dd HH:MM:ss')}</span>
		}
	}
}

export default tableColumnsByDomain(Refund, options)
