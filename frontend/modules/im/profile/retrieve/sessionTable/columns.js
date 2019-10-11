
import Session from '../../../../../models/im/session'
import Group from '../../../../../models/im/group'
import { tableColumnsByDomain } from '../../../../../scripts/utils/table-utils'
import { longText } from '../../../../../scripts/utils/table-renders'
import AppRoutes from '../../../../../configs/AppRoutes'
import Constant from '../../../../../configs/constant'
import { toEmotion, value2Text } from '../../../../../scripts/utils/misc'
const width = App.options.styles.table.width

const options = {
	'avatar': {
		width: width.avatar,
		title: '头像',
		render(h, context) {
			const onClick = async () => {
				const row = context.row
				const type = context.row.type
				if (type === 2) {
					App.push(AppRoutes.Group.id(row.toId, row.toContact.nickname))
				} else {
					App.push(AppRoutes.Relation._(row.fromContact.id, row.toContact.id, row.toContact.nickname))
				}
			}
			const url = context.row.toContact ? context.row.toContact.avatar : ''
			return <a onClick={onClick}><im-avatar url={url}></im-avatar></a>
		}
	},
	customID: {
		width: width.w_12,
		title: '好友微信号',
		render(h, context) {
			const onClick = async () => {
				const row = context.row
				if (row.type === 2) {
					App.push(AppRoutes.Group.id(row.toContact.toId, context.row.toContact.nickname))
				} else {
					App.push(AppRoutes.Relation._(row.fromContact.id, row.toContact.id, row.toContact.nickname))
				}
			}
			const name = context.row.toContact ? context.row.toContact.customID : ''
			return <a onClick={onClick}>{name}</a>
		}
	},
	'toPuid': {
		width: width.w_12,
		title: '好友微信ID',
		after: 'avatar',
		render(h, context) {
			const onClick = async () => {
				const row = context.row
				if (row.type === 2) {
					const filter = [
						{
							filterType: 'EQ',
							property: 'profile.contactID',
							value: row.fromContact.id
						},
						{
							filterType: 'EQ',
							property: 'group.id',
							value: row.toContact.id
						}
					]
					const page = await Group.page(1, 1, filter, [])
					const groupRelation = page.content[0]
					App.push(AppRoutes.Group.id(groupRelation ? groupRelation.id : '', context.row.toContact.nickname || ''))
				} else {
					App.push(AppRoutes.Relation._(row.fromContact.id, row.toContact.id, row.toContact.nickname))
				}
			}
			const name = context.row.toContact ? context.row.toContact.platformUid : ''
			return <a onClick={onClick}>{name}</a>
		}
	},
	'nickname': {
		width: width.w_12,
		title: '好友昵称',
		render(h, context) {
			return <span>{context.row.toContact.nickname || ''}</span>
		}
	},
	'alias': {
		width: width.w_14,
		title: '好友备注',
		render(h, context) {
			return <span>{context.row.alias || ''}</span>
		}
	},
	'lastMsg': {
		width: width.w_20,
		title: '最后聊天消息',
		ellipsis: true,
		render(h, context) {
			const row = context.row
			const lastMsg = context.row.lastMsg
			const type = _.result(lastMsg, 'messageType')
			const url = AppRoutes.ChatSession.sessionMessage(row.fromContact.id, row.toContact.id, row.lastMsg.id, row.fromContact.nickname)
			if (!type) {
				return ''
			}
			if (type === Constant.MessageType.Text.value) {
				const content = toEmotion(lastMsg.textContent)
				return <a onClick={() => { App.push(url) }}>{longText.call(this, h, context, content, true)}</a>
			} else if (type === Constant.MessageType.Link.value) {
				return <a onClick={() => { App.push(url) }}>{`[链接] ${lastMsg.objectContent.title}`}</a>
			} else {
				return <a onClick={() => { App.push(url) }}>{`[${value2Text(Constant.MessageType, type)}]`}</a>
			}
		}
	},
	'lastMsgTime': {
		width: width.w_16,
		title: '最后聊天时间',
		render(h, context) {
			const sendTime = _.result(context.row.lastMsg, 'sendTime')
			return <span>{dateformat(sendTime, 'yyyy-mm-dd HH:MM:ss')}</span>
		}
	},
	fromPuid: false,
	profileCustomID: false,
	profileAvatar: false,
	profileNickname: false
}

export default tableColumnsByDomain(Session, options)
