import AppRoutes from '../../../../../configs/AppRoutes'
import Warehouse from '../../../../../models/ecommerse/warehouse'
import { tableColumnsByDomain, filterTableRowActions } from '../../../../../scripts/utils/table-utils'
import { labelActions } from '../../../../../scripts/utils/table-renders'

const width = App.options.styles.table.width
// 授权的操作
const permittedActions = App.data.actions || []
const rowActions = ['update', 'delete']
const filteredActions = filterTableRowActions(rowActions, permittedActions)
const options = {
	name: {
		width: width.w_16,
		render(h, context) {
			return <a onClick={() => { App.push(AppRoutes.Inventory.page()) }}>{context.row.name}</a>
		}
	},
	address: {
		width: width.w_20
	},
	_actions: filteredActions.length > 0 ? {
		title: '操作',
		width: width[`label_actions_${filteredActions.length}`],
		render(h, context) {
			return labelActions.call(this, h, context, Warehouse, filteredActions)
		}
	} : false
}

export default tableColumnsByDomain(Warehouse, options)
