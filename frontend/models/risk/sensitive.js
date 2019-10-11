import RestfulDomainModel from '../base/RestfulDomainModel'
class Model extends RestfulDomainModel {
	async pageNoAuth(pageNo, pageSize, filter, sort) {
		return await this.post(`${this.baseUrl}/pageNoAuth`, { pageNo, pageSize, filter, sort })
	}
}
export default new Model([
	{ id: { name: 'ID', dataOnly: true }},
	{ content: { name: '敏感词' }},
	{ replaceContent: { name: '替换词', dataOnly: true }},
	{ level: { name: '敏感级别' }},
	{ ctime: { name: '录入系统时间' }}
], '/risk/sensitive')
