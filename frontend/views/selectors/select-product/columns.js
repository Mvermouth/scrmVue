import Product from '../../../models/ecommerse/product'
import { tableColumnsByDomain } from '../../../scripts/utils/table-utils'
import { img, price } from '../../../scripts/utils/table-renders'
const width = App.options.styles.table.width
const options = {
	image: {
		width: width.img,
		render(h, context) {
			const url = context.row.image
			return img.call(this, h, context, url)
		}
	},
	name: {
		width: width.w_12,
		render(h, context) {
			return <span>{context.row.name}</span>
		}
	},
	sn: {
		width: width.w_10
	},
	description: {
		width: width.w_12
	},
	brief: {
		width: width.w_16
	},
	brand: {
		width: width.w_12,
		title: '品牌',
		after: 'brief',
		render(h, context) {
			let name = ''
			if (context.row.brand) {
				name = context.row.brand.name
			}
			return <span>{name}</span>
		}
	},
	categories: {
		width: width.w_12,
		title: '分类',
		after: 'brand',
		render(h, context) {
			let name = ''
			if (!_.isEmpty(context.row.categories)) {
				const categories = context.row.categories.map(it => { return it.name })
				name = categories.join(',')
			}
			return <span>{name}</span>
		}
	},
	marketPrice: {
		width: width.price,
		render(h, context) {
			return price.call(this, h, context, context.row.marketPrice)
		}
	},
	price: {
		width: width.price,
		render(h, context) {
			return price.call(this, h, context, context.row.price)
		}
	},
	tags: {
		width: width.w_12,
		render(h, context) {
			return <span>{context.row.tags.join(',')}</span>
		}
	},
	ctime: {
		width: width.datetime,
		render(h, context) {
			return <span>{dateformat(context.row.ctime, "yyyy-mm-dd'  'HH:MM:ss")}</span>
		}
	}
}

export default tableColumnsByDomain(Product, options)
