import Audit from '../../../../../models/im/audit'
import { tableColumnsByDomain } from '../../../../../scripts/utils/table-utils'
import { longText, constantText } from '../../../../../scripts/utils/table-renders'
import Constant from '../../../../../configs/constant'
import dateformat from 'dateformat'
const width = App.options.styles.table.width
const options = {
	type: {
		width: width.w_12,
		render(h, context) {
			const type = context.row.type || 0
			return constantText.call(this, h, context, type, Constant.WxActionSetting)
		}
	},
	content: {
		width: width.w_20,
		ellipsis: true,
		render(h, context) {
			const content = context.row.content
			return longText.call(this, h, context, content, true)
		}
	},
	actionTime: {
		width: width.w_12,
		render(h, context) {
			return <span>{dateformat(new Date((context.row.ctime || 0)), 'yyyy-mm-dd HH:MM:ss')}</span>
		}
	}
}

export default tableColumnsByDomain(Audit, options)
