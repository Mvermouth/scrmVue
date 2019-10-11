import Profile from '../../../../../models/im/profile'
import { tableColumnsByDomain, filterTableRowActions } from '../../../../../scripts/utils/table-utils'
import { labelActions, avatar } from '../../../../../scripts/utils/table-renders'

const width = App.options.styles.table.width
// 授权的操作
const permittedActions = App.data.actions || []
const rowActions = [
	'updateProfile'
]
const filteredActions = filterTableRowActions(rowActions, permittedActions)
const options = {
	avatar: {
		width: width.avatar,
		align: 'center',
		render(h, context) {
			const url = context.row.avatar
			return <im-avatar url={ url }></im-avatar>
		}
	},

	customID: {
		width: width.w_12,
		render(h, context) {
			return <span>{context.row.customID}</span>
		}
	},
	platformUid: {
		width: width.w_14,
		title: '微信ID',
		after: 'customID',
		render(h, context) {
			return <span>{context.row.platformUid}</span>
		}
	},

	nickname: {
		width: width.w_12
	},

	_employeeName: {
		width: width.w_12,
		title: '归属员工',
		after: 'nickname',
		render(h, context) {
			const employee = context.row.employee
			let nameAndSn = ''
			if (employee) {
				nameAndSn = `${employee.name}(${employee.sn})`
			}
			return <span>{nameAndSn}</span>
		}
	},
	_departmentName: {
		width: width.w_12,
		title: '归属部门',
		after: '_employeeName',
		render(h, context) {
			const employee = context.row.employee
			let nameAndSn = ''
			if (employee && !_.isEmpty(employee.departments)) {
				nameAndSn = employee.departments.map(it => it.name).join(',')
			}
			return <span>{nameAndSn}</span>
		}
	},
	_actions: filteredActions.length > 0 ? {
		title: '操作',
		width: width.w_8,
		render(h, context) {
			return labelActions.call(this, h, context, Profile, filterTableRowActions([
				{
					'updateProfile': {
						title: '设置',
						color: '#2d8cf0',
						onAction: ($table, { row, column, index }, domain) => {
							const id = row.contactID
							const rootView = this.$root.$children[0]
							rootView.updateSettings(id)
						}
					}
				}
			], permittedActions))
		}
	} : false,

	id: false,
	contactCount: false,
	mobilephone: false,
	online: false,
	gender: false,
	country: false,
	state: false,
	tags: false,
	city: false,
	signature: false,
	deviceID: false,
	appVersion: false,
	qrcode: false,
	persistRoomMsg: false,
	ctime: false
}

export default tableColumnsByDomain(Profile, options)
