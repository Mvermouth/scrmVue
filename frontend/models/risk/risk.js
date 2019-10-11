import RestfulDomainModel from '../base/RestfulDomainModel'
import Contact from '../im/contact'
import Profile from '../im/profile'
import Employee from '../erp/employee'
class Model extends RestfulDomainModel {
	async statistics(pageNo, pageSize, filter, sort) {
		return await this.post(`${this.baseUrl}/statistics`, { pageNo, pageSize, filter, sort })
	}
}
export default new Model([
	{ id: { name: 'ID', dataOnly: true }},
	{ tenantId: { name: '租户ID', dataOnly: true }},
	{ profileId: { name: '运营号', dataOnly: true, include: Profile, as: 'profile' }},
	{ description: { name: '描述' }},
	{ riskMode: { name: '风控模式', dataOnly: true }},
	{ action: { name: '操作类型' }},
	{ contactId: { name: '好友', dataOnly: true, include: Contact, as: 'contact' }},
	{ ctime: { name: '录入系统时间' }}
], '/risk/risk')
