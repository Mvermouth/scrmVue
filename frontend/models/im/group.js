import RestfulDomainModel from '../base/RestfulDomainModel'
import Profile from '../im/profile'
class Model extends RestfulDomainModel {
	async page(pageNo, pageSize, filter, sort, expandable) {
		if (Array.isArray(filter)) {
			filter = { and: filter, or: [] }
		}
		return await this.post(`${this.baseUrl}/page`, { pageNo, pageSize, filter, sort })
	}
	async profileMember(platformGid) {
		return await this.post(`${this.baseUrl}/profileMember`, { platformGid: platformGid })
	}
	async searchMembers(id, keyword, pageNo, pageSize) {
		return await this.post(`${this.baseUrl}/searchMembers`, { id, keyword, pageNo, pageSize })
	}
	async searchGroups(fromId, keyword, pageNo, pageSize, sort) {
		return await this.post(`${this.baseUrl}/searchGroups`, { fromId, keyword, pageNo, pageSize, sort })
	}
}
export default new Model([
	{ id: { name: 'ID', dataOnly: true }},
	{ profileId: { name: '运营微信号', dataOnly: true, include: Profile, as: 'profile' }},
	{ tags: { name: '标签' }},
	{ uploadMsg: { name: '是否上报群消息' }},
	{ ctime: { name: '创建时间' }}
], '/im/group')
