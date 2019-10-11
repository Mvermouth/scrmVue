import Timeline from '../../../../../models/im/timeline'
import { tableColumnsByDomain } from '../../../../../scripts/utils/table-utils'
import { longText, yesNo } from '../../../../../scripts/utils/table-renders'
import AppRoutes from '../../../../../configs/AppRoutes'
import { toEmotion } from '../../../../../scripts/utils/misc'
const width = App.options.styles.table.width
import { parseUrl } from '../../../../../scripts/utils/url'
const { query } = parseUrl(location.href, true)
const moment = require('moment')
const isProfile = query.type === 'profile'
const options = {
	'publisher.nickname': {
		width: width.w_12
	},
	'publisher.customID': {
		title: '发布者微信号',
		width: width.w_12,
		render(h, context) {
			return <span>{context.row.publisher.customID || '-'}</span>
		}
	},
	'publisher.platformUid': {
		title: '发布者微信ID',
		width: width.w_12,
		render(h, context) {
			if (isProfile) {
				return <a onClick={() => { App.push(AppRoutes.Profile.id(context.row.profile.id, context.row.profile.nickname)) }}>{context.row.publisher.platformUid}</a>
			} else {
				const onClick = async() => {
					App.push(AppRoutes.Relation._(context.row.profile.contactID, context.row.publisher.id, context.row.publisher.nickname))
				}
				return <a onClick={onClick}>{context.row.publisher.platformUid}</a>
			}
		}
	},
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
			return <a onClick={() => { App.push(AppRoutes.Timeline._(id, date, row.profile.contactID, row.publisher.nickname)) }}>详情</a>
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
	'isPrivate': false,
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
		sortable: true,
		render(h, context) {
			return <span>{moment(context.row.publishTime).format('YYYY-MM-DD HH:mm:ss') || ""}</span>
		}
	},
	'ctime': {
		width: width.w_12,
		sortable: true
		,render(h, context) {
			return <span>{moment(context.row.ctime).format('YYYY-MM-DD HH:mm:ss') || ""}</span>
		}
	}
}
if (!isProfile) {
	options['profile.customID'] = {
		title: '运营微信号',
		width: width.w_12,
		after: 'detail',
		render(h, context) {
			return <span>{context.row.profile.customID || '-'}</span>
		}
	}
	options['profile.platformUid'] = {
		title: '运营微信ID',
		width: width.w_12,
		after: 'profile.customID',
		render(h, context) {
			return <a onClick={() => { App.push(AppRoutes.Profile.id(context.row.profile.id, context.row.profile.nickname)) }}>{context.row.profile.platformUid}</a>
		}
	}
	options['profile.nickname'] = {
		title: '运营号昵称',
		width: width.w_12,
		after: 'profile.platformUid',
		render(h, context) {
			return <a onClick={() => { App.push(AppRoutes.Profile.id(context.row.profile.id, context.row.profile.nickname)) }}>{context.row.profile.nickname}</a>
		}
	}
}
export default tableColumnsByDomain(Timeline, options)
