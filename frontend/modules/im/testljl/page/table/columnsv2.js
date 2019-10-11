import AppRoutes from '../../../../../configs/AppRoutes'
import Profile from '../../../../../models/im/profile'
import { tableColumnsByDomain, filterTableRowActions } from '../../../../../scripts/utils/table-utils'
import { buttonActions } from '../../../../../scripts/utils/table-renders'
import { value2Text } from '../../../../../scripts/utils/misc'
import Constant from '../../../../../configs/constant'
const width = App.options.styles.table.width

// 授权的操作
const permittedActions = App.data.actions || []
const chatActions = [
	{
		'sessions': {
			title: '聊天记录',
			icon: '',
			type: 'info',
			onAction: ($list, { row, column, index }, domain) => {
				App.push(AppRoutes.ChatSession.sessionMessage(row.contactID, '', '', row.nickname))
			}
		}
	},
	{
		'contactChat': {
			title: '微信好友',
			icon: '',
			type: 'info',
			onAction: ($list, { row, column, index }, domain) => {
				App.push(AppRoutes.ChatSession.chatMessage(row.contactID, '', '', row.nickname))
			}
		}
	},
	{
		'timeline': {
			title: '朋友圈',
			icon: '',
			type: 'info',
			onAction: ($list, { row, column, index }, domain) => {
				App.push(AppRoutes.ChatSession.timelines(row.contactID, row.nickname))
			}
		}
	}
]
const rowActions = [
	'update'
]
const filteredActions = _.concat(chatActions, filterTableRowActions(rowActions, permittedActions))

// 弹窗设置归属员工
const updateEmployee = (row) => {
	App.push(AppRoutes.Profile.updateEmplyee(row.id, row.nickname))
}
// 弹窗设置标签
const updateTags = (row) => {
	App.push(AppRoutes.Profile.updateTags(row.id, row.nickname))
}
const options = {
	avatar: {
		width: width.w_5,
		title: '头像',
		fixed: 'left',
		align: 'center',
		render(h, context) {
			return <im-avatar url={context.row.avatar}></im-avatar>
		}
	},
	customID: {
		// width: width.w_9,
		title: '微信号',
		fixed: 'left',
		align: 'center',
		render(h, context) {
			return <div>
                <span class='info-value ellipsis c-primary pointer' >
                    <tooltip transfer content={context.row.customID}>{context.row.customID}</tooltip>
                </span>
            </div>
		}
	},
	nickname: {
		// width: width.w_9,
		title: '微信昵称',
		fixed: 'left',
		align: 'center',
		render(h, context) {
			return <div>
                <span class='info-value ellipsis' >
                    <tooltip transfer content={context.row.customID}>{context.row.customID}</tooltip>
                </span>
            </div>
		}
	},
	employee: {
		width: width.w_12,
		title: '员工信息',
		align: 'center',
		after: 'nickname',
		render(h, context) {
			const row = context.row
			const name = _.result(row.employee, 'name')
			if (!name) { return <a href='javascript:void(0)' onClick={() => { updateEmployee(row) }}>设置</a> } else { return <im-employee-info-widget data={Object.assign(row.employee, { accountId: row.id, accountName: row.nickname })}></im-employee-info-widget> }
		}
	},
	contactCount: {
		title: '好友总数',
		width: width.w_7,
		sortable: true,
		after: 'employee'
	},
	
	contactsInfo: {
		width: width.w_21,
		title: '好友统计',
		align: 'center',
		after: 'contactCount',
		render(h, context) {
			return <contact-statistics-info-widget contactStatistics={context.row}></contact-statistics-info-widget>
		}
	},
	// order: {
	// 	width: width.w_10,
	// 	title: '订单信息',
	// 	align: 'center',
	// 	after: 'employee',
	// 	render(h, context) {
	// 		return <im-order-info-widget order={ context.row.order }></im-order-info-widget>
	// 	}
	// },
	// device: {
	// 	width: width.w_20,
	// 	title: '设备信息',
	// 	align: 'center',
	// 	after: 'employee',
	// 	render(h, context) {
	// 		return <im-device-info-widget device={Object.assign(context.row.device || {}, { ctime: context.row.ctime }) || {}}></im-device-info-widget>
	// 	}
	// },
	heartbeatTime: {
		title: '最后心跳时间',
		width: width.w_12,
		after: 'contactsInfo',
		render(h, context) {
			return <span>{dateformat(context.row.heartbeatTime, 'yyyy-mm-dd HH:MM:ss')}</span>
		}
	},
	dupCount: false,
	gender: false,
	gender: {
		render(h, context) {
			return <span>{value2Text(Constant.Gender, context.row.gender || 0)}</span>
		}
	},
	country: true,
	state: true,
	city: true,
	mobilephone: true,
	signature: true,
	deviceID: false,
	'tags': {
		width: width.w_8,
		render(h, context) {
			const text = []
			const tags = _.result(context.row, 'tags', [])
			tags.forEach(it => {
				text.push(<tag color='blue'>{it}</tag>)
			})
			return <div><div>{text}</div><a href='javascript:void(0)' onClick={() => { updateTags(context.row) }}>添加标签</a></div>
		}
	},
	appVersion: false,
	qrcode: {
		width: width.w_7,
		align: 'center',
		render(h, context) {
			const url = context.row.qrcode
			return url ? <a href={url} download={`qrcode_${context.row.customID}`} style='width: 76px; height: 76px'>
				<img src={url} alt='qrcode' style='width: 76px; height: 76px' /></a> : <span></span>
		}
	},
	ctime: false,
	persistRoomMsg: false,
	_actions: filteredActions.length > 0 ? {
		title: '操作',
		after: 'qrcode',
		width: width[`label_actions_${filteredActions.length + 1}`],
		render(h, context) {
			return buttonActions.call(this, h, context, Profile, filteredActions)
		}
	} : false
}

export default tableColumnsByDomain(Profile, options)
