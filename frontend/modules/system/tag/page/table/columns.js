import Tag from '../../../../../models/system/tag'
import { tableColumnsByDomain, filterTableRowActions } from '../../../../../scripts/utils/table-utils'
import { labelActions } from '../../../../../scripts/utils/table-renders'
const width = App.options.styles.table.width
// 授权的操作
const permittedActions = App.data.actions || []
const rowActions = [
	'update',
	'delete'
]
const filteredActions = filterTableRowActions(rowActions, permittedActions)
const options = {
	name: {
		width: width.w_20
	},
	type: {
		width: width.w_16,
		render(h, context) {
			return <span>图片素材</span>
		}
	},
	ctime: {
		title: '创建时间',
		width: width.w_12,
		render(h, context) {
			return <span>{dateformat(context.row.ctime, 'yyyy-mm-dd HH:MM:ss')}</span>
		}
	},
	_actions: filteredActions.length > 0 ? {
		title: '操作',
		width: width[`label_actions_${filteredActions.length}`],
		render(h, context) {
			return labelActions.call(this, h, context, Tag, rowActions)
		}
	} : false

}

export default tableColumnsByDomain(Tag, options)
