import DmsCall from '../../../../../../models/dms/call'
import { tableColumnsByDomain } from '../../../../../../scripts/utils/table-utils'
import { constantText } from '../../../../../../scripts/utils/table-renders'
import Constant from '../../../../../../configs/constant'

const width = App.options.styles.table.width
const options = {
	username: {
		title: '联系人姓名',
		width: width.w_12,
		render(h, context) {
			return <span>{context.row.contactName}</span>
		}
	},
	clientIp: {
		title: '电话号码',
		width: width.w_12,
		render(h, context) {
			return <span>{context.row.phoneNumber}</span>
		}
	},
	duration: {
		title: '通话时长',
		width: width.w_12,
		render(h, context) {
			return <span>{context.row.duration}s</span>
		}
	},
	direction: {
		title: '方向',
		width: width.w_12,
		render(h, context) {
			const direction = context.row.direction
			return constantText.call(this, h, context, direction, Constant.CallDirection)
		}
	},
	callTime: {
		title: '呼叫时间',
		width: width.w_12,
		render(h, context) {
			return <span>{dateformat(context.row.callTime, 'yyyy-mm-dd HH:MM:ss')}</span>
		}
	},
	ctime: {
		title: '创建时间',
		width: width.w_12,
		render(h, context) {
			return <span>{dateformat(context.row.ctime, 'yyyy-mm-dd HH:MM:ss')}</span>
		}
	}
}

export default tableColumnsByDomain(DmsCall, options)
