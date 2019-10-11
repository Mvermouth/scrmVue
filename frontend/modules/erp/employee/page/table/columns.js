import Employee from '../../../../../models/erp/employee'
import { tableColumnsByDomain, filterTableRowActions } from '../../../../../scripts/utils/table-utils'
import { labelActions, constantText } from '../../../../../scripts/utils/table-renders'
import Constants from '../../../../../configs/constant'

const width = App.options.styles.table.width
// 授权的操作
const permittedActions = App.data.actions || []
const rowActions = ['update', 'delete',
	{ 'adminChangePassword': {
		title: '重置密码',
		color: '#2d8cf0',
		onAction($list, { row, column, index }, domain) {
			App.modal({
				title: '重置密码',
				loading: true,
				width: 'small',
				render: (h, row) => {
					h = this.$root.$createElement
					return <reset-password></reset-password>
				},
				onOk: async(comp, modal) => {
					try {
						const result = await comp.submit(row.userId)
						this.$Notice.success({ title: result.message })
						if (result.code === -1) {
							modal.cancelLoading()
							return
						}
						App.removeModal()
					} catch (e) {
						modal.cancelLoading()
					}
				}
			})
		}
	}}
]
const filteredActions = filterTableRowActions(rowActions, permittedActions)
const options = {
	'user.username': {
		after: 'sn'
	},

	departments: {
		width: width.w_14,
		title: '部门',
		after: 'name',
		render(h, context) {
			const departments = _.join(_.map(context.row.departments, 'name'), ',')
			return <span>{ departments }</span>
		}
	},

	priviledges: {
		width: width.w_14,
		title: '角色',
		after: 'departments',
		render(h, context) {
			const roles = _.join(_.map(context.row.user.roles, 'name'), ',')
			return <span>{ roles }</span>
		}
	},

	'user.ctime': {
		width: width.datetime,
		render(h, context) {
			const datetime = dateformat(context.row.user.ctime, 'yyyy-mm-dd HH:MM:ss')
			return <span>{datetime}</span>
		}
	},

	status: {
		width: width.w_6,
		render(h, context) {
			const EmployeeStatus = Constants.EmployeeStatus
			const value = context.row.status
			const highlights = {
				[EmployeeStatus.Duty.value]: 'success',
				[EmployeeStatus.NoDuty.value]: 'error'
			}
			return constantText.call(this, h, context, value, EmployeeStatus, highlights)
		}
	},
	_actions: filteredActions.length > 0 ? {
		title: '操作',
		width: width.w_12,
		render(h, context) {
			return labelActions.call(this, h, context, Employee, filteredActions)
		}
	} : false
}

export default tableColumnsByDomain(Employee, options)
