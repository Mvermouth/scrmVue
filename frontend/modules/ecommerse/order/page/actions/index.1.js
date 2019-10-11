import Order from '../../../../../models/ecommerse/order'
import OrderState from '../../../../../../share/OrderState'
import FrontendOrderState from '../../../../../../share/FrontendOrderState'

let actionName = null;
let actionMap = FrontendOrderState.actionMap;

const actions = {}

actionName = OrderState.roleAudits.verify;
actions[actionName] = {
	title: actionMap[actionName].title,
	color: '#2d8cf0',
	onAction($list, order) {
		const action = OrderState.roleAudits.verify;
		App.modal({
			width: 400,
			title: '提示',
			render: h => {
				h = this.$root.$createElement
				// return <order-action-view action={action} order={order}></order-action-view>
				return <order-transform content='确定审核通过么？' action='confirm' order={order}></order-transform>
			},
			onOk: async(OrderTransform) => {
				await OrderTransform.submit()
				App.event.$emit(Order.events.Update)
			}
		})
	}
}

actionName = OrderState.roleAudits.refuse
actions[actionName] = {
	title: actionMap[actionName].title,
	color: '#2d8cf0',
	onAction($list, order) {
		App.modal({
			width: 400,
			title: '提示',
			render: h => {
				h = this.$root.$createElement
				return <order-transform content='操作后该订单将变成失效订单，确定要执行？' action='unconfirm' order={order}></order-transform>
			},
			onOk: async(OrderTransform) => {
				await OrderTransform.submit()
				App.event.$emit(Order.events.Update)
			}
		})
	}
}
actions[OrderState.roleAudits.cancel] = {
	title: '关闭',
	color: '#2d8cf0',
	onAction($list, order) {
		App.modal({
			width: 400,
			title: '提示',
			render: h => {
				h = this.$root.$createElement
				return <order-transform content='操作后该订单将会被取消，确定要执行？' action='cancel' order={order}></order-transform>
			},
			onOk: async(OrderTransform) => {
				await OrderTransform.submit()
				App.event.$emit(Order.events.Update)
			}
		})
	}
}

actionName = OrderState.roleLogistics.delivery;
actions[actionName] = {
	title: actionMap[actionName].title,
	color: '#2d8cf0',
	onAction($list, order) {
		App.modal({
			width: 500,
			title: actionMap[OrderState.roleLogistics.delivery].title,
			render: h => {
				h = this.$root.$createElement
				return <add-logistics order={order}></add-logistics>
			},
			onOk: async(AddLogistics) => {
				await AddLogistics.submit('delivery')
				App.event.$emit(Order.events.Update)
			}
		})
	}
}

actionName = OrderState.roleLogistics.cancel;
actions[actionName] = {
	title: actionMap[actionName].title,
	color: '#2d8cf0',
	onAction($list, order) {
		App.modal({
			width: 500,
			title: actionMap[OrderState.roleLogistics.cancel].title,
			render: h => {
				h = this.$root.$createElement
				return <div> 功能待实现 </div>
			},
			onOk: async(AddLogistics) => {
			}
		})
	}
}

actionName = OrderState.roleLogistics.distribution;
actions[actionName] = {
	title: actionMap[actionName].title,
	color: '#2d8cf0',
	onAction($list, order) {
		App.modal({
			width: 500,
			title: actionMap[OrderState.roleLogistics.distribution].title,
			render: h => {
				h = this.$root.$createElement
				return <div> 功能待实现 </div>
			},
			onOk: async(AddLogistics) => {
			}
		})
	}
}

actionName = OrderState.roleLogistics.partDelivery;
actions[actionName] = {
	title: actionMap[actionName].title,
	color: '#2d8cf0',
	onAction($list, order) {
		App.modal({
			width: 500,
			title: actionMap[OrderState.roleLogistics.partDelivery].title,
			render: h => {
				h = this.$root.$createElement
				return <div> 功能待实现 </div>
			},
			onOk: async(AddLogistics) => {
			}
		})
	}
}

actionName = OrderState.roleLogistics.delivery;
actions[actionName] = {
	title: actionMap[actionName].title,
	color: '#2d8cf0',
	onAction($list, order) {
		App.modal({
			width: 500,
			title: actionMap[OrderState.roleLogistics.delivery].title,
			render: h => {
				h = this.$root.$createElement
				return <div> 功能待实现 </div>
			},
			onOk: async(AddLogistics) => {
			}
		})
	}
}

actionName = OrderState.roleLogistics.partsSign;
actions[actionName] = {
	title: actionMap[actionName].title,
	color: '#2d8cf0',
	onAction($list, order) {
		App.modal({
			width: 500,
			title: actionMap[OrderState.roleLogistics.partsSign].title,
			render: h => {
				h = this.$root.$createElement
				return <div> 功能待实现 </div>
			},
			onOk: async(AddLogistics) => {
			}
		})
	}
}

actionName = OrderState.roleLogistics.sign;
actions[actionName] = {
	title: actionMap[actionName].title,
	color: '#2d8cf0',
	onAction($list, order) {
		App.modal({
			width: 500,
			title: actionMap[OrderState.roleLogistics.sign].title,
			render: h => {
				h = this.$root.$createElement
				return <div> 功能待实现 </div>
			},
			onOk: async(AddLogistics) => {
			}
		})
	}
}

actions['delivery'] = {
	title: '发货',
	color: '#2d8cf0',
	onAction($list, order) {
		App.modal({
			width: 500,
			title: '发货',
			render: h => {
				h = this.$root.$createElement
				return <add-logistics order={order}></add-logistics>
			},
			onOk: async(AddLogistics) => {
				await AddLogistics.submit('delivery')
				App.event.$emit(Order.events.Update)
			}
		})
	}
}
actions['undelivery'] = {
	title: '撤销发货',
	color: '#2d8cf0',
	onAction($list, order) {
		App.modal({
			width: 400,
			title: '提示',
			render: h => {
				h = this.$root.$createElement
				return <order-transform content='撤销发货订单将进入待发货状态，确认执行吗？' action='undelivery' order={order} ></order-transform >
			},
			onOk: async(OrderTransform) => {
				await OrderTransform.submit()
				App.event.$emit(Order.events.Update)
			}
		})
	}
}
actions['complete'] = {
	title: '完成',
	color: '#2d8cf0',
	onAction($list, order) {
		App.modal({
			width: 400,
			title: '提示',
			render: h => {
				h = this.$root.$createElement
				return <order-transform content='确定客户已经签收?' action='complete' order={order}></order-transform>
			},
			onOk: async(OrderTransform) => {
				await OrderTransform.submit()
				App.event.$emit(Order.events.Update)
			}
		})
	}
}

actionName = OrderState.roleSale.amend;
actions[actionName] = {
	title: actionMap[actionName].title,
	color: '#2d8cf0',
	onAction($list, order) {
		App.modal({
			width: 500,
			title: actionMap[OrderState.roleSale.amend].title,
			render: h => {
				h = this.$root.$createElement
				return <div> 功能待实现 </div>
			},
			onOk: async(AddLogistics) => {
			}
		})
	}
}

actionName = OrderState.roleSale.cancel;
actions[actionName] = {
	title: actionMap[actionName].title,
	color: '#2d8cf0',
	onAction($list, order) {
		App.modal({
			width: 500,
			title: actionMap[OrderState.roleSale.cancel].title,
			render: h => {
				h = this.$root.$createElement
				return <div> 功能待实现 </div>
			},
			onOk: async(AddLogistics) => {
			}
		})
	}
}

actionName = OrderState.roleFinance.partPay;
actions[actionName] = {
	title: actionMap[actionName].title,
	color: '#2d8cf0',
	onAction($list, order) {
		App.modal({
			width: 500,
			title: actionMap[OrderState.roleFinance.partPay].title,
			render: h => {
				h = this.$root.$createElement
				return <div> 功能待实现 </div>
			},
			onOk: async(AddLogistics) => {
			}
		})
	}
}

actionName = OrderState.roleFinance.pay;
actions[actionName] = {
	title: actionMap[actionName].title,
	color: '#2d8cf0',
	onAction($list, order) {
		App.modal({
			width: 500,
			title: actionMap[OrderState.roleFinance.pay].title,
			render: h => {
				h = this.$root.$createElement
				return <div> 功能待实现 </div>
			},
			onOk: async(AddLogistics) => {
			}
		})
	}
}

export default actions

