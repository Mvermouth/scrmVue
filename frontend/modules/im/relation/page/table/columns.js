import AppRoutes from '../../../../../configs/AppRoutes'
import Relation from '../../../../../models/im/relation'
import { tableColumnsByDomain } from '../../../../../scripts/utils/table-utils'
import { constantText } from '../../../../../scripts/utils/table-renders'
import { findComponentDownward } from '../../../../../scripts/utils/ui'
import Constant from '../../../../../configs/constant'
const width = App.options.styles.table.width

/**
 * 设置标签 ->改为PlatformTags原来为tags
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
	'contactDupCount': {
		width: width.w_6,
		title: '重复次数',
		after: 'order',
		render(h, context) {
			const row = context.row
			const contact = row.contact
			const name = contact.customID || contact.nickname || ''
			return <a onClick={() => { App.push(AppRoutes.Relation.duplicatedProfiles(contact.platformUid, name)) }}>{row.contactDupCount}</a>
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
		after: 'details',
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
	order: false,
	// order: {
	// 	width: width.w_10,
	// 	title: '订单信息',
	// 	after: 'employee',
	// 	render(h, context) {
	// 		return <div class='padding10-0 tl'>
	// 			<span>
	// 				<div>
	// 					<span class='info-name'>订单总数：</span>
	// 					<span class='info-value'>{0}</span>
	// 				</div>
	// 				<div>
	// 					<span class='info-name'>订单总金额：</span>
	// 					<span class='info-value'>{0}</span>
	// 				</div>
	// 			</span>
	// 		</div>
	// 	}
	// },
	'details': {
		title: '聊天会话',
		width: width.w_8,
		after: 'profile.customID',
		render(h, context) {
			const modalUim = findComponentDownward(this.$root, 'modal-uim')
			const row = context.row
			const profile = row.profile
			const contact = row.contact
			const url = AppRoutes.ChatSession.chatMessage(profile.contactID, contact.id, '', profile.nickname)
			if (App.data.enableUim) {
				return <div><a onClick={() => { App.push(url) }}>详情</a><br /><a onClick={() => { modalUim && modalUim.open(profile.contactID, contact.id) }}>联系好友</a></div>
			} else {
				return <div><a onClick={() => { App.push(url) }}>详情</a></div>
			}
		}
	},
	status: false,
	alias: false,
	'favorite': false,
	'requestTime': {
		after: 'contactDupCount',
		width: width.datetime
	},
	'approvedTime': {
		after: 'requestTime',
		width: width.datetime
	},
	'sourceType': {
		title: '添加方式',
		after: 'platformTags',
		width: width.w_10,
		render(h, context) {
			const value = context.row.sourceType
			if (!value) {
				return
			}
			return constantText.call(this, h, context, value, Constant.CollectSourceType)
		}

	},
	'platformTags': {
		width: width.w_8,
		after: 'approvedTime',
		render(h, context) {
			const text = []
			const tags = _.result(context.row, 'platformTags', [])
			tags.forEach(it => {
				if(it)
				text.push(<tag color='blue'>{it}</tag>)
			})
			return <div><div>{text}</div></div>
			//<a href='javascript:void(0)' onClick={() => { updateTags(context.row) }}>添加标签</a>
		}
	},
	'remark':false,
	// 'remark': {
	// 	title: '备注信息',
	// 	width: width.w_10,
	// 	after: 'platformTags',
	// 	render(h, context) {
	// 		return <a href='javascript:void(0)' onClick={() => { updateRemark(context.row) }}>{_.result(context.row, 'remark') || '添加备注'}</a>
	// 	}
	// },
	'timelineBlockByAccount': false,
	'timelineBlockByContact': false,
	'blacklistByAccount': false,
	'blacklistByContact': false,
	'ctime': false
}

export default tableColumnsByDomain(Relation, options)
