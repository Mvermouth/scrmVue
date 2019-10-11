import Inventory from '../../../../../models/ecommerse/inventory'
import { tableColumnsByDomain, filterTableRowActions } from '../../../../../scripts/utils/table-utils'
import { labelActions, img } from '../../../../../scripts/utils/table-renders'

const width = App.options.styles.table.width
// 授权的操作
const permittedActions = App.data.actions || []
const rowActions = ['delete', 'update']
const filteredActions = filterTableRowActions(rowActions, permittedActions)
const options = {

	code: {
		width: width.w_10
	},
	productImage: {
		// width: 106,
		// title: '商品图片',
		// render(h, context) {
		// 	let image = 'http://s39210.m.fy.xyunqi.com/static/image/default_goods/62037_01.jpg?imageView2/2/w/600/h/600/interlace/1'
		// 	if (context.row.productImage) {
		// 		const arr = JSON.parse(context.row.productImage)
		// 		if (!_.isEmpty(arr)) {
		// 			image = arr[0]
		// 		}
		// 	}
		// 	return 	<div style='width: 70px; height: 90px;  padding:10px 0 ' >
		// 		<img src={image} style='width:100%; height:100%; borderRadius:5px'></img>
		// 	</div>
		// }
		width: width.img,
		render(h, context) {
			const url = context.row.productImage
			return img.call(this, h, context, url)
		}
	},

	'productName': {
		width: width.w_10,
		title: '商品名称',
		after: 'productImage'
	},
	'quantity': {
		width: width.w_10,
		render(h, context) {
			return <span>{context.row.quantity || 0}</span>
		}
	},
	'warehouseName': {
		width: width.w_10,
		title: '仓库',
		render(h, context) {
			return <span>{context.row.warehouseName || ''}</span>
		}
	},
	onSale: {
		width: width.w_10,
		render(h, context) {
			const name = context.row.onSale ? '上架' : '下架'
			return <span>{name}</span>
		}
	},
	_actions: filteredActions.length > 0 ? {
		title: '操作',
		width: width[`label_actions_${filteredActions.length}`],
		render(h, context) {
			return labelActions.call(this, h, context, Inventory, filteredActions)
		}
	} : false
}

export default tableColumnsByDomain(Inventory, options)
