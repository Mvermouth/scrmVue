import Profile from '../../../../../models/marketing/profile'
import { tableColumnsByDomain, filterTableRowActions } from '../../../../../scripts/utils/table-utils'
import { labelActions, avatar, img, constantText, longText } from '../../../../../scripts/utils/table-renders'
const width = App.options.styles.table.width

// 授权的操作
const permittedActions = App.data.actions || []
const rowActions = ['delete']
const filteredActions = filterTableRowActions(rowActions, permittedActions)

const profileName = row => {
	return row.nickname || row.platformUid || ''
}

const profileUrl = row => {
	return `${Profile.baseUrl}/retrieve/${row[Profile.primaryKey]}?name=${encodeURIComponent(profileName(row))}`
}

const options = {
	avatar: {
		width: width.avatar,
		align: 'center',
		render(h, context) {
			const url = context.row.avatar
			const status = context.row.online
			return <im-avatar url={ url }></im-avatar>
		}
	},
	customID: {
		render(h, context) {
			return <span>{context.row.customID || context.row.platformUid || ''}</span>
		}
	},
	nickname: {
		render(h, context) {
			return <span>{context.row.nickname || ''}</span>
		}
	}
}

export default tableColumnsByDomain(Profile, options)
