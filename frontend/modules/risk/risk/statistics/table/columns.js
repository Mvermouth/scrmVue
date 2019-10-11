import AppRoutes from '../../../../../configs/AppRoutes'
import Profile from '../../../../../models/im/profile'
import { tableColumnsByDomain } from '../../../../../scripts/utils/table-utils'
const width = App.options.styles.table.width
const options = {
	avatar: {
		width: width.avatar,
		align: 'center',
		render(h, context) {
			const row = context.row
			const url = row.avatar
			return <a onClick={() => { App.push(AppRoutes.Profile.id(row.id, row.customID || row.nickname || '')) }}><im-avatar url={ url }></im-avatar></a>
		}
	},
	platformUid: {
		width: width.w_12,
		title: '微信ID',
		before: 'customID',
		render(h, context) {
			const row = context.row
			return <a onClick={() => { App.push(AppRoutes.Profile.id(row.id, row.customID || row.nickname || '')) }}>{row.platformUid}</a>
		}
	},
	customID: {
		width: width.w_12,
		render(h, context) {
			const row = context.row
			return <a onClick={() => { App.push(AppRoutes.Profile.id(row.id, row.customID || row.nickname || '')) }}>{row.customID || ''}</a>
		}
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
	// 'counter.profileRiskCountTotal': {
	// 	width: width.w_12,
	// 	title: '总风控次数',
	// 	render(h, context) {
	// 		let name = ''
	// 		const counter = context.row.counter
	// 		if (counter) {
	// 			name = counter.profileRiskCountTotal || 0
	// 		}
	// 		return <span>{name}</span>
	// 	}
	// },
	// 'counter.profileRiskCountByMonth': {
	// 	width: width.w_12,
	// 	title: '本月风控次数',
	// 	render(h, context) {
	// 		let name = ''
	// 		const counter = context.row.counter
	// 		if (counter) {
	// 			name = counter.profileRiskCountByMonth || 0
	// 		}
	// 		return <span>{name}</span>
	// 	}
	// },
	// 'counter.profileRiskCountByWeek': {
	// 	width: width.w_12,
	// 	title: '本周风控次数',
	// 	render(h, context) {
	// 		let name = ''
	// 		const counter = context.row.counter
	// 		if (counter) {
	// 			name = counter.profileRiskCountByWeek || 0
	// 		}
	// 		return <span>{name}</span>
	// 	}
	// },
	// 'counter.profileRiskCountByDay': {
	// 	width: width.w_12,
	// 	title: '今日风控次数',
	// 	render(h, context) {
	// 		let name = ''
	// 		const counter = context.row.counter
	// 		if (counter) {
	// 			name = counter.profileRiskCountByDay || 0
	// 		}
	// 		return <span>{name}</span>
	// 	}
	// },
	id: false,
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
