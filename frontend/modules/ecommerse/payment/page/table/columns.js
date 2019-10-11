import { tableColumnsByDomain } from '../../../../../scripts/utils/table-utils'
import Payment from '../../../../../models/ecommerse/payment'
import Order from '../../../../../models/ecommerse/order'
import { constantText } from '../../../../../scripts/utils/table-renders'
import Constant from '../../../../../configs/constant'
const width = App.options.styles.table.width
const options = {
	sn: {
		width: width.w_10,
		title: '订单编号',
		before: 'channel',
		render(h, context) {
			const row = context.row
			const onClick = async() => {
				const orderPage = await Order.page(1, 10, [{ property: 'id', filterType: 'EQ', value: row.orderId }], [])
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
	channel: {
		width: width.w_12,
		render(h, context) {
			const type = context.row.channel
			return constantText.call(this, h, context, type, Constant.PaymentChannel)
		}
	},
	ctime: {
		width: width.w_12,
		render(h, context) {
			return <span>{dateformat(new Date(context.row.ctime), 'yyyy-mm-dd HH:MM:ss')}</span>
		}
	}
}

export default tableColumnsByDomain(Payment, options)
