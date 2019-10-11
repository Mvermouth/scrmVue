import Fund from '../../../../../models/im/fund'
import { tableColumnsByDomain } from '../../../../../scripts/utils/table-utils'
import { constantText } from '../../../../../scripts/utils/table-renders'
import Constant from '../../../../../configs/constant'

const width = App.options.styles.table.width
const options = {
	'profile.customID': {
		width: width.w_22,
		title: '所属微信信息',
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
	'contact.customID': {
		title: '好友微信信息',
		width: width.w_32,
		render(h, context) {
			if ([Constant.ExchangeType.Unknown.value, Constant.ExchangeType.CreditCardRefund.value, Constant.ExchangeType.Withdraw.value].includes(context.row.type)) {
				return <span>-</span>
			}
			const row = context.row
			const contact = row.contact || {}
			const profile = row.profile || {}
			return <div class='tl'>
				<div class='avatar-img padding10-0 dpib'>
					<im-avatar url={contact.avatar}></im-avatar>
				</div>
				<im-contact-info-widget contact={Object.assign(contact, { fromId: profile.contactID, toId: contact.id })}></im-contact-info-widget>
			</div>
		}
	},
	'type': {
		width: width.w_12,
		render(h, context) {
			const type = context.row.type
			return constantText.call(this, h, context, type, Constant.ExchangeType)
		}
	},
	// 'detail': {
	// 	title: '会话详情',
	// 	width: width.w_6,
	// 	render(h, context) {
	// 		if ([Constant.ExchangeType.Unknown.value, Constant.ExchangeType.CreditCardRefund.value, Constant.ExchangeType.Withdraw.value].includes(context.row.type)) {
	// 			return <span>-</span>
	// 		}
	// 		const url = `${Session.baseUrl}/chat?fromId=${context.row.profile.contactID}&toId=${context.row.contact.id}&currentTab=session&name=${encodeURIComponent(context.row.profile.nickname)}`
	// 		return <a onClick={ () => { } }>详情</a>
	// 	}
	// },
	'direction': {
		width: width.w_12,
		render(h, context) {
			if ([Constant.ExchangeType.Unknown.value, Constant.ExchangeType.CreditCardRefund.value, Constant.ExchangeType.Withdraw.value].includes(context.row.type)) {
				return <span>-</span>
			}
			const direction = context.row.direction
			return constantText.call(this, h, context, direction, Constant.MessageDirection)
		}
	},
	'amount': {
		width: width.w_12,
		render(h, context) {
			const amount = (context.row.amount || 0) / 100 + ' 元 '
			return <span>{amount}</span>
		}
	},
	'sendTime': {
		width: width.w_12
	},
	ctime: false
}

export default tableColumnsByDomain(Fund, options)
