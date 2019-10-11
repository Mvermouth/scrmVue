import Profile from '../../../../../models/im/profile'
import { tableColumnsByDomain } from '../../../../../scripts/utils/table-utils'
const width = App.options.styles.table.width

const options = {
	avatar: {
		width: width.avatar,
		align: 'center',
		render(h, context) {
			const url = context.row.avatar
			const status = context.row.online
			return <im-avatar url={ url }></im-avatar>
		}
	},

	customID: {
		width: width.w_12
	},

	nickname: {
		width: width.w_12
	},
	contactCount: {
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
	'counter.profileFundIncomeTotal': {
		width: width.w_12,
		title: '总收入/支出',
		render(h, context) {
			let name = ''
			const counter = context.row.counter
			if (counter) {
				name = (counter.profileFundIncomeTotal || 0) / 100.0 + '/' + (counter.profileFundExpendTotal || 0) / 100.0
			}
			return <span>{name}</span>
		}
	},
	'counter.profileFundIncomeByMonth': {
		width: width.w_12,
		title: '本月收入/支出',
		render(h, context) {
			let name = ''
			const counter = context.row.counter
			if (counter) {
				name = (counter.profileFundIncomeByMonth || 0) / 100.0 + '/' + (counter.profileFundExpendByMonth || 0) / 100.0
			}
			return <span>{name}</span>
		}
	},
	'counter.profileFundIncomeByWeek': {
		width: width.w_12,
		title: '本周收入/支出',
		render(h, context) {
			let name = ''
			const counter = context.row.counter
			if (counter) {
				name = (counter.profileFundIncomeByWeek || 0) / 100.0 + '/' + (counter.profileFundExpendByWeek || 0) / 100.0
			}
			return <span>{name}</span>
		}
	},
	'counter.profileFundIncomeByDay': {
		width: width.w_12,
		title: '今日收入/支出',
		render(h, context) {
			let name = ''
			const counter = context.row.counter
			if (counter) {
				name = (counter.profileFundIncomeByDay || 0) / 100.0 + '/' + (counter.profileFundExpendByDay || 0) / 100.0
			}
			return <span>{name}</span>
		}
	},
	id: false,
	platformUid: false,
	mobilephone: false,
	online: false,
	gender: false,
	country: false,
	state: false,
	city: false,
	signature: false,
	deviceID: false,
	appVersion: false,
	qrcode: false,
	persistRoomMsg: false,
	tags: false,
	ctime: false
}

export default tableColumnsByDomain(Profile, options)
