import Risk from '../../../../../models/risk/risk'
import { tableColumnsByDomain } from '../../../../../scripts/utils/table-utils'
import { constantText, riskText } from '../../../../../scripts/utils/table-renders'
import Constant from '../../../../../configs/constant'
import AppRoutes from '../../../../../configs/AppRoutes'
import { messageTypeText, actionTypeText } from '../riskText/index'
const width = App.options.styles.table.width
const options = {

	'profile.platformUid': {
		title: '运营微信ID',
		width: width.w_12,
		render(h, context) {
			return <a onClick={() => { App.push(AppRoutes.Profile.id(context.row.profile.id, context.row.profile.nickname)) }}>{context.row.profile.platformUid}</a>
		}
	},
	'profile.customID': {
		title: '运营微信号',
		width: width.w_12,
		render(h, context) {
			return <a onClick={() => { App.push(AppRoutes.Profile.id(context.row.profile.id, context.row.profile.nickname)) }}>{context.row.profile.customID || ''}</a>
		}
	},
	'profile.nickname': {
		title: '运营号昵称',
		width: width.w_12
	},
	_employeeName: {
		width: width.w_12,
		title: '归属员工',
		after: 'profile.nickname',
		render(h, context) {
			const employee = context.row.profile.employee
			let nameAndSn = ''
			if (employee) {
				nameAndSn = `${employee.name}(${employee.sn})`
			}
			return <span>{nameAndSn}</span>
		}
	},
	'action': {
		width: width.w_12,
		render(h, context) {
			const action = context.row.action || 0
			return constantText.call(this, h, context, action, Constant.WxActionSetting)
		}
	},
	'description': {
		width: width.w_16,
		ellipsis: true,
		title: '描述',
		render(h, context) {
			const row = context.row
			const description = row.description
			const action = row.action
			if (row.refType === Constant.RiskRefType.message) {
				return messageTypeText.call(this, h, context, row, this.$root.sensitives, action)
			} else if (row.refType === Constant.RiskRefType.action) {
				return actionTypeText.call(this, h, context, description, true)
			}
		}
	},
	'contact.customID': {
		title: '好友微信号',
		width: width.w_12,
		render(h, context) {
			if (!context.row.contact) {
				return <span>-</span>
			}
			const onClick = async() => {
				App.push(AppRoutes.Relation._(context.row.profile.contactID, context.row.contact.id, context.row.contact.nickname))
			}
			let title = ''
			if (context.row.contact) {
				title = context.row.contact.customID || context.row.contact.platformUid
			}
			return <a onClick={onClick}>{title}</a>
		}
	},
	'contact.nickname': {
		width: width.w_12,
		after: 'contact.customID',
		title: '好友昵称',
		render(h, context) {
			if (!context.row.contact) {
				return <span>-</span>
			}
			return <span>{context.row.contact.nickname}</span>
		}
	},
	'ctime': {
		width: width.w_12,
		render(h, context) {
			return <span>{context.row.ctime}</span>
		}
	}

}

export default tableColumnsByDomain(Risk, options)
