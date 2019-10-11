import RefundOrder from '../../../../../models/ecommerse/refundOrder'
import Order from '../../../../../models/ecommerse/order'
import { tableColumnsByDomain } from '../../../../../scripts/utils/table-utils'
import { labelActions, constantText } from '../../../../../scripts/utils/table-renders'
import refundActions from '../actions'
import Constant from '../../../../../configs/constant'

import dateformat from 'dateformat'
const width = App.options.styles.table.width
// 授权的操作

const filteredActions = [
	{
		'view': {
			title: '查看',
			color: '#2d8cf0',
			onAction($list, { row, column, index }, domain) {
				App.modal({
					width: 900,
					render: h => {
						h = this.$root.$createElement
						return <view-refund-details refundOrder={row}></view-refund-details>
					}
				}, 'info')
			}
		}
	}
]
const options = {
	sn: {
		width: width.w_10,
		title: '退货编号'
	},
	orderSn: {
		width: width.w_10,
		title: '订单编号',
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
			return <a onClick={onClick}><span>{row.orderSn}</span></a>
		}
	},
	ctime: {
		width: width.datetime,
		title: '申请时间',
		render(h, context) {
			return <span>{dateformat(context.row.ctime, 'yyyy-mm-dd HH:MM:ss')}</span>
		}
	},
	type: {
		width: width.w_10,
		title: '退款类型',
		render(h, context) {
			const type = context.row.type
			return constantText.call(this, h, context, type, Constant.RefundOrderType)
		}
	},
	refundAmount: {
		width: width.w_8,
		title: '退款金额',
		render(h, context) {
			return <span>{context.row.refundAmount}</span>
		}
	},
	platformUid: {
		width: width.w_12,
		title: '退款用户',
		render(h, context) {
			return <span>{context.row.platformUid}</span>
		}
	},
	status: {
		width: width.w_8,
		title: '状态',
		render(h, context) {
			const status = context.row.status
			if (context.row.type === Constant.RefundOrderType.refund.value) {
				return constantText.call(this, h, context, status, Constant.RefundStatus)
			} else if (context.row.type === Constant.RefundOrderType.return.value) {
				return constantText.call(this, h, context, status, Constant.ReShiptatus)
			}
		}
	},
	internalRemark: false,
	_actions: filteredActions.length > 0 ? {
		title: '操作',
		width: width.w_16,
		render(h, context) {
			const actions = []
			!_.isEmpty(context.row.orderActions) && context.row.orderActions.map(it => {
				actions.push({
					it: refundActions[it]
				})
			})
			return labelActions.call(this, h, context, RefundOrder, _.concat(actions, filteredActions))
		}
	} : false
}

export default tableColumnsByDomain(RefundOrder, options)
