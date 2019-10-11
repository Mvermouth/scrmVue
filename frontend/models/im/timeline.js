import RestfulDomainModel from '../base/RestfulDomainModel'
import Contact from './contact'
import Profile from './profile'

class Model extends RestfulDomainModel {
	async list(Model) {
		return await this.post(`${this.baseUrl}/list`, Model)
	}
}

export default new Model([
	{ id: { name: 'ID', dataOnly: true }},
	{ profileId: { name: '好友', dataOnly: true, include: Profile, as: 'profile' }},
	{ contactId: { name: '发布者', dataOnly: true, include: Contact, as: 'publisher' }},
	{ content: { name: '内容' }},
	{ likeCount: { name: '点赞数' }},
	{ commentCount: { name: '评论数' }},
	{ replyCount: { name: '回复数' }},
	{ location: { name: '地理位置' }},
	{ isPrivate: { name: '是否私有' }},
	{ type: { name: '类型', dataOnly: true }},
	{ publishTime: { name: '发布时间' }},
	{ ctime: { name: '创建时间' }}
], '/im/timeline')
