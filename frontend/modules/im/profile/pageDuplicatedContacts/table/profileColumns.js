import Contact from '../../../../../models/im/contact'
import { tableColumnsByDomain } from '../../../../../scripts/utils/table-utils'
import { constantText, longText } from '../../../../../scripts/utils/table-renders'
import Constant from '../../../../../configs/constant'
const width = App.options.styles.table.width

const options = {
	'avatar': {
		width: width.w_8,
		align: 'center',
		render(h, context) {
			const url = context.row.avatar
			return <im-avatar url={ url }></im-avatar>
		}
	},
	'customID': {
		width: width.w_8,
		render(h, context) {
			return <span>{context.row.customID || context.row.platformUid}</span>
		}
	},
	'nickname': {
		width: width.w_12
	},
	'signature': false,
	'gender': false,
	'country': false,
	'state': false,
	'city': false,
	'ctime': {
		width: width.datetime,
		render(h, context) {
			const ctime = dateformat(new Date(context.row.ctime), 'yyyy-mm-dd HH:MM:ss')
			return <span>{ctime}</span>
		}
	}
}

export default tableColumnsByDomain(Contact, options)
