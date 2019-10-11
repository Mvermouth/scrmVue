import { tableColumnsByDomain, filterTableRowActions } from '../../../../../scripts/utils/table-utils'
import { labelActions, img } from '../../../../../scripts/utils/table-renders'
import { age } from '../../../../../scripts/utils/misc'
import Customer from '../../../../../models/ecommerse/customer'

const width = App.options.styles.table.width
// 授权的操作
const permittedActions = App.data.actions || []
const rowActions = [
	{
		// 编辑
		update: {
			title: '编辑',
			color: '#2d8cf0'
		}
	}
]
const filteredActions = filterTableRowActions(rowActions, permittedActions)
const options = {
	// avatar: {
	// 	width: width.img,
	// 	title: '头像',
	// 	render(h, context) {
	// 		return img.call(this, h, context, context.row.avatar)
	// 	}
	// },
	// nickname: {
	// 	width: width.w_10,
	// 	title: '昵称',
	// 	render(h, context) {
	// 		const text = context.row.nickname
	// 		return <span>{text}</span>
	// 	}
	// },
	realname: {
		width: width.w_8,
		title: '姓名',
		render(h, context) {
			const text = context.row.realname
			return <span>{text}</span>
		}
	},
	// platformId: {
	// 	width: width.w_6,
	// 	title: '客户平台',
	// 	render(h, context) {
	// 		return <span>微信</span>
	// 	}
	// },
	// platformUid: {
	// 	width: width.w_12,
	// 	title: '平台ID',
	// 	render(h, context) {
	// 		return <span>{context.row.platformUid}</span>
	// 	}
	// },
	mobile: {
		width: width.w_12,
		title: '手机号码',
		render(h, context) {
			const text = context.row.mobile
			return <span>{text}</span>
		}
	},
	addr: {
		width: width.w_10,
		title: '省/市/区',
		render(h, context) {
			return <span>{`${context.row.province || '-'} ${context.row.city || '-'} ${context.row.district || '-'}`}</span>
		}
	},
	sex: {
		width: width.w_6,
		title: '性别',
		render(h, context) {
			const gender = context.row.sex
			const text = gender ? (gender === 1 ? '男' : '女') : '_'
			return <span>{text}</span>
		}
	},
	age: {
		width: width.w_6,
		title: '年龄',
		render(h, context) {
			return <span>{age(context.row.birthday)}</span>
		}
	},
	position: {
		width: width.w_6,
		title: '职业',
		render(h, context) {
			return <span>{context.row.position}</span>
		}
	},
	// signature: {
	// 	width: width.w_24,
	// 	title: '签名',
	// 	render(h, context) {
	// 		const text = context.row.signature
	// 		return <span>{text}</span>
	// 	}
	// },
	ctime: {
		width: width.datetime,
		title: '录入时间',
		render(h, context) {
			return <span>{dateformat(new Date(context.row.ctime), 'yyyy-mm-dd HH:MM:ss')}</span>
		}
	},
	_actions: filteredActions.length > 0 ? {
		title: '操作',
		width: width[`label_actions_${filteredActions.length}`],
		render(h, context) {
			return labelActions.call(this, h, context, Customer, filteredActions)
		}
	} : false
}

export default tableColumnsByDomain(Customer, options)
