import Sku from '../../../../../models/ecommerse/sku'
import { tableColumnsByDomain, filterTableRowActions } from '../../../../../scripts/utils/table-utils'
import { labelActions, img } from '../../../../../scripts/utils/table-renders'

const width = App.options.styles.table.width
const permittedActions = ['remove']
const rowActions = [{
	'remove': {
		title: '移除',
		color: '#ed3f14',
		onAction($list, { row }) {
			$list.result.content = $list.result.content.filter(it => { return it.id !== row.id })
		}
	}
}]
const filteredActions = filterTableRowActions(rowActions, permittedActions)
const options = {
	code: {
		width: width.w_10
	},
	'product.image': {
		title: '商品图片',
		width: 106,
		after: 'code',
		render(h, context) {
			const url = context.row.product.image
			return img.call(this, h, context, url)
		}
	},
	'product.name': {
		width: width.w_10,
		title: '商品名称',
		after: 'product.image',
		render(h, context) {
			return <span>{context.row.product.name}</span>
		}
	},
	_spec: {
		width: width.w_10,
		title: '商品规格',
		after: 'product.name',
		render(h, context) {
			const specArr = []
			for (let i = 1; i <= 5; i++) {
				if (context.row[`exStr${i}`]) {
					specArr.push(context.row[`exStr${i}`])
				}
			}
			return <span>{specArr.join(',')}</span>
		}
	},
	price: {
		width: width.w_6
	},
	quantity: {
		width: width.w_10,
		title: '库存',
		render: (h, context) => {
			const quantity = context.row._quantity

			let newQuantity = quantity

			// 编辑过程中记录最新值
			const onValue = value => {
				console.log('new Value:', value)
				newQuantity = value
			}

			// 编辑结束保存结果
			const onComplete = () => {
				console.log('context.row.quantity:', newQuantity)
				context.row.quantity = newQuantity
			}

			return <input-number class='w100p' value={quantity} size='small'
				on-on-change={onValue} on-on-blur={onComplete}></input-number>
		}

	},
	onSale: {
		width: width.w_10,
		render(h, context) {
			const text = context.row.onSale ? '上架' : '下架'
			return <span>{text}</span>
		}
	},
	ctime: false,
	_actions: filteredActions.length > 0 ? {
		title: '操作',
		width: width[`label_actions_${filteredActions.length}`],
		render(h, context) {
			return labelActions.call(this, h, context, Sku, filteredActions)
		}
	} : false
}

export default tableColumnsByDomain(Sku, options)
