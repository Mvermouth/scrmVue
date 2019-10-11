import RestfulDomainModel from '../base/RestfulDomainModel'

import defaultAvatar from '../../images/default-avatar.png'
class Model extends RestfulDomainModel {
	async batchRetrieveDuplicatedProfilesCount(ids) {
		return await this.post(`${this.baseUrl}/batchRetrieveDuplicatedProfilesCount`, { ids })
	}
}
export default new Model([
	{ id: { name: 'ID', dataOnly: true }},
	{ platformId: { name: '平台', dataOnly: true }},
	{ platformUid: { name: '微信ID', dataOnly: true }},
	{ avatar: { name: '头像', defaultValue: defaultAvatar }},
	{ customID: { name: '微信号' }},
	{ nickname: { name: '昵称' }},
	{ signature: { name: '签名' }},
	{ gender: { name: '性别' }},
	{ country: { name: '国家' }},
	{ state: { name: '省份' }},
	{ city: { name: '城市' }},
	{ ctime: { name: '创建时间' }}
], '/im/contact')
