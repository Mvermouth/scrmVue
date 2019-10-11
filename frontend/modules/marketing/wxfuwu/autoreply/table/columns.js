import Reply from '../../../../../models/marketing/reply'
import { tableColumnsByDomain, filterTableRowActions } from '../../../../../scripts/utils/table-utils'
import { labelActions } from '../../../../../scripts/utils/table-renders'

const width = App.options.styles.table.width
// 授权的操作
const permittedActions = App.data.actions || []
const rowActions = ['update', 'delete']
const filteredActions = filterTableRowActions(rowActions, permittedActions)
const options = {
	useStatus: {
		width: width.w_12,
		render(h, context) {
			const inUse = !!context.row.useStatus
			return <i-switch value={inUse}></i-switch>
		}
	},
	syncStatus: {
		width: width.w_12,
		render(h, context) {
			const syncText = context.row.syncStatus ? '同步成功' : '同步失败'
			return <span>{syncText}</span>
		}
	},
	_actions: rowActions.length > 0 ? {
		title: '操作',
		width: width[`label_actions_${rowActions.length}`],
		render(h, context) {
			return labelActions.call(this, h, context, Reply, rowActions)
		}
	} : false
}

export default tableColumnsByDomain(Reply, options)
