import RestfulDomainModel from '../base/RestfulDomainModel'
/**
  * 仓库
 **/
class Model extends RestfulDomainModel {
	async pageNoAuth(pageNo, pageSize, filter, sort) {
		return await this.post(`${this.baseUrl}/pageNoAuth`, { pageNo, pageSize, filter, sort })
	}
}

export default new Model([
	{ id: { name: 'ID', dataOnly: true }},
	{ name: { name: '仓库名称' }},
	{ tenantId: { name: '租户', dataOnly: true }},
	{ description: { name: '描述' }},
	{ address: { name: '地址' }},
	{ deleted: { name: '是否删除', dataOnly: true }}
], '/ecommerse/warehouse')
