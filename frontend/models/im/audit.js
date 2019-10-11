import RestfulDomainModel from '../base/RestfulDomainModel'
import Contact from '../im/contact'
class Model extends RestfulDomainModel {
	async page(profilePlatformUid, pageNo, pageSize, direction) {
		return await this.get(`${this.baseUrl}/page`, { profilePlatformUid, pageNo, pageSize, direction })
	}
}

export default new Model([
	{ id: { name: 'ID', dataOnly: true }},
	{ profilePlatformUid: { name: '运营号平台Uid', dataOnly: true }},
	{ profilePlatformUid: { name: '联系人平台Uid', dataOnly: true }},
	{ type: { name: '操作类型' }},
	{ content: { name: '操作内容' }},
	{ actionTime: { name: '操作时间' }},
	{ ctime: { name: '上报时间', dataOnly: true }},
	{ contactId: { name: '好友', dataOnly: true, include: Contact, as: 'contact' }}
], '/im/audit')
