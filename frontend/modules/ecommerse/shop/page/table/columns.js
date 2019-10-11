import { tableColumnsByDomain, filterTableRowActions } from '../../../../../scripts/utils/table-utils'
import { labelActions, constantText } from '../../../../../scripts/utils/table-renders'
import Shop from '../../../../../models/ecommerse/shop'
import Constant from '../../../../../configs/constant'
import AppProxy from '../../../../../scripts/common/appProxy'
import AppRoutes from '../../../../../configs/AppRoutes'
const width = App.options.styles.table.width
// 授权的操作
const permittedActions = App.data.actions || []

const rowActions = ['update']
const filteredActions = filterTableRowActions(rowActions, permittedActions)
const options = {
	title: {
		width: width.w_20,
		render(h, context) {
			return <span>{context.row.title}</span>
		}
	},
	platformId: {
		width: width.w_12,
		title: '平台',
		render(h, context) {
			return constantText.call(this, h, context, context.row.platformId, Constant.PlatformMap)
		}
	},
	outerShopId: {
		width: width.w_12,
		title: '平台店铺ID',
		render(h, context) {
			return <span>{context.row.outerShopId}</span>
		}
	},
	status: {
		width: width.w_8,
		title: '授权成功',
		render(h, context) {
			if(context.row.extra && context.row.extra.access_token){
				return <span>是</span>
			}else {
				return <span>否</span>
			}
		}
	},
	url: {
		width: width.w_24,
		render(h, context) {
			const onClick = async() => {
				const row = context.row
				AppProxy.do_push(AppRoutes.Shop.detail(row.id))
			}
			return <a onClick={onClick}><span>{context.row.url}</span></a>
		}
	},
	ctime: {
		width: width.datetime,
		render(h, context) {
			return <span>{dateformat(new Date(context.row.ctime), 'yyyy-mm-dd HH:MM:ss')}</span>
		}
	},
	_actions: filteredActions.length > 0 ? {
		title: '操作',
		width: width[`label_actions_${filteredActions.length}`],
		render(h, context) {
			return labelActions.call(this, h, context, Shop, filteredActions)
		}
	} : false
}

export default tableColumnsByDomain(Shop, options)
