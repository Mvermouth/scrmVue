import Message from '../../../../../models/im/message'
import Session from '../../../../../models/im/session'
import { tableColumnsByDomain } from '../../../../../scripts/utils/table-utils'
import { longText } from '../../../../../scripts/utils/table-renders'
import Constant from '../../../../../configs/constant'
import { toEmotion, value2Text } from '../../../../../scripts/utils/misc'
import AppProxy from '../../../../../scripts/common/appProxy'
import AppRoutes from '../../../../../configs/AppRoutes'

const width = App.options.styles.table.width
const options = {
	'avatar': {
		width: width.avatar,
		title: '头像',
		render(h, context) {
			const url = context.row.avatar || ''
			return <a><im-avatar url={url}></im-avatar></a>
		}
	},
	customID: {
		width: width.w_12,
		title: '好友微信号',
		after: 'nickname',
		render(h, context) {
			return <span>{context.row.customID || context.row.platformUid}</span>
		}
	},
	'nickname': {
		width: width.w_12,
		title: '好友昵称',
		after: 'avatar',
		render(h, context) {
			return <a onClick={() => { AppProxy.do_push(AppRoutes.Relation._(context.row.profileContactID, context.row.contactID, context.row.nickname)) }}>{context.row.nickname || ''}</a>
		}
	},
	'content': {
		width: width.w_20,
		title: '消息内容',
		ellipsis: true,
		after: 'customID',
		render(h, context) {
			const row = context.row
			const type = _.result(row, 'messageType')
			const url = AppRoutes.ChatSession.sessionMessage(row.profileContactID, row.contactID, row.id, row.profileCustomID)
			if (!type) {
				return ''
			}
			if (type === Constant.MessageType.Text.value) {
				const content = toEmotion(context.row.textContent)
				return <a onClick={() => { App.push(url) }}>{longText.call(this, h, context, content, true)}</a>
			} else if (type === Constant.MessageType.Link.value) {
				return <a onClick={() => { App.push(url) }}>{`[链接] ${JSON.parse(context.row.objectContent).title}`}</a>
			} else {
				return <a onClick={() => { App.push(url) }}>{`[${value2Text(Constant.MessageType, type)}]`}</a>
			}
		}
	},
	messageType: {
		width: width.w_6,
		title: '消息类型',
		after: 'content',
		render(h, context) {
			const type = _.result(context.row, 'messageType')
			return <span>{value2Text(Constant.MessageType, type)}</span>
		}
	},
	direction: {
		width: width.w_6,
		title: '消息来源',
		after: 'messageType',
		render(h, context) {
			const direction = _.result(context.row, 'direction')
			return <span>{direction === 1 ? '好友' : '自己'}</span>
		}
	},
	'sendTime': {
		width: width.w_16,
		after: 'direction',
		render(h, context) {
			return <span>{context.row.sendTime}</span>
		}
	}

}

export default tableColumnsByDomain(Message, options)
