import Inventory from '../../../models/ecommerse/inventory'

import { tableColumnsByDomain } from '../../../scripts/utils/table-utils'
import { img, longText, price, yesNo } from '../../../scripts/utils/table-renders'

const width = App.options.styles.table.width

const options = {
	productName: {
		align: 'left',
		width: width.w_8,
		render(h, context) {
			return longText.call(this, h, context, context.row.productName, true)
		}
	},
	productImage: {
		width: width.w_6,
		render(h, context) {
			const url = context.row.productImage
			return img.call(this, h, context, url)
		}
	},
	code: {
		align: 'left',
		width: width.w_6
	},
	specDesc: {
		align: 'left',
		width: width.w_6
	},
	price: {
		width: width.w_6,
		render(h, context) {
			return price.call(this, h, context, context.row.price)
		}
	},
	quantity: {
		width: width.w_6,
		after: 'price',
		render(h, context) {
			return <span>{context.row.quantity}</span>
		}
	},
	warehouseName: {
		width: width.w_6
	},
	onSale: {
		width: width.w_6,
		render(h, context) {
			return yesNo.call(this, h, context, context.row.onSale)
		}
	}
}

export default tableColumnsByDomain(Inventory, options)
