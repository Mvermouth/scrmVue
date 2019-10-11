import DmsSms from '../../../../../../models/dms/sms'
import { tableColumnsByDomain } from '../../../../../../scripts/utils/table-utils'
import { longText, constantText } from '../../../../../../scripts/utils/table-renders'
import Constant from '../../../../../../configs/constant'
import dateformat from 'dateformat'
const width = App.options.styles.table.width
const options = {
	contactName: {
		width: width.w_20,
		ellipsis: true,
		title: '联系人',
		render(h, context) {
			return <span>{context.row.contactName}</span>
		}
	},
	phoneNumber: {
		width: width.w_8,
		title: '联系人号码',
		render(h, context) {
			return <span>{context.row.phoneNumber}</span>
		}
	},
	content: {
		width: width.w_12,
		title: '短信内容',
		render(h, context) {
			return longText.call(this, h, context, context.row.content)
		}
	},
	direction: {
		title: '方向',
		width: width.w_12,
		render(h, context) {
			const direction = context.row.direction
			return constantText.call(this, h, context, direction, Constant.MessageDirection)
		}
	},
	sendTime: {
		width: width.w_12,
		title: '发送时间',
		render(h, context) {
			return <span>{dateformat(new Date((context.row.sendTime || 0)), 'yyyy-mm-dd HH:MM:ss')}</span>
		}
	},
	ctime: {
		width: width.w_12,
		title: '操作时间',
		render(h, context) {
			return <span>{dateformat(new Date((context.row.ctime || 0)), 'yyyy-mm-dd HH:MM:ss')}</span>
		}
	}
}

export default tableColumnsByDomain(DmsSms, options)
