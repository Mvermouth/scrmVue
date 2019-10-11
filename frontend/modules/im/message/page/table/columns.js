import Message from '../../../../../models/im/message'
import { tableColumnsByDomain } from '../../../../../scripts/utils/table-utils'
import { longText } from '../../../../../scripts/utils/table-renders'
import Constant from '../../../../../configs/constant'
import { toEmotion, value2Text } from '../../../../../scripts/utils/misc'
import AppProxy from '../../../../../scripts/common/appProxy'
import AppRoutes from '../../../../../configs/AppRoutes'

const width = App.options.styles.table.width
const options = {
	custom: {
		width: width.w_22,
		title: '好友微信信息',
		fixed: 'left',
		render(h, context) {
			const row = context.row
			return <div class='tl'>
				<div class='avatar-img padding10-0 dpib'>
					<im-avatar url={row.avatar}></im-avatar>
				</div>
				<div class='wexin-info padding10-0'>
					<div>
						<span class='info-name'>微信昵称：</span>
						<span class='info-value c-primary pointer' onClick={() => { AppProxy.do_push(AppRoutes.Relation._(row.profileContactID, row.contactID, row.nickname)) }}>
							<tooltip transfer content={row.nickname}>{row.nickname}</tooltip>
						</span>
					</div>
					<div>
						<span class='info-name'>微信ID：</span>
						<span class='ellipsis info-value'>
							<tooltip transfer content={row.platformUid}>{row.platformUid}</tooltip>
						</span>
					</div>
					<div>
						<span class='info-name'>微信号：</span>
						<span class='ellipsis info-value'>{row.customID}</span>
					</div>
				</div>
			</div>
		}
	},
	'content': {
		width: width.w_20,
		title: '消息内容',
		ellipsis: true,
		after: 'custom',
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
				return <a onClick={() => { App.push(url) }}>{`[链接] ${context.row.objectContent.title}`}</a>
			} else {
				return <a onClick={() => { App.push(url) }}>{`[${value2Text(Constant.MessageType, type)}]`}</a>
			}
		}
	},
	'profile': {
		width: width.w_22,
		title: '所属微信信息',
		after: 'content',
		render(h, context) {
			const row = context.row
			const profile = {
				nickname: row.profileNickname || '',
				contactID: row.profileContactID,
				platformUid: row.profilePlatformUid || '',
				customID: row.profileCustomID || ''
			}
			return <div class='tl'>
				<div class='avatar-img padding10-0 dpib'>
					<im-avatar url={row.profileAvatar}></im-avatar>
				</div>
				<im-account-ower-info-widget profile={profile}></im-account-ower-info-widget>
			</div>
		}
	},
	employee: {
		width: width.w_14,
		title: '员工信息',
		after: 'profile',
		render(h, context) {
			const employee = _.result(context.row, 'employee') || {}
			const employeeName = _.result(employee, 'name') || ''
			const sn = _.result(employee, 'sn')
			const departments = (_.result(employee, 'departments') || []).map(it => { return it.name }).join('')
			return <div class='padding10-0 tl'>
				<span>
					<div>
						<span class='info-name'>归属员工：</span>
						<span class='ellipsis info-value mw128 data-value'>
							<tooltip transfer content={`${employeeName}(${sn})`}>{employeeName}{sn ? `(${sn})` : ''}</tooltip>
						</span>
					</div>
					<div>
						<span class='info-name'>归属部门：</span>
						<span class='ellipsis info-value mw128 data-value'>
							<tooltip transfer content={departments}>{departments}</tooltip>
						</span>
					</div>
				</span>
			</div>
		}
	},
	messageType: {
		width: width.w_6,
		title: '消息类型',
		after: 'employee',
		render(h, context) {
			const type = _.result(context.row, 'messageType')
			return <span>{value2Text(Constant.MessageType, type)}</span>
		}
	},
	direction: {
		width: width.w_6,
		title: '消息方向',
		after: 'messageType',
		render(h, context) {
			const direction = _.result(context.row, 'direction')
			return <span>{value2Text(Constant.MessageDirection, direction)}</span>
		}
	},
	nickname: false,
	'sendTime': {
		width: width.w_16,
		after: 'direction',
		render(h, context) {
			return <span>{context.row.sendTime}</span>
		}
	}

}

export default tableColumnsByDomain(Message, options)
