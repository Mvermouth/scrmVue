const actions = {}
actions['commit'] = {
	title: '提交审核',
	color: '#2d8cf0',
	onAction($list, { row, column, index }, domain) {
		console.log('list:', $list)
		let OrderTransform
		App.modal({
			width: 400,
			title: '提示',
			render: h => {
				h = this.$root.$createElement
				OrderTransform = <order-transform content='确定重新提交审核？' action='commit' order={row}></order-transform>
				return OrderTransform
			},
			onOk: async () => {
				await OrderTransform.componentInstance.submit()
				$list.load()
			}
		})
	}
}
actions['confirm'] = {
	title: '审核',
	color: '#2d8cf0',
	onAction($list, { row, column, index }, domain) {
		let OrderTransform
		App.modal({
			width: 400,
			title: '提示',
			render: h => {
				h = this.$root.$createElement
				OrderTransform = <order-transform content='确定审核通过么？' action='confirm' order={row}></order-transform>
				return OrderTransform
			},
			onOk: async () => {
				await OrderTransform.componentInstance.submit()
				$list.load()
			}
		})
	}
}
actions['unconfirm'] = {
	title: '拒绝',
	color: '#2d8cf0',
	onAction($list, { row, column, index }, domain) {
		let OrderTransform
		App.modal({
			width: 400,
			title: '提示',
			render: h => {
				h = this.$root.$createElement
				OrderTransform = <order-transform content='操作后该订单将变成失效订单，确定要执行？' action='unconfirm' order={row}></order-transform>
				return OrderTransform
			},
			onOk: async () => {
				await OrderTransform.componentInstance.submit()
				$list.load()
			}
		})
	}
}
actions['cancel'] = {
	title: '取消',
	color: '#2d8cf0',
	onAction($list, { row, column, index }, domain) {
		let OrderTransform
		App.modal({
			width: 400,
			title: '提示',
			render: h => {
				h = this.$root.$createElement
				OrderTransform = <order-transform content='操作后该订单将会被取消，确定要执行？' action='cancel' order={row}></order-transform>
				return OrderTransform
			},
			onOk: async () => {
				await OrderTransform.componentInstance.submit()
				$list.load()
			}
		})
	}
}
actions['delivery'] = {
	title: '发货',
	color: '#2d8cf0',
	onAction($list, { row, column, index }, domain) {
		let AddLogistics
		App.modal({
			width: 500,
			title: '发货',
			render: h => {
				h = this.$root.$createElement
				AddLogistics = <add-logistics order={row}></add-logistics>
				return AddLogistics
			},
			onOk: async () => {
				await AddLogistics.componentInstance.submit($list, 'delivery')
				$list.load()
			}
		})
	}
}
actions['undelivery'] = {
	title: '撤销发货',
	color: '#2d8cf0',
	onAction($list, { row, column, index }, domain) {
		let OrderTransform
		App.modal({
			width: 400,
			title: '提示',
			render: h => {
				h = this.$root.$createElement
				OrderTransform = <order-transform content='撤销发货之后系统将不再发货，确定要执行吗？' action='undelivery' order={row}></order-transform>
				return OrderTransform
			},
			onOk: async () => {
				await OrderTransform.componentInstance.submit()
				$list.load()
			}
		})
	}
}
actions['receive'] = {
	title: '签收',
	color: '#2d8cf0',
	onAction($list, { row, column, index }, domain) {
		let OrderTransform
		App.modal({
			width: 400,
			title: '提示',
			render: h => {
				h = this.$root.$createElement
				OrderTransform = <order-transform content='确定客户已经签收？' action='receive' order={row}></order-transform>
				return OrderTransform
			},
			onOk: async () => {
				await OrderTransform.componentInstance.submit()
				$list.load()
			}
		})
	}
}
actions['complete'] = {
	title: '订单结束',
	color: '#2d8cf0',
	onAction($list, { row, column, index }, domain) {
		let OrderTransform
		App.modal({
			width: 400,
			title: '提示',
			render: h => {
				h = this.$root.$createElement
				OrderTransform = <order-transform content='确定订单结束' action='complete' order={row}></order-transform>
				return OrderTransform
			},
			onOk: async () => {
				await OrderTransform.componentInstance.submit()
				$list.load()
			}
		})
	}
}
actions['uncomplete'] = {
	title: '取消完成',
	color: '#2d8cf0',
	onAction($list, { row, column, index }, domain) {
		let OrderTransform
		App.modal({
			width: 400,
			title: '提示',
			render: h => {
				h = this.$root.$createElement
				OrderTransform = <order-transform content='执行该操作表示订单进入异常，确认要执行该操作吗？' action='uncomplete' order={row}></order-transform>
				return OrderTransform
			},
			onOk: async () => {
				await OrderTransform.componentInstance.submit()
				$list.load()
			}
		})
	}
}

export default actions

