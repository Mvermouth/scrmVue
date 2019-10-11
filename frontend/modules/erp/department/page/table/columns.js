import Department from '../../../../../models/erp/department'
import { tableColumnsByDomain, filterTableRowActions } from '../../../../../scripts/utils/table-utils'
import { labelActions, avatar } from '../../../../../scripts/utils/table-renders'

const width = App.options.styles.table.width
// 授权的操作
const permittedActions = App.data.actions || []
const rowActions = ['update', 'delete']
const filteredActions = filterTableRowActions(rowActions, permittedActions)
const options = {
	name: {
		title: '部门名称'
	},

	'parent.name': {
		title: '上级部门',
		after: 'name'
	},

	priviledges: {
		width: width.w_10,
		title: '部门角色',
		after: 'parent.name',
		render(h, context) {
			if (!context.row.group) {
				return <span></span>
			}
			const currentRoles = _.join(_.map(context.row.group.currentRoles, 'name'), ',')
			return <span>{currentRoles}</span>
		}
	},

	inheritPriviledges: {
		width: width.w_10,
		title: '继承角色',
		after: 'priviledges',
		render(h, context) {
			if (!context.row.group) {
				return <span></span>
			}
			const inheritRoles = _.join(_.map(context.row.group.roles, 'name'), ',')
			return <span>{inheritRoles}</span>
		}
	},

	_actions: filteredActions.length > 0 ? {
		title: '操作',
		width: width[`label_actions_${filteredActions.length}`],
		render(h, context) {
			return labelActions.call(this, h, context, Department, filteredActions)
		}
	} : false
}

export default tableColumnsByDomain(Department, options)
