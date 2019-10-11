import RestfulDomainModel from '../base/RestfulDomainModel'
class Model extends RestfulDomainModel {
	async page(pageNo, pageSize, filter, sort) {
		return {
			content: [
				{
					id: 1,
					name: '新加好友问候',
					deviceId: 'UHKLSLLDLFFLFF',
					userStatus: 1,
					syncStatus: '同步成功'
				}
			],
			pageNo: 1,
			pageSize: 10,
			total: 1
		}
	}
}
export default new Model([
	{ id: { name: 'ID', dataOnly: true }},
	{ name: { name: '消息名称' }},
	{ deviceId: { name: '执行的设备' }},
	{ useStatus: { name: '使用状态' }},
	{ syncStatus: { name: '同步状态' }}
], '/im/profile')
