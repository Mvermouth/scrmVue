import Link from '../../../../../models/matter/link'
import { tableColumnsByDomain } from '../../../../../scripts/utils/table-utils'
import { labelActions } from '../../../../../scripts/utils/table-renders'
const width = App.options.styles.table.width
// 授权的操作
const rowActions = [
	{
		update: {
			unauthorize: true
		}
	},
	{
		delete: {
			unauthorize: true
		}
	}
]
// const filteredActions = filterTableRowActions(rowActions, permittedActions)
const options = {
	name: {
		width: width.w_16
	},
	url: {
		width: width.w_16
	},
	ctime: {
		width: width.w_12,
		render(h, context) {
			return <span>{dateformat(context.row.ctime, 'yyyy-mm-dd HH:MM:ss')}</span>
		}
	},
	_actions: rowActions.length > 0 ? {
		title: '操作',
		width: width[`label_actions_${rowActions.length}`],
		render(h, context) {
			return labelActions.call(this, h, context, Link, rowActions)
		}
	} : false

}

export default tableColumnsByDomain(Link, options)
