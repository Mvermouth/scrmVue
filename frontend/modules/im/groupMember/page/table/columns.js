import AppRoutes from '../../../../../configs/AppRoutes'
import GroupMember from '../../../../../models/im/groupMember'
import Group from '../../../../../models/im/group'
import { tableColumnsByDomain } from '../../../../../scripts/utils/table-utils'
import { constantText } from '../../../../../scripts/utils/table-renders'
import Constant from '../../../../../configs/constant'
const width = App.options.styles.table.width
const contactRetrieveUrl = row => {
	const contact = row.contact
	const name = contact.nickname || contact.platformUid || ''
	return `${Group.baseUrl}/members/${contact.id}?name=${encodeURIComponent(name)}`
}
const options = {
	platformGid: false,
	'contact.avatar': {
		width: width.avatar,
		align: 'center',
		render(h, context) {
			const row = context.row
			const contact = row.contact
			const name = contact.nickname || contact.platformUid || ''
			return <a onClick={() => { App.push(AppRoutes.Group.members(contact.id, name)) }}><im-avatar url={contact.avatar}></im-avatar></a>
		}
	},
	'contact.customID': {
		width: width.w_12,
		render(h, context) {
			const row = context.row
			const contact = row.contact
			const name = contact.nickname || contact.platformUid || ''
			return <a onClick={() => { App.push(AppRoutes.Group.members(contact.id, name)) }}>{contact.customID || contact.platformUid}</a>
		}
	},
	'contact.nickname': {
		width: width.w_12
	},
	'alias': {
		width: width.w_12,
		after: 'contact.nickname'
	},
	'contact.gender': {
		width: width.w_10,
		render(h, context) {
			const gender = context.row.contact.gender || 0
			return constantText.call(this, h, context, gender, Constant.Gender)
		}
	},
	'contact.country': {
		width: width.w_10
	},
	'contact.state': {
		width: width.w_10
	},
	'contact.city': {
		width: width.w_10
	},
	'ctime': {
		width: width.w_12
	}
}

export default tableColumnsByDomain(GroupMember, options)
