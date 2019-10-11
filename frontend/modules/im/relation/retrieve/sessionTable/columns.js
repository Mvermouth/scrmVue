import Session from '../../../../../models/im/session'
import { tableColumnsByDomain } from '../../../../../scripts/utils/table-utils'
import AppRoutes from '../../../../../configs/AppRoutes'
const width = App.options.styles.table.width

const options = {
	'avatar': {
		width: width.w_12,
		title: '头像',
		render(h, context) {
			const url = context.row.fromContact.avatar
			return <a onClick={() => { App.push(AppRoutes.Contact.id(context.row.fromContact.id, context.row.fromContact.nickname)) }}><im-avatar url={url}></im-avatar></a>
		}
	},
	'profileCustomID': {
		width: width.w_12,
		title: '运营微信号',
		render(h, context) {
			return <a onClick={() => { App.push(AppRoutes.Contact.id(context.row.fromContact.id, context.row.fromContact.nickname)) }}>{context.row.fromContact.customID}</a>
		}
	},
	'profileNickname': {
		width: width.w_12,
		title: '运营号昵称',
		render(h, context) {
			return <span>{context.row.fromContact.nickname}</span>
		}
	},
	toPuid: false,
	customID: false,
	nickname: false,
	'detail': {
		title: '会话详情',
		width: width.w_8,
		render(h, context) {
			const row = context.row
			let url
			if (context.row.type === 2) {
				url = AppRoutes.ChatSession.groupMessage(row.fromContact.id, row.toContact.id, '', row.toContact.nickname || '')
			} else {
				url = AppRoutes.ChatSession.chatMessage(row.fromContact.id, row.toContact.id, '', row.toContact.nickname || '')
			}

			return <a onClick={() => { App.push(url) }}>详情</a>
		}
	}
}

export default tableColumnsByDomain(Session, options)
