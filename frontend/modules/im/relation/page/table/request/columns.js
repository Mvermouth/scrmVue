import AppRoutes from '../../../../../../configs/AppRoutes'
import Relation from '../../../../../../models/im/relation'
import { tableColumnsByDomain } from '../../../../../../scripts/utils/table-utils'
import { longText } from '../../../../../../scripts/utils/table-renders'
const width = App.options.styles.table.width
/**
 * 设置标签
 * @param {*} row
 */
const updateTags = (row) => {
	App.push(AppRoutes.Relation.updateTags(row.id, row.contact.nickname))
}
/**
 * 设置好友备注信息
 * @param {*} row
 */
const updateRemark = (row) => {
	App.push(AppRoutes.Relation.updateRemark(row.id, row.contact.nickname))
}
const options = {
	customID: {
		width: width.w_31,
		title: '好友微信信息',
		fixed: 'left',
		render(h, context) {
			const row = context.row
			return <div class='tl'>
				<div class='avatar-img padding10-0 dpib'>
					<im-avatar url={row.contact.avatar}></im-avatar>
					{row.favorite === 1 ? <div class='star'></div> : ''}
				</div>
				<im-contact-info-widget contact={Object.assign(row.contact, { fromId: row.profile.contactID, toId: row.contact.id, sourceType: row.sourceType, alias: row.alias })}></im-contact-info-widget>
			</div>
		}
	},
	'profile.customID': {
		width: width.w_22,
		title: '所属微信信息',
		after: 'customID',
		render(h, context) {
			const row = context.row
			return <div class='tl'>
				<div class='avatar-img padding10-0 dpib'>
					<im-avatar url={row.profile.avatar}></im-avatar>
				</div>
				<im-account-ower-info-widget profile={row.profile || {}}></im-account-ower-info-widget>
			</div>
		}
	},

	employee: {
		width: width.w_14,
		title: '员工信息',
		render(h, context) {
			const employee = _.result(context.row.profile, 'employee') || {}
			const employeeName = _.result(employee, 'name') || ''
			const sn = _.result(employee, 'sn')
			const departments = (_.result(employee, 'departments') || []).map(it => { return it.name }).join('')
			return <div class='padding10-0 tl'>
				<span>
					<div>
						<span class='info-name'>归属员工：</span>
						<span class='ellipsis info-value mw128 data-value'>
							<tooltip transfer content={`${employeeName}(${sn})`}>{employeeName}{sn ? `(${sn})` : ''}</tooltip>
						</span>
					</div>
					<div>
						<span class='info-name'>归属部门：</span>
						<span class='ellipsis info-value mw128 data-value'>
							<tooltip transfer content={departments}>{departments}</tooltip>
						</span>
					</div>
				</span>
			</div>
		}
	},
	status: false,
	alias: false,
	requestDesc: {
		title: '请求备注',
		width: width.w_12,
		after: 'employee',
		render(h, context) {
			return longText.call(this, h, context, context.row.requestDesc, true)
		}
	},
	'favorite': false,
	'requestTime': {
		width: width.datetime
	},
	approvedTime: false,
	// 'sourceType': {
	// 	title: '添加方式',
	// 	after: 'tags',
	// 	width: width.w_10,
	// 	render(h, context) {
	// 		const value = context.row.sourceType
	// 		if (!value) {
	// 			return
	// 		}
	// 		return constantText.call(this, h, context, value, Constant.CollectSourceType)
	// 	}
	// },
	'tags': {
		width: width.w_8,
		after: 'employee',
		render(h, context) {
			const text = []
			const tags = _.result(context.row, 'tags', [])
			tags.forEach(it => {
				text.push(<tag color='blue'>{it}</tag>)
			})
			return <div><div>{text}</div><a href='javascript:void(0)' onClick={() => { updateTags(context.row) }}>添加标签</a></div>
		}
	},
	'remark': {
		title: '备注信息',
		width: width.w_10,
		after: 'tags',
		render(h, context) {
			return <a href='javascript:void(0)' onClick={() => { updateRemark(context.row) }}>{_.result(context.row, 'remark') || '添加备注'}</a>
		}
	},
	'timelineBlockByAccount': false,
	'timelineBlockByContact': false,
	'blacklistByAccount': false,
	'blacklistByContact': false,
	'ctime': false
}

export default tableColumnsByDomain(Relation, options)
