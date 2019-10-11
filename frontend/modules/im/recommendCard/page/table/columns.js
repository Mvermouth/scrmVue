import RecommendCard from '../../../../../models/im/recommendCard'
import { tableColumnsByDomain } from '../../../../../scripts/utils/table-utils'
import { yesNo } from '../../../../../scripts/utils/table-renders'
import AppRoutes from '../../../../../configs/AppRoutes'

const width = App.options.styles.table.width
const options = {
	'profile.customID': {
		title: '运营微信号',
		width: width.w_12,
		render(h, context) {
			return <a onClick={() => { App.push(AppRoutes.Profile.id(context.row.profile.id, context.row.profile.nickname)) }}>{context.row.profile.customID || context.row.profile.platformUid}</a>
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
	'contact.customID': {
		title: '好友微信号',
		width: width.w_12,
		render(h, context) {
			const onClick = async() => {
				const row = context.row
				App.push(AppRoutes.Relation._(row.profile.contactID, row.contact.id, row.contact.nickname))
			}
			let title = ''
			if (context.row.contact) {
				title = context.row.contact.customID || context.row.contact.platformUid
			}
			return <a onClick={onClick}>{title}</a>
		}
	},
	'contact.nickname': {
		title: '好友昵称',
		width: width.w_12
	},
	'recommendCustomID': {
		width: width.w_12
	},
	'recommendNick': {
		width: width.w_12
	},
	'isAdd': {
		width: width.w_10,
		render(h, context) { return yesNo.call(this, h, context, context.row.isAdd) }
	},
	'ctime': {
		width: width.w_12
	}
}

export default tableColumnsByDomain(RecommendCard, options)
