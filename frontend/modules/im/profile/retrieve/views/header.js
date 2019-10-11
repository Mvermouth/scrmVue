/**
 * 构建 PageHeader 模版参数
 */
import AppRoutes from '../../../../../configs/AppRoutes'
import Profile from '../../../../../models/im/profile'
import defaultAvatar from '../../../../../images/default-avatar.png'
import { tags } from '../../../../../scripts/utils/page-renders'
export default profile => {
	// 过滤出有权限查看的子内容
	const user = App.data.user || {}
	const permissions = App.data.permissions || []
	const tabs = [
		{ name: { '好友明细': 'relation' }, resourceUri: 'im.relation', actions: ['view', 'view_mine', 'view_departments'] },
		{ name: { '消息明细': 'message' }, resourceUri: 'im.message', actions: ['view', 'view_mine', 'view_departments'] },
		{ name: { '会话列表': 'session' }, resourceUri: 'im.message', actions: ['view', 'view_mine', 'view_departments'] },
		// { name: { '订单列表': 'order' }, resourceUri: 'ecommerse.order', actions: ['view', 'view_mine', 'view_departments'] },
		{ name: { '群聊明细': 'group' }, resourceUri: 'im.group', actions: ['view', 'view_mine', 'view_departments'] },
		{ name: { '资金明细': 'fund' }, resourceUri: 'im.fund', actions: ['view', 'view_mine', 'view_departments'] },
		{ name: { '朋友圈明细': 'timeline' }, resourceUri: 'im.timeline', actions: ['view', 'view_mine', 'view_departments'] }
		// { name: { '运营日志': 'log' }}
	].filter(it => {
		return !it.resourceUri || user.superUser || permissions.some(it2 => it2.resourceUri === it.resourceUri && it.actions.includes(it2.action))
	}).map(it => it.name)

	const profileName = profile.nickname || profile.platformUid || ''
	const bank = profile.bank || {}

	return {
		title: `运营号：${profileName || '未知'}`,
		logo: profile.avatar || defaultAvatar,
		content: [
			{ '微信号/ID': profile.customID || profile.platformUid },
			{ '昵称': profile.nickname || '' },
			{ '归属员工': (profile.employee && profile.employee.name + ' ' + profile.employee.sn) || '' },
			{ '归属部门': (profile.employee && profile.employee.departments) ? profile.employee.departments.map(it => it.name).join(',') : '' },
			{ '微信密码': profile.loginPassword || '' },
			{ '支付密码': profile.paymentPassword || '' },
			{ '好友数量': profile.contactCount },
			{ '标签': { content: h => tags(h, profile.tags || [], 'blue') } },
			{ 'UDID': { content: profile.deviceID || '', long: true } },
			{ '绑定号码': profile.mobilephone },
			{ '银行': bank.bank || '' },
			{ '银行卡号': bank.bankCardNo || '' },
			{ '银行卡账户名': bank.bankCardAccount || '' },
			{ '银行卡预留手机号': bank.bankBindMobile || '' },
			{ '身份证姓名': bank.idCardName || '' },
			{ '身份证号码': bank.idCardNo || '' },
			{ '录入日期': profile.ctime },
			{ '备注': { content: profile.remark || '', long: true } }
		],
		extra: [
			// { '订单总数': 0 },
			// { '好友数量': profile.contactCount },
			// { '签收总金额': '¥0' },
			// { '成交好友数': 0 },
			// { '客单价': 0 }
		],
		actions: [
			{
				'编辑': () => {
					App.push(AppRoutes.Profile.update(profile[Profile.primaryKey], profileName))
				}
			}
		],
		tabs
	}
}
