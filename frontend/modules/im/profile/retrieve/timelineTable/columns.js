import AppRoutes from '../../../../../configs/AppRoutes'
import Timeline from '../../../../../models/im/timeline'
import { tableColumnsByDomain } from '../../../../../scripts/utils/table-utils'
import { longText, yesNo } from '../../../../../scripts/utils/table-renders'
import { toEmotion } from '../../../../../scripts/utils/misc'
const width = App.options.styles.table.width
const options = {
	'content': {
		width: width.w_18,
		ellipsis: true,
		render(h, context) {
			const content = toEmotion(context.row.content)
			return longText.call(this, h, context, content, true)
		}
	},
	'detail': {
		title: '朋友圈详情',
		width: width.w_8,
		after: 'content',
		render(h, context) {
			const row = context.row
			const id = row.publisher.id
			const date = new Date(row.publishTime).getTime() + 3000
			return <a onClick={() => { App.push(AppRoutes.Timeline._(id, date, row.profile.contactID, row.publisher.nickname || '')) }}>详情</a>
		}
	},
	'likeCount': {
		width: width.w_10,
		sortable: true,
		render(h, context) {
			return <span>{context.row.likeCount || 0}</span>
		}
	},
	'commentCount': {
		width: width.w_10,
		sortable: true,
		render(h, context) {
			return <span>{context.row.commentCount || 0}</span>
		}
	},
	'replyCount': {
		width: width.w_10,
		sortable: true,
		render(h, context) {
			return <span>{context.row.replyCount || 0}</span>
		}
	},
	'isPrivate': {
		width: width.w_10,
		render(h, context) { return yesNo.call(this, h, context, context.row.isPrivate) }
	},
	'location': {
		width: width.w_16,
		render(h, context) {
			const row = context.row
			let location = ''
			if (row.location) {
				location = row.location.city + row.location.poiName + row.location.poiAddress
			}
			return `<span>${location}</span>`
		}
	},
	'publishTime': {
		width: width.w_12,
		sortable: true
	},
	'ctime': false
}

export default tableColumnsByDomain(Timeline, options)
