import RestfulDomainModel from '../base/RestfulDomainModel'
class Model extends RestfulDomainModel {
	async list(Model) {
		return await this.post(`${this.baseUrl}/list`, Model)
	}
	async listBySession(sessionId, keyword, cursor, limit, direction, expandable) {
		return await this.get(`${this.baseUrl}/listBySession`, { sessionId, keyword, cursor, limit, direction, expandable })
	}
}

export default new Model([
	{ id: { name: 'ID', dataOnly: true }},
	{ profileContactID: { name: '运营号联系人ID', dataOnly: true }},
	{ contactID: { name: '联系人ID', dataOnly: true }},
	{ nickname: { name: '联系人昵称' }},
	{ sessionType: { name: '会话类型', dataOnly: true }},
	{ deviceID: { name: '设备UDID', dataOnly: true }},
	{ textContent: { name: '内容', dataOnly: true }}, // 文本内容
	{ objectContent: { name: '内容', dataOnly: true }}, // 其他内容
	{ revoke: { name: '是否撤回', dataOnly: true }},
	{ sendTime: { name: '发送时间' }},
	{ ctime: { name: '上报时间', dataOnly: true }}
], '/im/message')
