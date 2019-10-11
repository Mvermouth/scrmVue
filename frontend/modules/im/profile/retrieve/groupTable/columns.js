import AppRoutes from '../../../../../configs/AppRoutes'
import Group from '../../../../../models/im/group'
import { tableColumnsByDomain, filterTableRowActions } from '../../../../../scripts/utils/table-utils'
import { labelActions, img, longText } from '../../../../../scripts/utils/table-renders'

const width = App.options.styles.table.width

/**
 * 过滤出授权操作
 */
const filteredActions = (() => {
	const permittedActions = App.data.actions || []
	const rowActions = [
		{
			update: {
				title: '编辑',
				onAction($list, { row, column, index }) {
					const id = row.id
					const name = row.group.name
					App.push(AppRoutes.Group.update(id, name))
				}
			}
		},
		'delete'
	]
	return filterTableRowActions(rowActions, permittedActions)
})()

/**
 * 打开群组成员清单
 *
 * @param {*} row
 * @param {*} _this
 */
const viewGroupMembers = (row, _this) => {
	App.modal({
		title: `${row.group.name || '未知群'}的群成员`,
		width: 564,
		render: h => {
			h = _this.$root.$createElement
			return <group-member gid={row.group.id}></group-member>
		}
	}, 'info')
}

const options = {
	'group.avatar': {
		width: width.avatar,
		title: '群头像',
		align: 'center',
		render(h, context) {
			const row = context.row
			const group = row.group
			const name = group.name || group.platformGid
			return <a onClick={() => { App.push(AppRoutes.Group.id(row.id, name)) }}><im-avatar url={group.avatar}></im-avatar></a>
		}
	},
	'group.platformGid': {
		width: width.w_14,
		title: '群ID',
		render(h, context) {
			const row = context.row
			const name = row.group.name || row.group.platformGid
			return <a onClick={() => { App.push(AppRoutes.Group.id(row.id, name)) }}>{row.group.platformGid}</a>
		}
	},
	'group.name': {
		title: '群名称',
		width: width.w_14,
		render(h, context) {
			return <span>{context.row.group.name}</span>
		}
	},
	'group.memberCount': {
		title: '群成员数量',
		width: width.w_8,
		render(h, context) {
			return <i-button type='ghost' onClick={() => { viewGroupMembers(context.row, this) }}>{`查看(${context.row.group.memberCount})`}</i-button>
		}
	},
	'ownerPlatformUid': {
		width: width.w_12,
		title: '群主微信号/ID',
		render(h, context) {
			return <span>{context.row.group.ownerCustomID || context.row.group.ownerPlatformUid}</span>
		}
	},
	'group.signature': {
		width: width.w_16,
		title: '群公告',
		ellipsis: true,
		render(h, context) {
			const signature = context.row.group.signature
			return longText.call(this, h, context, signature, true)
		}
	},
	'detail': {
		title: '聊天会话',
		width: width.w_8,
		render(h, context) {
			const row = context.row
			const url = AppRoutes.ChatSession.groupMessage(row.profile.contactID, row.group.id, '', row.profile.nickname)
			return <a onClick={() => { App.push(url) }}>详情</a>
		}
	},
	'group.qrcode': {
		width: width.w_8,
		title: '群二维码',
		after: '_actions',
		align: 'center',
		render(h, context) {
			const url = context.row.group.qrcode
			return img(h, context, url, true, null, App.data.site.logo_small)
		}
	},
	tags: {
		width: width.w_12,
		after: 'detail',
		render(h, context) {
			let text = ''
			if (context.row.tags && Array.isArray(context.row.tags)) {
				text = context.row.tags.join(',')
			}
			return <span>{text}</span>
		}
	},

	uploadMsg: {
		width: width.w_10,
		after: 'tags',
		title: '是否上报聊天消息',
		render(h, context) {
			return <span>{context.row.uploadMsg ? '是' : '否'}</span>
		}
	},
	'ctime': false,
	_actions: filteredActions.length > 0 ? {
		title: '操作',
		after: 'uploadMsg',
		width: width.w_8,
		render(h, context) {
			return labelActions.call(this, h, context, Group, filteredActions)
		}
	} : false
}

export default tableColumnsByDomain(Group, options)
