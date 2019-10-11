import AppRoutes from '../../../../../configs/AppRoutes'
import Mailbox from '../../../../../models/im/mailbox'
import Session from '../../../../../models/im/session'
import { tableColumnsByDomain } from '../../../../../scripts/utils/table-utils'
import Timeline from '../../../../../models/im/timeline'
import Message from '../../../../../models/im/message'
const width = App.options.styles.table.width

const options = {
	'title': {
		width: width.w_16
	},
	'_sender': {
		width: width.w_16,
		title: '发送人',
		before: 'ctime',
		render(h, context) {
			let text = ''
			if (context.row.metadata) {
				text = context.row.metadata.name + '(' + context.row.metadata.sn + ')'
			}
			return <span>{text}</span>
		}
	},
	'resourceId': false,
	'ctime': {
		width: width.w_12,
		title: '推荐时间',
		render(h, context) {
			return <span>{dateformat(new Date(context.row.ctime), 'yyyy-mm-dd HH:MM')}</span>
		}
	},
	'_detail': {
		width: width.w_12,
		title: '查看',
		render(h, context) {
			const onClick = async () => {
				const row = context.row
				if (row.resourceType === 1) {
					const message = await Message.retrieve(row.resourceId)
					App.push(AppRoutes.ChatSession._(message.profileContactID, message.contactID))
				} else if (row.resourceType === 2) {
					const timeline = await Timeline.retrieve(row.resourceId)
					if (timeline.isProfile === 1) {
						App.push(AppRoutes.Timeline._(timeline.contactID, row.metadata.cursor - 1000, timeline.profileContactID, timeline.nickname || ''))
					} else {
						App.push(AppRoutes.Timeline._(timeline.contactID, row.metadata.cursor - 1000, timeline.profileContactID, timeline.nickname || ''))
					}
				}
			}
			return <a onClick={onClick}>详情</a>
		}
	}
}

export default tableColumnsByDomain(Mailbox, options)
