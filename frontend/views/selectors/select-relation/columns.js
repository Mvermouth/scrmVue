import Relation from '../../../models/im/relation'
import { tableColumnsByDomain } from '../../../scripts/utils/table-utils'

const width = App.options.styles.table.width

const options = {
	customID: {
		width: width.w_31,
		title: '好友微信信息',
		render(h, context) {
			const row = context.row
			return 	<div class='tl'>
				<div class='avatar-img padding10-0 dpib'>
					<im-avatar url={ row.contact.avatar }></im-avatar>
					{ row.favorite === 1 ? <div class='star'></div> : '' }
				</div>
				<im-contact-info-widget contact={Object.assign(row.contact, { fromId: row.profile.contactID, toId: row.contact.id, sourceType: row.sourceType, alias: row.alias }) }></im-contact-info-widget>
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
					<im-avatar url={ row.profile.avatar }></im-avatar>
				</div>
				<im-account-ower-info-widget profile={ row.profile || {}}></im-account-ower-info-widget>
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

	alias: false,
	tags: false,
	type: false,
	status: false,
	favorite: false,
	requestTime: false,
	approvedTime: false,
	ctime: false,
	timelineBlockByAccount: false,
	timelineBlockByContact: false,
	blacklistByAccount: false,
	blacklistByContact: false
}

export default tableColumnsByDomain(Relation, options)
