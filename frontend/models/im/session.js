import RestfulDomainModel from '../base/RestfulDomainModel'
class Model extends RestfulDomainModel {
	async page(pageNo, pageSize, filter, sort) {
		if (Array.isArray(filter)) {
			filter = { and: filter, or: [] }
		}
		return await this.post(`${this.baseUrl}/page`, { pageNo, pageSize, filter, sort })
	}
	async retrieveByRelation(fromId, toId, expandable) {
		return await this.get(`${this.baseUrl}/retrieveByRelation`, { fromId, toId, expandable })
	}
	async searchSessions(fromId, keyword, pageNo, pageSize, sort) {
		return await this.post(`${this.baseUrl}/searchSessions`, { fromId, keyword, pageNo, pageSize, sort })
	}
}
export default new Model([
	{ id: { name: 'ID', dataOnly: true }},
	{ toId: { name: '好友ID', dataOnly: true }},
	{ toPuid: { name: '好友平台ID' }},
	{ fromId: { name: '运营号ID', dataOnly: true }},
	{ fromPuid: { name: '运营微信ID', dataOnly: true }},
	{ lastMsgID: { name: '最后消息ID', dataOnly: true }},
	{ ctime: { name: '创建时间', dataOnly: true }}
], '/im/session')
