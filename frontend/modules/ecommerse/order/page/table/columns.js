import Order from '../../../../../models/ecommerse/order'

import { tableColumnsByDomain, filterTableRowActions } from '../../../../../scripts/utils/table-utils'
import { labelActions, constantText } from '../../../../../scripts/utils/table-renders'
import dateformat from 'dateformat'
import Constant from '../../../../../configs/constant'
// import dict from '../../../../../lang'
import AppRoutes from '../../../../../configs/AppRoutes'
import AppProxy from '../../../../../scripts/common/appProxy'
import orderActions from '../actions/index2'
const width = App.options.styles.table.width
// 授权的操作
const permittedActions = App.data.actions || []
console.log('permittedAction:', permittedActions)
const rowActions = [
	{
		'update': {
			title: '编辑',
			color: '#2d8cf0'
		}
	}
]
const filteredActions = _.concat(filterTableRowActions(rowActions, permittedActions), [
	{
		'view': {
			title: '查看',
			color: '#2d8cf0',
			onAction($list, { row, column, index }, domain) {
				App.modal({
					width: 900,
					okText: '关闭',
					render: h => {
						h = this.$root.$createElement
						return <view-order-details order={row}></view-order-details>
					}
				}, 'info')
			}
		}
	},
	{
		'refund': {
			title: '申请退款',
			color: '#2d8cf0',
			onAction($list, { row, column, index }, domain) {
				AppProxy.do_push(AppRoutes.OrderRefund.id(row.id, row.sn))
			}
		}
	}
])

const options = {
	sn: {
		width: width.w_10,
		render(h, context) {
			return <span>{context.row.sn}</span>
		}
	},
	_creatorName: {
		width: width.w_12,
		title: '下单人',
		after: 'platformId',
		render(h, context) {
			const metadata = context.row.metadata
			let nameAndSn = ''
			if (metadata) {
				if (metadata.createName && metadata.createSn) {
					nameAndSn = `${metadata.createName}(${metadata.createSn})`
				}
			}
			return <span>{nameAndSn}</span>
		}
	},
	_comName: {
		width: width.w_10,
		title: '归属平台账号',
		after: '_creatorName',
		render(h, context) {
			const ownerName = context.row.orderExtStr4
			return <span>{ownerName}</span>
		}
	},
	_cusName: {
		width: width.w_10,
		title: '客户平台账号',
		after: '_comName',
		render(h, context) {
			const cusName = context.row.orderExtStr1
			return <span>{cusName}</span>
		}
	},
	_productsAmount: {
		width: width.w_10,
		title: '商品金额(元)',
		after: '_cusName',
		render(h, context) {
			const productsAmount = context.row.productsAmount
			return <span>{productsAmount}</span>
		}
	},
	_discountAmount: {
		width: width.w_10,
		title: '优惠金额(元)',
		after: '_productsAmount',
		render(h, context) {
			const amount = context.row.discountAmount
			return <span>{amount}</span>
		}
	},
	_shipFee: {
		width: width.w_10,
		title: '运费(元)',
		after: '_discountAmount',
		render(h, context) {
			const amount = context.row.shipFee
			return <span>{amount}</span>
		}
	},
	_totalAmount: {
		width: width.w_10,
		title: '总金额(元)',
		after: '_shipFee',
		render(h, context) {
			const amount = context.row.totalAmount
			return <span>{amount}</span>
		}
	},
	_ctime: {
		width: width.w_12,
		title: '创建时间',
		after: 'clientRemark',
		render(h, context) {
			const ctime = context.row.ctime
			const realTime = dateformat(new Date(ctime), 'yyyy-mm-dd HH:MM:ss')
			return <span>{realTime}</span>
		}
	},
	orderType: false,
	orderStatus: {
		width: width.w_10,
		render(h, context) {
			return constantText.call(this, h, context, context.row.orderStatus, Constant.OrderStatus)
		}
	},
	shipStatus: {
		width: width.w_10,
		render(h, context) {
			const direction = context.row.shipStatus
			return constantText.call(this, h, context, direction, Constant.ShipStatus)
		}
	},
	payStatus: {
		width: width.w_10,
		render(h, context) {
			const payStatus = context.row.payStatus
			return constantText.call(this, h, context, payStatus, Constant.PayStatus)
		}
	},
	platformId: false,
	clientRemark: {
		width: width.w_12
	},
	// _detail: {
	// 	width: width.w_7,
	// 	title: '详情',
	// 	render(h, context) {
	// 		return
	// 	}
	// },
	'address.mobile': {
		width: width.w_12,
		title: '收件人电话'
	},
	'address.consignee': {
		width: width.w_12,
		title: '收货人姓名'
	},
	_addressInfo: {
		title: '收货地址',
		width: width.w_18,
		after: 'address.consignee',
		render(h, context) {
			const addressInfo = context.row.address
			const text = addressInfo.country + addressInfo.state + addressInfo.city + addressInfo.district + addressInfo.address
			return <span>{text}</span>
		}
	},
	_actions: filteredActions.length > 0 ? {
		title: '操作',
		width: width.w_18,
		render(h, context) {
			const actions = []
			!_.isEmpty(context.row.orderActions) && context.row.orderActions.map(it => {
				actions.push({
					it: orderActions[it]
				})
			})
			const orderStatus = context.row.orderStatus
			let finalActions = _.cloneDeep(filteredActions)
			if (orderStatus === Constant.OrderStatus.Cancel.value || orderStatus === Constant.OrderStatus.Completed.value) {
				finalActions = _.filter(finalActions, it => { return !it['refund'] })
			}
			if (orderStatus === Constant.OrderStatus.Delivering.value || orderStatus === Constant.OrderStatus.Delivered.value ||
				orderStatus === Constant.OrderStatus.Completed.value || orderStatus === Constant.OrderStatus.Cancel.value) {
				finalActions = _.filter(finalActions, it => { return !it['update'] })
			}
			return labelActions.call(this, h, context, Order, _.concat(actions, finalActions))
		}
	} : false
}

export default tableColumnsByDomain(Order, options)
