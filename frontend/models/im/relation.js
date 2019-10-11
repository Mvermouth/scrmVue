import RestfulDomainModel from '../base/RestfulDomainModel'
import Contact from '../im/contact'
import Profile from '../im/profile'

class Model extends RestfulDomainModel {
	async page(pageNo, pageSize, filter, sort, expandable) {
		if (Array.isArray(filter)) {
			filter = { and: filter, or: [] }
		}
		return await this.post(`${this.baseUrl}/page`, { pageNo, pageSize, filter, sort, expandable })
	}

	async pageDuplicatedProfiles(platformUid, pageNo, pageSize, direction) {
		return await this.get(`${this.baseUrl}/pageDuplicatedProfiles`, { platformUid, pageNo, pageSize, direction })
	}
	async searchRelations(fromId, keyword, pageNo, pageSize, sort) {
		return await this.post(`${this.baseUrl}/searchRelations`, { fromId, keyword, pageNo, pageSize, sort })
	}
	async pageDelete(pageNo, pageSize, filter, sort) {
		if (Array.isArray(filter)) {
			filter = { and: filter, or: [] }
		}
		return await this.post(`${this.baseUrl}/pageDelete`, { pageNo, pageSize, filter, sort })
	}
	async deleteFriend(profilePlatformUid, platformUid, serviceID) {
		return await this.post(`${this.baseUrl}/deleteFriend`, { profilePlatformUid, platformUid, serviceID })
	}
	async updatePlatformTags(updateParams) {
		return await this.post(`${this.baseUrl}/updatePlatformTags`, updateParams)
	}
}

export default new Model([
	{ id: { name: 'ID', dataOnly: true }},
	{ contactId: { name: '好友', dataOnly: true, include: Contact, as: 'contact' }},
	{ alias: { name: '好友备注' }},
	{ profileId: { name: '运营号', dataOnly: true, include: Profile, as: 'profile' }},
	{ type: { name: '关系类型', dataOnly: true }},
	{ status: { name: '好友状态' }},
	{ favorite: { name: '是否星标' }},
	//{ tags: { name: '标签' }},
	{ platformTags: { name: '标签' }},
	{ requestTime: { name: '请求添加好友时间' }},
	{ approvedTime: { name: '通过好友时间' }},
	{ ctime: { name: '录入系统时间' }},
	{ timelineBlockByAccount: { name: '运营号朋友圈可见' }},
	{ timelineBlockByContact: { name: '好友朋友圈可见' }},
	{ blacklistByAccount: { name: '被运营号拉黑' }},
	{ blacklistByContact: { name: '被好友拉黑' }}
], '/im/relation')
