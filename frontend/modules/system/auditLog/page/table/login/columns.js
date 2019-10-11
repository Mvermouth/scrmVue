import AuditLog from '../../../../../../models/auth/auditLog'
import { tableColumnsByDomain } from '../../../../../../scripts/utils/table-utils'
const width = App.options.styles.table.width
const options = {
	username: {
		title: '用户',
		width: width.w_12,
		render(h, context) {
			return <span>{context.row.username}</span>
		}
	},
	clientIp: {
		title: '登录IP',
		width: width.w_12,
		render(h, context) {
			return <span>{context.row.clientIp}</span>
		}
	},
	ctime: {
		title: '登录时间',
		width: width.w_12,
		render(h, context) {
			return <span>{dateformat(context.row.ctime, 'yyyy-mm-dd HH:MM:ss')}</span>
		}
	}
}

export default tableColumnsByDomain(AuditLog, options)
