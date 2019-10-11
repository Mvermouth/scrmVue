const actions = {}
actions['confirm'] = {
	title: '审核通过',
	color: '#2d8cf0',
	onAction($list, { row, column, index }, domain) {
		let RefundOrderTransform
		App.modal({
			width: 400,
			title: '提示',
			render: h => {
				h = this.$root.$createElement
				RefundOrderTransform = <refund-order-transform content='确定审核通过？' action='confirm' refundOrder={row}></refund-order-transform>
				return RefundOrderTransform
			},
			onOk: async() => {
				await RefundOrderTransform.componentInstance.submit()
				$list.load()
			}
		})
	}
}
actions['unconfirm'] = {
	title: '拒绝',
	color: '#2d8cf0',
	onAction($list, { row, column, index }, domain) {
		let RefundOrderTransform
		App.modal({
			width: 400,
			title: '提示',
			render: h => {
				h = this.$root.$createElement
				RefundOrderTransform = <refund-order-transform content='确定拒绝退款？' action='unconfirm' refundOrder={row}></refund-order-transform>
				return RefundOrderTransform
			},
			onOk: async() => {
				await RefundOrderTransform.componentInstance.submit()
				$list.load()
			}
		})
	}
}
actions['refund'] = {
	title: '同意退款',
	color: '#2d8cf0',
	onAction($list, { row, column, index }, domain) {
		let RefundOrderTransform
		App.modal({
			width: 400,
			title: '提示',
			render: h => {
				h = this.$root.$createElement
				RefundOrderTransform = <refund-order-transform content='确定同意退款？' action='refund' refundOrder={row}></refund-order-transform>
				return RefundOrderTransform
			},
			onOk: async() => {
				await RefundOrderTransform.componentInstance.submit()
				$list.load()
			}
		})
	}
}
actions['unrefund'] = {
	title: '拒绝退款',
	color: '#2d8cf0',
	onAction($list, { row, column, index }, domain) {
		let RefundOrderTransform
		App.modal({
			width: 400,
			title: '提示',
			render: h => {
				h = this.$root.$createElement
				RefundOrderTransform = <refund-order-transform content='审核通过之后，是否拒绝退款？' action='unrefund' refundOrder={row}></refund-order-transform>
				return RefundOrderTransform
			},
			onOk: async() => {
				await RefundOrderTransform.componentInstance.submit()
				$list.load()
			}
		})
	}
}

export default actions
