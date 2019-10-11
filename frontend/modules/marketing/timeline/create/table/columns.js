import Task from '../../../../../models/marketing/task'
import { tableColumnsByDomain, filterTableRowActions } from '../../../../../scripts/utils/table-utils'
import { labelActions } from '../../../../../scripts/utils/table-renders'

const width = App.options.styles.table.width
// 授权的操作
const permittedActions = App.data.actions || []
const rowActions = ['update', 'delete']
const filteredActions = filterTableRowActions(rowActions, permittedActions)
const options = {
	_actions: rowActions.length > 0 ? {
		title: '操作',
		width: width[`label_actions_${rowActions.length}`],
		render(h, context) {
			return labelActions.call(this, h, context, Task, rowActions)
		}
	} : false
}

export default tableColumnsByDomain(Task, options)
