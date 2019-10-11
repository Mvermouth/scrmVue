import Sensitive from '../../../../../models/risk/sensitive'
import { tableColumnsByDomain, filterTableRowActions } from '../../../../../scripts/utils/table-utils'
import { labelActions, constantText } from '../../../../../scripts/utils/table-renders'
import Constant from '../../../../../configs/constant'

const width = App.options.styles.table.width
// 授权的操作
const permittedActions = App.data.actions || []
const rowActions = ['update', 'delete']
const filteredActions = filterTableRowActions(rowActions, permittedActions)
const options = {
	'content': {
		title: '敏感词',
		width: width.w_12
	},
	// 'replaceContent': {
	// 	title: '替换词',
	// 	width: width.w_12
	// },
	'level': {
		title: '敏感级别',
		width: width.w_12,
		render(h, context) {
			const level = context.row.level || 0
			return constantText.call(this, h, context, level, Constant.SensitiveLevel)
		}
	},
	'ctime': {
		width: width.w_12,
		render(h, context) {
			const time = context.row.ctime
			return <span>{time}</span>
		}
	},

	_actions: filteredActions.length > 0 ? {
		title: '操作',
		width: width[`label_actions_${filteredActions.length}`],
		render(h, context) {
			return labelActions.call(this, h, context, Sensitive, filteredActions)
		}
	} : false
}

export default tableColumnsByDomain(Sensitive, options)
