import DmsApp from '../../../../../../models/dms/app'
import { tableColumnsByDomain } from '../../../../../../scripts/utils/table-utils'
const width = App.options.styles.table.width
const options = {
	name: {
		title: '名称',
		width: width.w_12,
		render(h, context) {
			return <span>{context.row.name}</span>
		}
	},
	bundleId: {
		title: '包名',
		width: width.w_12,
		render(h, context) {
			return <span>{context.row.bundleId}</span>
		}
	},
	appVersion: {
		title: '版本',
		width: width.w_12,
		render(h, context) {
			return <span>{context.row.appVersion}</span>
		}
	},
	appSize: {
		title: '大小',
		width: width.w_12,
		render(h, context) {
			return <span>{context.row.appSize}</span>
		}
	},
	installedDate: {
		title: '安装时间',
		width: width.w_12,
		render(h, context) {
			return <span>{dateformat(context.row.installedDate, 'yyyy-mm-dd HH:MM:ss')}</span>
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

export default tableColumnsByDomain(DmsApp, options)
