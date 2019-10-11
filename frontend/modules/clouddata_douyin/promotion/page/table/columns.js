import Promotion from '../../../../../models/clouddata/douyin/promotion'
import { tableColumnsByDomain, filterTableRowActions } from '../../../../../scripts/utils/table-utils'
import { labelActions, constantText } from '../../../../../scripts/utils/table-renders'
import AppRoutes from '../../../../../configs/AppRoutes'
const width = App.options.styles.table.width

// 授权的操作
const rowActions = [
	/*{
		detail: {
			title: '详情',
			onAction($list, { row, column, index }, domain) {
				const id = row.id
				const nickname = row.nickname
				App.push(AppRoutes.Clouddata.Douyin.Promotion.id(id, nickname))
			}
		}
	}*/
]
const filteredActions = rowActions	//filterTableRowActions(rowActions, App.data.actions || [])

const options = {
	image: {
		width: width.avatar,
		title: '主图',
		align: 'center',
		render(h, context) {
			const row = context.row
			const url = row.image.url_list[0]
			return <im-avatar url={url}></im-avatar>
		}
	},
	sales: {
		title: '全网销量',
		sortable: true
	},
	gid: {
		sortable: true
	},
	elastic_type: {
		sortable: true
	},
	promotion_source: {
		sortable: true
	},
	mtime: {
		width: width.w_8,
		title: '记录更新时间',
		render(h, context) {
			const dateStr = new Date(parseInt(context.row.mtime * 1000)).toLocaleString()
			return <span>{dateStr}</span>
		}
	},
	_actions: filteredActions.length > 0 ? {
		title: '操作',
		width: width.w_8,
		render(h, context) {
			return labelActions.call(this, h, context, Promotion, filteredActions)
		}
	} : false
}

export default tableColumnsByDomain(Promotion, options)
