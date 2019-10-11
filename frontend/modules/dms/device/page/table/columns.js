
import Device from '../../../../../models/dms/device'
import { filterTableRowActions, tableColumnsByDomain } from '../../../../../scripts/utils/table-utils'
import { buttonActions, longText } from '../../../../../scripts/utils/table-renders'
import AppRoutes from '../../../../../configs/AppRoutes'

const width = App.options.styles.table.width

// 授权的操作
const permittedActions = App.data.actions || []
const rowActions = [

	'update',
	// 解绑设备
	{
		unbind: {
			title: '解绑',
			type: 'error',
			onAction($table, { row, column, index }, domain) {
				this.$Modal.confirm({
					title: '确认解绑',
					content: '是否解绑设备？',
					loading: true,
					async onOk() {
						Device.unbind(row['id'])
							.then(() => {
								this.$Modal.remove()
								$table.load()
								this.$Notice.success({ title: '解绑成功' })
							})
							.catch(e => {
								this.$Modal.remove()
							})
					}
				})
			}
		}
	},
	{
		view: {
			title: '查看',
			type: 'info',
			onAction($table, { row, column, index }, domain) {
				const device = row.device
				App.push(AppRoutes.Device.id(device.id))
			}
		}
	}
]
const filteredActions = filterTableRowActions(rowActions, permittedActions)
const options = {
	'device.UDID': {
		width: 360,
		title: 'UDID',
		render(h, context) {
			return <span>{context.row.device.UDID}</span>
		}
	},
	'sn': {
		width: width.w_10,
		title: '设备编号',
		render(h, context) {
			return <span>{context.row.sn}</span>
		}
	},
	'device.deviceName': {
		width: width.w_12,
		title: '设备名称',
		render(h, context) {
			return <span>{context.row.device.deviceName}</span>
		}
	},
	_employeeName: {
		width: width.w_12,
		title: '归属员工',
		after: 'device.deviceName',
		render(h, context) {
			const employee = context.row.employee
			let nameAndSn = ''
			if (employee) {
				nameAndSn = employee.name ? `${employee.name}(${employee.sn})` : ''
			}
			return <span>{nameAndSn}</span>
		}
	},
	_cEmployeeName: {
		width: width.w_12,
		title: '绑定员工',
		after: '_employeeName',
		render(h, context) {
			const employee = context.row.cEmployee
			let nameAndSn = ''
			if (employee) {
				nameAndSn = employee.name ? `${employee.name}(${employee.sn})` : ''
			}
			return <span>{nameAndSn}</span>
		}
	},
	'device.deviceVersion': {
		width: width.w_12,
		title: '设备版本',
		render(h, context) {
			return <span>{context.row.device.deviceVersion}</span>
		}
	},
	'device.systemType': {
		width: width.w_12,
		title: '系统',
		render(h, context) {
			return <span>{context.row.device.systemType}</span>
		}
	},
	'device.systemVersion': {
		width: width.w_12,
		title: '系统版本',
		render(h, context) {
			return <span>{context.row.device.systemVersion}</span>
		}
	},
	'device.carrier': {
		width: width.w_12,
		title: '手机卡运营商',
		render(h, context) {
			return <span>{context.row.device.carrier}</span>
		}
	},
	'remark': {
		width: width.w_12,
		title: '备注',
		render(h, context) {
			return longText.call(this, h, context, context.row.remark, true)
		}
	},
	ctime: {
		width: width.datetime,
		title: '录入时间',
		after: 'remark'
	},
	_actions: filteredActions.length > 0 ? {
		title: '操作',
		after: '_cEmployeeName',
		width: width[`button_actions_${filteredActions.length}`],
		render(h, context) {
			return buttonActions.call(this, h, context, Device, filteredActions)
		}
	} : false
}

export default tableColumnsByDomain(Device, options)
