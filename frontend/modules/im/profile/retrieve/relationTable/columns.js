import AppRoutes from '../../../../../configs/AppRoutes'
import Relation from '../../../../../models/im/relation'
import Session from '../../../../../models/im/session'
import { tableColumnsByDomain } from '../../../../../scripts/utils/table-utils'
import { constantText } from '../../../../../scripts/utils/table-renders'
import Constant from '../../../../../configs/constant'
const width = App.options.styles.table.width
// 弹窗设置标签
const updateTags = (row) => {
	App.push(AppRoutes.Relation.updateTags(row.id, row.contact.nickname))
}
// 弹窗设置还有备注
const updateRemark = (row) => {
	App.push(AppRoutes.Relation.updateRemark(row.id, row.contact.nickname))
}
const options = {
	customID: {
		width: width.w_31,
		title: '好友微信信息',
		fixed: 'left',
		render(h, context) {
			const row = context.row
			return <div class='tl'>
				<div class='avatar-img padding10-0 dpib'>
					<im-avatar url={row.contact.avatar}></im-avatar>
					{row.favorite === 1 ? <div class='star'></div> : ''}
				</div>
				<im-contact-info-widget contact={Object.assign(row.contact, { fromId: row.profile.contactID, toId: row.contact.id, sourceType: row.sourceType, alias: row.alias })}></im-contact-info-widget>
			</div>
		}
	},
	signAmount: {
		title: '签收总金额',
		width: width.w_8,
		after: 'customID',
		render(h, conttext) {
			return <span>0</span>
		}
	},
	orderNums: {
		title: '订单次数',
		width: width.w_8,
		after: 'signAmount',
		render(h, context) {
			return <span>0</span>
		}
	},
	'remark': {
		title: '备注信息',
		width: width.w_10,
		after: 'approvedTime',
		render(h, context) {
			return <a href='javascript:void(0)' onClick={() => { updateRemark(context.row) }}>{_.result(context.row, 'remark') || '添加备注'}</a>
		}
	},
	'chatSession': {
		title: '聊天会话',
		width: width.w_8,
		after: 'orderNums',
		render(h, context) {
			const row = context.row
			const url = AppRoutes.ChatSession.chatMessage(row.profile.contactID, row.contact.id, '', row.profile.nickname)
			return <a onClick={() => { App.push(url) }}>详情</a>
		}
	},
	alias: false,
	'status': false,
	'favorite': false,
	'sourceType': {
		title: '添加方式',
		after: 'tags',
		width: width.w_10,
		render(h, context) {
			const value = context.row.sourceType
			if (!value) {
				return
			}
			return constantText.call(this, h, context, value, Constant.CollectSourceType)
		}

	},
	'tags': {
		width: width.w_8,
		after: 'chatSession',
		render(h, context) {
			const text = []
			const tags = _.result(context.row, 'tags', [])
			tags.forEach(it => {
				text.push(<tag color='blue'>{it}</tag>)
			})
			return <div><div>{text}</div><a href='javascript:void(0)' onClick={() => { updateTags(context.row) }}>添加标签</a></div>
		}
	},
	'requestTime': {
		after: 'sourceType',
		width: width.datetime
	},
	'approvedTime': {
		after: 'requestTime',
		width: width.datetime
	},
	'ctime': false,
	'timelineBlockByAccount': false,
	'timelineBlockByContact': false,
	'blacklistByAccount': false,
	'blacklistByContact': false
}

export default tableColumnsByDomain(Relation, options)
