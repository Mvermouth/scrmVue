import { tableColumnsByDomain, filterTableRowActions } from '../../../../../scripts/utils/table-utils'
import { labelActions } from '../../../../../scripts/utils/table-renders'
import Spec from '../../../../../models/ecommerse/spec'

const width = App.options.styles.table.width
// 授权的操作
const permittedActions = App.data.actions || []
const rowActions = ['update', 'delete']
const filteredActions = filterTableRowActions(rowActions, permittedActions)
const options = {
	ctime: {
		width: width.datetime,
		render(h, context) {
			return <span>{dateformat(new Date(context.row.ctime), 'yyyy-mm-dd HH:MM:ss')}</span>
		}
	},
	value: {
		width: width.w_24,
		render(h, context) {
			const text = JSON.parse(context.row.value).map(it => { return it.name }).join(',')
			return <span>{text}</span>
		}
	},
	_actions: filteredActions.length > 0 ? {
		title: '操作',
		width: width[`label_actions_${filteredActions.length}`],
		render(h, context) {
			return labelActions.call(this, h, context, Spec, filteredActions)
		}
	} : false
}

export default tableColumnsByDomain(Spec, options)
