import AppRoutes from '../../../../../configs/AppRoutes'
import Contact from '../../../../../models/im/contact'
import Group from '../../../../../models/im/group'
import Message from '../../../../../models/im/message'
import Profile from '../../../../../models/im/profile'
import { tableColumnsByDomain } from '../../../../../scripts/utils/table-utils'
import { constantText, longText } from '../../../../../scripts/utils/table-renders'
import Constant from '../../../../../configs/constant'
const width = App.options.styles.table.width

const profileRetrieveUrl = row => {
	const profile = row.profile
	const name = profile.nickname || profile.platformUid || ''
	return `${Profile.baseUrl}/retrieve/${row.profile.id}?name=${encodeURIComponent(name)}`
}
const options = {
	'contact.customID': {
		width: width.w_12,
		title: '好友微信号',
		before: 'messageType',
		render(h, context) {
			const row = context.row
			const contact = row.contact
			const name = contact.nickname || contact.platformUid || ''
			const url = AppRoutes.Contact.id(row.id, name)
			return <a onClick={url}>{contact.customID || contact.platformUid}</a>
		}
	},
	'contact.nickname': {
		width: width.w_12,
		title: '好友昵称',
		after: 'contact.customID',
		render(h, context) {
			return <span>{context.row.contact.nickname}</span>
		}
	},
	'direction': {
		width: width.w_10,
		render(h, context) {
			const value = context.row.direction || 0
			return constantText.call(this, h, context, value, Constant.MessageDirection)
		}
	},
	'messageType': {
		width: width.w_10,
		render(h, context) {
			const value = context.row.messageType || 0
			return constantText.call(this, h, context, value, Constant.MessageType)
		}
	},
	'profile.customID': {
		width: width.w_12,
		title: '运营微信号',
		after: 'messageType',
		render(h, context) {
			return <a onClick={profileRetrieveUrl(context.row)}>{context.row.profile.customID || context.row.profile.platformUid}</a>
		}
	},
	'profile.nickname': {
		width: width.w_12,
		title: '运营号昵称',
		after: 'profile.customID',
		render(h, context) {
			return <span>{context.row.profile.nickname}</span>
		}
	},
	'detail': {
		title: '聊天会话',
		width: width.w_8,
		after: 'contact.nickname',
		render(h, context) {
			const onClick = async () => {
				const row = context.row
				const date = new Date(row.sendTime).getTime() - 3000
				App.push(AppRoutes.Group.messages(row.gid, date))
			}
			return <a onClick={onClick}>详情</a>
		}
	},
	'content': {
		width: width.w_16,
		ellipsis: true,
		render(h, context) {
			return longText.call(this, h, context, context.row.content, true)
		}
	},
	'revoke': {
		width: width.w_10,
		render(h, context) {
			const value = context.row.revoke || 2
			return constantText.call(this, h, context, value, Constant.YesNo)
		}
	},
	'sendTime': {
		width: width.w_12,
		sortable: true
	},
	'ctime': {
		width: width.w_12,
		sortable: true
	}
}

export default tableColumnsByDomain(Message, options)
