import { tableColumnsByDomain } from '../../../../../scripts/utils/table-utils'
const width = App.options.styles.table.width

const options = {
	'platformTags': {
		title: '标签信息',
		width: width.w_32,
		fixed: 'left',
		align: 'center',
		render(h, context) {
			return <span>{context.row.platformTags}</span>
		}
	}
}

export default tableColumnsByDomain({}, options)
