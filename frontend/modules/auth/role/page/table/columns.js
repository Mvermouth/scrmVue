import Role from '../../../../../models/auth/role'
import { tableColumnsByDomain, filterTableRowActions } from '../../../../../scripts/utils/table-utils'
import { labelActions } from '../../../../../scripts/utils/table-renders'

const width = App.options.styles.table.width
// 授权的操作
const permittedActions = App.data.actions || []
const rowActions = ['update', 'delete']
const filteredActions = filterTableRowActions(rowActions, permittedActions)
const options = {
	ctime: {
		width: width.datetime,
		after: 'name',
		render(h, context) {
			const ctime = context.row.ctime ? dateformat(context.row.ctime, 'yyyy-mm-dd HH:MM:ss') : ''
			return <span>{ctime}</span>
		}
	},
	_actions: filteredActions.length > 0 ? {
		title: '操作',
		width: width[`label_actions_${filteredActions.length}`],
		render(h, context) {
			return labelActions.call(this, h, context, Role, filteredActions)
		}
	} : false
}

export default tableColumnsByDomain(Role, options)
