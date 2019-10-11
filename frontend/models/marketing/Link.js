import RestfulDomainModel from '../base/RestfulDomainModel'

export default new RestfulDomainModel([
	{ id: { name: 'ID', dataOnly: true }},
	{ avatar: { name: '头像' }},
	{ customID: { name: '微信号' }},
	{ nickname: { name: '昵称' }}
], '/im/profile')
