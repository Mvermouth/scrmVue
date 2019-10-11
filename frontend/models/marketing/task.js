import RestfulDomainModel from '../base/RestfulDomainModel'
class Model extends RestfulDomainModel {
	async page(pageNo, pageSize, filter, sort) {
		return {
			content: [
				{
					id: 1,
					title: '活动有礼',
					content: '图片 4张',
					visable: '所有用户可见',
					wxNo: '微友代华琪',
					executeTime: '2018-07-09 09:58:00',
					ctime: '2018-07-08 12:58:00'
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
	{ title: { name: '文案' }},
	{ content: { name: '内容' }},
	{ visable: { name: '可见情况' }},
	{ wxNo: { name: '执行微信号' }},
	{ executeTime: { name: '任务执行时间' }},
	{ ctime: { name: '任务创建时间' }}
], '/im/profile')
