import Contact from '../../../../../models/im/contact'
import { tableColumnsByDomain } from '../../../../../scripts/utils/table-utils'
import { constantText, longText } from '../../../../../scripts/utils/table-renders'
import Constant from '../../../../../configs/constant'
const width = App.options.styles.table.width

const options = {
	'avatar': {
		width: width.w_12,
		align: 'center',
		render(h, context) {
			const url = context.row.avatar
			return <im-avatar url={ url }></im-avatar>
		}
	},
	'customID': {
		width: width.w_12,
		render(h, context) {
			return <span>{context.row.customID || context.row.platformUid}</span>
		}
	},
	'nickname': {
		width: width.w_12
	},
	'signature': {
		width: width.w_13,
		ellipsis: true,
		render(h, context) {
			const signature = context.row.signature
			return longText.call(this, h, context, signature, true)
		}
	},
	'gender': {
		width: width.w_12,
		render(h, context) {
			const value = context.row.gender || 0
			return constantText.call(this, h, context, value, Constant.Gender)
		}
	},
	'country': {
		width: width.w_10
	},
	'state': {
		width: width.w_12
	},
	'city': {
		width: width.w_12
	},
	'ctime': {
		width: width.datetime,
		render(h, context) {
			const ctime = dateformat(new Date(context.row.ctime), 'yyyy-mm-dd HH:MM:ss')
			return <span>{ctime}</span>
		}
	}
}

export default tableColumnsByDomain(Contact, options)
