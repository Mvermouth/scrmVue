import RestfulDomainModel from '../base/RestfulDomainModel'
import Employee from '../erp/employee'

class Model extends RestfulDomainModel {
	async page(pageNo, pageSize, filter, sort, expandable) {
		if (Array.isArray(filter)) {
			filter = { and: filter, or: [] }
		}
		return await this.post(`${this.baseUrl}/page`, { pageNo, pageSize, filter, sort, expandable })
	}
	async pageDuplicatedContacts(platformUid, pageNo, pageSize, direction) {
		return await this.get(`${this.baseUrl}/pageDuplicatedContacts`, { platformUid, pageNo, pageSize, direction })
	}
	async batchRetrieveDuplicatedContactsCount(contactIds) {
		return await this.post(`${this.baseUrl}/batchRetrieveDuplicatedContactsCount`, { contactIds })
	}
	async retrieveControl(model) {
		return await this.get(`${this.baseUrl}/retrieveControl`, model)
	}
	async retrieveByContactID(contactID) {
		return await this.get(`${this.baseUrl}/retrieveByContactID`, { contactID: contactID })
	}
}

export default new Model([
	{ id: { name: 'ID', dataOnly: true }},
	{ platformId: { name: '平台', dataOnly: true }},
	{ platformUid: { name: '微信ID', dataOnly: true }},
	{ avatar: { name: '头像' }},
	{ customID: { name: '微信号' }},
	{ nickname: { name: '昵称' }},
	{ employeeId: { name: '归属员工', dataOnly: true, include: Employee, as: 'employee' }},
	{ contactCount: { name: '好友数量' }},
	{ online: { name: '在线状态', dataOnly: true }},
	{ gender: { name: '性别' }},
	{ mobilephone: { name: '绑定手机' }},
	{ country: { name: '国家' }},
	{ state: { name: '省份' }},
	{ city: { name: '城市' }},
	{ signature: { name: '签名' }},
	{ deviceID: { name: '设备UDID' }},
	{ tags: { name: '标签' }},
	{ appVersion: { name: '微信版本' }},
	{ qrcode: { name: '二维码' }},
	{ persistRoomMsg: { name: '群消息持久化' }},
	{ ctime: { name: '上报系统时间' }}
], '/im/testljl')
