import User from '../../../../../models/clouddata/douyin/user'
import { tableColumnsByDomain, filterTableRowActions } from '../../../../../scripts/utils/table-utils'
import { labelActions, constantText } from '../../../../../scripts/utils/table-renders'
import AppRoutes from '../../../../../configs/AppRoutes'
const width = App.options.styles.table.width

// 授权的操作
const rowActions = [
	{
		detail: {
			title: '详情',
			onAction($list, { row, column, index }, domain) {
				const id = row.id
				const nickname = row.nickname
				App.push(AppRoutes.Clouddata.Douyin.User.id(id, nickname))
			}
		}
	}
]
const filteredActions = rowActions	//filterTableRowActions(rowActions, App.data.actions || [])

const options = {
	follower_count: {
		title: '粉丝数',
		sortable: true
	},
	mtime: {
		width: width.w_8,
		title: '记录更新时间',
		render(h, context) {
			const dateStr = new Date(parseInt(context.row.mtime * 1000)).toLocaleString()
			return <span>{dateStr}</span>
		}
	},
	avatar_thumb: {
		width: width.avatar,
		title: '头像',
		align: 'center',
		render(h, context) {
			const row = context.row
			const avatar_thumb = row.avatar_thumb
			const avatar_thumb_url = avatar_thumb.url_list[0]
			return <im-avatar url={avatar_thumb_url}></im-avatar>
		}
	},
	_actions: filteredActions.length > 0 ? {
		title: '操作',
		width: width.w_8,
		render(h, context) {
			return labelActions.call(this, h, context, User, filteredActions)
		}
	} : false
}

export default tableColumnsByDomain(User, options)
