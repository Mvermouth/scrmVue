import FilterItem from '../../../../../models/risk/filterItem'
import { tableColumnsByDomain, filterTableRowActions } from '../../../../../scripts/utils/table-utils'
import { labelActions, constantText } from '../../../../../scripts/utils/table-renders'
import Constant from '../../../../../configs/constant'
const width = App.options.styles.table.width
// 授权的操作
const permittedActions = App.data.actions || []
const rowActions = ['update', 'delete']
const filteredActions = filterTableRowActions(rowActions, permittedActions)
const options = {
	content: {
		width: width.w_20
	},
	category: {
		title: '分类',
		width: width.w_12,
		render(h, context) {
			return constantText.call(this, h, context, context.row.category, Constant.FilterItemCategory)
		}
	},
	ctime: {
		title: '添加日期',
		width: width.w_12,
		render(h, context) {
			return <span>{dateformat(context.row.ctime, 'yyyy-mm-dd HH:MM:ss')}</span>
		}
	},
	_actions: filteredActions.length > 0 ? {
		title: '操作',
		width: width[`label_actions_${filteredActions.length}`],
		render(h, context) {
			return labelActions.call(this, h, context, FilterItem, filteredActions)
		}
	} : false

}

export default tableColumnsByDomain(FilterItem, options)
