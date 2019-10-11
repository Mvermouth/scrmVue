import RestfulDomainModel from '../base/RestfulDomainModel'
/**
  * 规格值表
 **/
class Model extends RestfulDomainModel {
	async pageNoAuth(pageNo, pageSize, filter, sort) {
		return await this.post(`${this.baseUrl}/pageNoAuth`, { filter, pageNo, pageSize, sort })
	}
}

export default new Model([
	{ id: { name: 'ID', dataOnly: true }},
	{ name: { name: '规格名称' }},
	{ tenantId: { name: '租户', dataOnly: true }},
	{ value: { name: '规格值' }},
	{ deleted: { name: '是否删除', dataOnly: true }},
	{ ctime: { name: '创建时间' }},
	{ mtime: { name: '更新时间', dataOnly: true }}
], '/ecommerse/spec')
