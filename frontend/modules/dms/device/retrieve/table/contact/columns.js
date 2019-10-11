import DmsContact from '../../../../../../models/dms/contact'
import { tableColumnsByDomain } from '../../../../../../scripts/utils/table-utils'
const width = App.options.styles.table.width
const options = {
	name: {
		title: '姓名',
		width: width.w_12,
		render(h, context) {
			return <span>{context.row.name || ''}</span>
		}
	},
	mobilePhone: {
		title: '手机号码',
		width: width.w_12,
		render(h, context) {
			return <span>{context.row.mobilePhone}</span>
		}
	},
	homePhone: {
		title: '家庭电话',
		width: width.w_12,
		render(h, context) {
			return <span>{context.row.homePhone}</span>
		}
	},
	groupName: {
		title: '群组',
		width: width.w_10,
		render(h, context) {
			return <span>{context.row.groupName}</span>
		}
	},
	note: {
		title: '备注',
		width: width.w_12,
		render(h, context) {
			return <span>{context.row.note}</span>
		}
	},
	ctime: {
		title: '上报时间',
		width: width.w_12,
		render(h, context) {
			return <span>{dateformat(context.row.ctime, 'yyyy-mm-dd HH:MM:ss')}</span>
		}
	}
}

export default tableColumnsByDomain(DmsContact, options)
