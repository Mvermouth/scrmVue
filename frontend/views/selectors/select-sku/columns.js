import Sku from '../../../models/ecommerse/sku'

import { tableColumnsByDomain } from '../../../scripts/utils/table-utils'

const width = App.options.styles.table.width

const options = {
	code: {
		width: width.w_10
	},
	'product.image': {
		width: 106,
		title: '商品图片',
		after: 'code',
		render(h, context) {
			const image = 'http://s39210.m.fy.xyunqi.com/static/image/default_goods/62037_01.jpg?imageView2/2/w/600/h/600/interlace/1'
			return 	<div style='width: 70px; height: 90px;  padding:10px 0 ' >
				<img src={context.row.product.image || image} style='width:100%; height:100%; borderRadius:5px'></img>
			</div>
		}
	},

	'product.name': {
		width: width.w_6,
		title: '商品名称',
		after: 'product.image',
		render(h, context) {
			return <span>{context.row.product.name}</span>
		}
	},

	_spec: {
		width: width.w_8,
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
		width: width.w_5
	},

	marketPrice: {
		width: width.w_5
	},

	'inventory.quantity': {
		width: width.w_5,
		title: '库存',
		render(h, context) {
			return <span>{context.row.inventory.quantity}</span>
		}
	},

	costPrice: false,
	onSale: false

}

export default tableColumnsByDomain(Sku, options)
