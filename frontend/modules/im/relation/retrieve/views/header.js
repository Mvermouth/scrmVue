/**
 * 构建 PageHeader 模版参数
 */
import AppRoutes from '../../../../../configs/AppRoutes'
import { tags, yesNo } from '../../../../../scripts/utils/page-renders'
import defaultAvatar from '../../../../../images/default-avatar.png'
import Constant from '../../../../../configs/constant'
import { value2Text } from '../../../../../scripts/utils/misc'
import { findComponentDownward } from '../../../../../scripts/utils/ui'

export default relation => {
	// 过滤出有权限查看的子内容
	const user = App.data.user || {}
	const permissions = App.data.permissions || []
	const tabs = [
		{ name: { '会话列表': 'session' }, resourceUri: 'im.message', actions: ['view', 'view_mine', 'view_departments'] },
		// { name: { '订单列表': 'order' }, resourceUri: 'ecommerse.order', actions: ['view', 'view_mine', 'view_departments'] },
		{ name: { '资金明细': 'fund' }, resourceUri: 'im.fund', actions: ['view', 'view_mine', 'view_departments'] },
		{ name: { '朋友圈明细': 'timeline' }, resourceUri: 'im.timeline', actions: ['view', 'view_mine', 'view_departments'] }
	].filter(it => {
		return !it.resourceUri || user.superUser || permissions.some(it2 => it2.resourceUri === it.resourceUri && it.actions.includes(it2.action))
	}).map(it => it.name)

	const contact = relation.contact
	const profile = relation.profile

	const profileName = profile.nickname || profile.platformUid || ''
	const contactName = contact.nickname || contact.platformUid || ''
	const profileUrl = AppRoutes.Profile.id(profile.id, profileName)
	const editUrl = AppRoutes.Relation.edit(relation.id, contactName)

	const actions = [
		{ '编辑': function () { App.push(editUrl) } }
	]
	if (App.data.enableUim) {
		actions.push({
			'联系好友': function () {
				const modalUim = findComponentDownward(this.$root, 'modal-uim')
				if (modalUim) {
					modalUim.open(profile.contactID, contact.id)
				}
			}
		})
	}

	return {
		title: `好友：${contact.nickname || contact.platformUid || '未知'}`,
		logo: contact.avatar || defaultAvatar,
		content: [
			{ '微信号': contact.customID || '' },
			{ '昵称': contact.nickname || '' },
			{ '备注名': relation.alias || '' },
			{ '性别': value2Text(Constant.Gender, contact.gender || 0) },
			{
				'地区': h => {
					let address = ''
					if (contact.state) {
						address = contact.state + '/' + contact.city
					}
					return <span>{address}</span>
				}
			},
			{
				'归属微信': h => {
					return <a onClick={() => { App.push(profileUrl) }}>{(profile && (profile.nickname || profile.customID)) || ''}</a>
				}
			},
			{ '归属员工': (profile && profile.employee && (profile.employee.name + ' ' + profile.employee.sn)) || '' },
			{ '渠道': relation.addSource || '' },
			{ '星标': h => yesNo(h, relation.favorite) },
			{ '运营号朋友圈可见': h => yesNo(h, relation.timelineBlockByAccount) },
			{ '好友朋友圈可见': h => yesNo(h, relation.timelineBlockByContact) },
			{ '被我拉黑': h => yesNo(h, relation.blacklistByAccount) },
			{ '把我拉黑': h => yesNo(h, relation.blacklistByContact) },
			{ '请求添加时间': relation.requestTime },
			{ '通过日期': relation.approvedTime },
			{ '录入日期': relation.ctime },
			{ '标签': h => tags(h, relation.tags || [], 'blue') },
			{ '签名': { content: contact.signature, long: true } },
			{ '备注': { content: relation.remark || '', long: true } }
		],
		extra: [
			// {'成交总额': '¥3011.30'},
			// {'订单数': 30}
		],
		actions,
		tabs
	}
}
