/**
 * 构建 PageHeader 模版参数
 */
import defaultAvatar from '../../../../../images/default-avatar.png'
import dateformat from 'dateformat'
export default contact => {
	return {
		title: `好友：${contact.nickname || contact.customID || '未知'}`,
		logo: contact.avatar || defaultAvatar,
		content: [
			{ '微信号': contact.customID || contact.platformUid },
			{ '昵称': contact.nickname || '' },
			{ '性别': contact.gender || '' },
			{ '国家': contact.country || '' },
			{ '省份': contact.state || '' },
			{ '城市': contact.city || '' },
			{ '录入时间': dateformat(new Date(contact.ctime), 'yyyy-mm-dd HH:MM:ss') || '' },
			{ '签名': { content: contact.signature || '', long: true }}
		],
		extra: [
		],
		actions: [
		]
	}
}
