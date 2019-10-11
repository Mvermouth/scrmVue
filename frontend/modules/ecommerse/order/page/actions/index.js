import Order from '../../../../../models/ecommerse/order'
import Constants from "../../../../../../lib/Constants"
import AppProxy from "../../../../../scripts/common/appProxy";
import AppRoutes from "../../../../../configs/AppRoutes";
import Vue from 'vue'

const actions = {}
actions[Constants.OrderAction.confirm.value] = {
	title: '审核通过',
	color: '#2d8cf0',
	onAction($list, order) {
		App.modal({
			width: 400,
			title: '提示',
			render: h => {
				h = this.$root.$createElement
				return <order-transform content='确定审核通过么？' 
					action={Constants.OrderAction.confirm.value} 
					order={order}></order-transform>
			},
			onOk: async(OrderTransform) => {
				await OrderTransform.submit()
				App.event.$emit(Order.events.Update)
			}
		})
	}
}
actions[Constants.OrderAction.unconfirm.value] = {
	title: '审核拒绝',
	color: '#fd4337',
	onAction($list, order) {
		App.modal({
			width: 400,
			title: '提示',
			render: h => {
				h = this.$root.$createElement
				return <order-transform content='操作后该订单将变成失效订单，确定要执行？' 
					action={Constants.OrderAction.unconfirm.value}
					order={order}></order-transform>
			},
			onOk: async(OrderTransform) => {
				await OrderTransform.submit()
				App.event.$emit(Order.events.Update)
			}
		})
	}
}
actions[Constants.OrderAction.cancel.value] = {
	title: '关闭',
	color: '#fd4337',
	onAction($list, order) {
		App.modal({
			width: 400,
			title: '提示',
			render: h => {
				h = this.$root.$createElement
				return <order-transform content='操作后该订单将会被取消，确定要执行？' 
					action={Constants.OrderAction.cancel.value} 
					order={order}></order-transform>
			},
			onOk: async(OrderTransform) => {
				await OrderTransform.submit()
				App.event.$emit(Order.events.Update)
			}
		})
	}
}
actions[Constants.OrderAction.delivery.value] = {
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
actions[Constants.OrderAction.undelivery.value] = {
	title: '仓库签收',
	color: '#fd4337',
	onAction($list, order) {
		App.modal({
			width: 400,
			title: '提示',
			render: h => {
				h = this.$root.$createElement
				return <order-transform content='确认仓库签收到货物？' 
					action={Constants.OrderAction.undelivery.value} 
					order={order} ></order-transform >
			},
			onOk: async(OrderTransform) => {
				await OrderTransform.submit()
				App.event.$emit(Order.events.Update)
			}
		})
	}
}
actions[Constants.OrderAction.complete.value] = {
	title: Constants.OrderAction.complete.text,
	color: '#2d8cf0',
	onAction($list, order) {
		App.modal({
			width: 400,
			title: '提示',
			render: h => {
				h = this.$root.$createElement
				return <order-transform content='确定订单已完成?' 
					action={Constants.OrderAction.complete.value} 
					order={order}></order-transform>
			},
			onOk: async(OrderTransform) => {
				const overTime = (new Date().getTime() - order.mtime) > 7 * 24 * 60 * 60 * 1000
				if (!overTime) {
					Vue.prototype.$Notice.error({
						title: '警告',
						desc: `已回款订单关闭需要超过7天`
					})
					return;
				}
				await OrderTransform.submit()
				App.event.$emit(Order.events.Update)
			}
		})
	}
}

actions[Constants.OrderAction.receive_delivery.value] = {
	title: Constants.OrderAction.receive_delivery.text,
	color: '#2d8cf0',
	onAction($list, order) {
		App.modal({
			width: 400,
			title: '提示',
			render: h => {
				h = this.$root.$createElement
				return <order-transform content='确定客户已经签收?' 
					action={Constants.OrderAction.receive_delivery.value} 
					order={order}>
				</order-transform>
			},
			onOk: async(OrderTransform) => {
				await OrderTransform.submit()
				App.event.$emit(Order.events.Update)
			}
		})
	}
}
actions[Constants.OrderAction.exception.value] = {
	title: Constants.OrderAction.exception.text,
	color: '#2d8cf0',
	onAction($list, order) {
		App.modal({
			width: 400,
			title: '设置问题订单',
			render: h => {
				h = this.$root.$createElement
				return <order-transform content='  '
					action={Constants.OrderAction.exception.value} 
					des
					desForce
					desErr="必须为订单添加问题描述"
					order={order}>
				</order-transform>
			},
			onOk: async(OrderTransform) => {
				await OrderTransform.submit()
				App.event.$emit(Order.events.Update)
			}
		})
	}
}
actions[Constants.OrderAction.confirm_pay.value] = {
	title: Constants.OrderAction.confirm_pay.text,
	color: '#2d8cf0',
	onAction($list, order) {
		App.modal({
			width: 400,
			title: '提示',
			render: h => {
				h = this.$root.$createElement
				return <order-transform content='确定订单已回款?' 
					action={Constants.OrderAction.confirm_pay.value} 
					order={order}>
				</order-transform>
			},
			onOk: async(OrderTransform) => {
				await OrderTransform.submit()
				App.event.$emit(Order.events.Update)
			}
		})
	}
}
actions[Constants.OrderAction.partial_pay.value] = {
	title: "编辑支付",
	color: "#2d8cf0",
	onAction($list, order) {
		App.push(AppRoutes.Order.update(order.id));
	}
}
actions[Constants.OrderAction.pay.value] = {
	title: "支付",
	color: "#2d8cf0",
	onAction($list, order) {
		App.push(AppRoutes.Order.update(order.id));
	}
}


actions[Constants.OrderAction.view.value] = {
	title: Constants.OrderAction.view.text,
	color: '#2d8cf0',
	onAction($list, order) {
		App.modal({
				width: 900,
				okText: "关闭",
				"footer-hide": true,
				render: h => {
					h = this.$root.$createElement;
					return <view-order-details order={order} />;
				}
			},
			"info"
		);
		//location.href = '/ecommerse/order/export'
	}
}

actions[Constants.OrderAction.update.value] = {
	title: "编辑订单",
	color: "#2d8cf0",
	onAction($list, order) {
		App.push(AppRoutes.Order.update(order.id));
	}
}
actions[Constants.OrderAction.refund.value] = {
	title: "退款",
	color: "#2d8cf0",
	onAction($list, order) {
		AppProxy.do_push(AppRoutes.OrderRefund.id(order.id, order.sn, "refund"));
	}
}

actions[Constants.OrderAction.return.value] = {
	title: "退款退货",
	color: "#fd4337",
	onAction($list, order) {
		AppProxy.do_push(AppRoutes.OrderRefund.id(order.id, order.sn, "return"));
	}
}

export default actions

