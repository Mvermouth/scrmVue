import Audit from '../../../../../models/dms/auditLog'
import { tableColumnsByDomain } from '../../../../../scripts/utils/table-utils'
import { longText, constantText } from '../../../../../scripts/utils/table-renders'
import Constant from '../../../../../configs/constant'
import dateformat from 'dateformat'
const width = App.options.styles.table.width
const options = {
	ctime: {
		width: width.w_12,
		title: '操作时间',
		render(h, context) {
			return <span>{dateformat(new Date((context.row.ctime || 0)), 'yyyy-mm-dd HH:MM:ss')}</span>
		}
	},
	detail: {
		width: width.w_20,
		ellipsis: true,
		title: '内容',
		render(h, context) {
			const detail = context.row.detail
			return longText.call(this, h, context, detail, true)
		}
	},
	action: {
		width: width.w_8,
		title: '操作类型',
		render(h, context) {
			const action = context.row.action || 0
			return constantText.call(this, h, context, action, Constant.AuditLogAction)
		}
	},
	operatorNick: {
		width: width.w_12,
		title: '操作人',
		render(h, context) {
			return <span>{context.row.operatorNick}</span>
		}
	},
	ip: {
		width: width.w_8,
		title: 'IP',
		render(h, context) {
			return <span>{context.row.ip}</span>
		}
	},
	ua: {
		width: width.w_20,
		title: 'user-agent',
		ellipsis: true,
		render(h, context) {
			const ua = context.row.ua
			return longText.call(this, h, context, ua, true)
		}
	}
}

export default tableColumnsByDomain(Audit, options)
