import Product from '../../../../../models/ecommerse/product'
import { tableColumnsByDomain, filterTableRowActions } from '../../../../../scripts/utils/table-utils'
import { labelActions, img } from '../../../../../scripts/utils/table-renders'

const width = App.options.styles.table.width
const permittedActions = ['update', 'delete']
const rowActions = ['update', 'delete']
const filteredActions = filterTableRowActions(rowActions, permittedActions)
const options = {
	image: {
		width: width.img,
		render(h, context) {
			const url = !_.isEmpty(context.row.image) ? context.row.image[0] : null
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
		width: width.w_8
	},
	description: false,
	brief: false,
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
	marketPrice: false,
	price: {
		width: width.w_10,
		render(h, context) {
			return <span>{parseInt(context.row.price)}元</span>
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
	},
	_actions: filteredActions.length > 0 ? {
		title: '操作',
		width: width[`label_actions_${filteredActions.length}`],
		render(h, context) {
			return labelActions.call(this, h, context, Product, filteredActions)
		}
	} : false
}

export default tableColumnsByDomain(Product, options)
