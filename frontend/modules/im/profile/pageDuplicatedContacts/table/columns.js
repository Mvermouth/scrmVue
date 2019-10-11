import Contact from '../../../../../models/im/contact'
import Relation from '../../../../../models/im/relation'
import { tableColumnsByDomain } from '../../../../../scripts/utils/table-utils'
import { constantText, longText } from '../../../../../scripts/utils/table-renders'
import { buttonActions } from '../../../../../scripts/utils/table-renders'
import Constant from '../../../../../configs/constant'
import { parseUrl } from '../../../../../scripts/utils/url'
const { query } = parseUrl(location.href, true)
const profilePlatformUid = query.platformUid
const width = App.options.styles.table.width

const actions = [
	{ 'delete': {
		title: '删除',
		icon: '',
		type: 'info',
		onAction: ($table, { row }) => {
			App.modal({
				title: '确认删除',
				width: 400,
				content: '确认,则该好友将从微信上删除？',
				loading: true,
				onOk: async(view, $modal) => {
					try {
						await Relation.deleteFriend(profilePlatformUid, row.platformUid, row.serviceID)
						$table.load()
						App.removeModal()
						this.$Notice.success({ title: '操作成功!' })
					} catch (error) {
						$modal.cancelLoading()
					}
				}
			})
		}
	}},
	{ 'viewDup': {
		title: '重复详情',
		type: 'info',
		scrollable: true,
		onAction($list, { row }) {
			// console.log($list)
			App.modal({
				width: 800,
				title: '重复好友 - 运营号列表',
				okText: '关闭',
				render: h => {
					h = this.$root.$createElement
					return <duplicate-contact contact={row}></duplicate-contact>
				}
			})
		}
	}}
]
const options = {
	'avatar': {
		width: width.w_12,
		align: 'center',
		render(h, context) {
			const url = context.row.avatar
			return <im-avatar url={ url }></im-avatar>
		}
	},
	'customID': {
		width: width.w_12,
		render(h, context) {
			return <span>{context.row.customID || context.row.platformUid}</span>
		}
	},
	'nickname': {
		width: width.w_12
	},
	'signature': {
		width: width.w_13,
		ellipsis: true,
		render(h, context) {
			const signature = context.row.signature
			return longText.call(this, h, context, signature, true)
		}
	},
	'gender': {
		width: width.w_12,
		render(h, context) {
			const value = context.row.gender || 0
			return constantText.call(this, h, context, value, Constant.Gender)
		}
	},
	'country': {
		width: width.w_10
	},
	'state': {
		width: width.w_12
	},
	'city': {
		width: width.w_12
	},
	'ctime': {
		width: width.datetime,
		render(h, context) {
			const ctime = dateformat(new Date(context.row.ctime), 'yyyy-mm-dd HH:MM:ss')
			return <span>{ctime}</span>
		}
	},
	_actions: actions.length > 0 ? {
		title: '操作',
		after: 'nickname',
		width: width[`label_actions_${actions.length + 1}`],
		render(h, context) {
			return buttonActions.call(this, h, context, Contact, actions)
		}
	} : false
}

export default tableColumnsByDomain(Contact, options)
