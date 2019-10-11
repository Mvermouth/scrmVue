import RestfulDomainModel from '../base/RestfulDomainModel'

class Model extends RestfulDomainModel {
	async pageNoAuth(pageNo, pageSize, filter, sort) {
		return await this.post(`${this.baseUrl}/pageNoAuth`, { pageNo, pageSize, filter, sort })
	}
}

export default new Model([
	{ id: { name: 'ID', dataOnly: true }},
	{ name: { name: '品牌名称' }},
	{ tenantId: { name: '租户', dataOnly: true }},
	{ description: { name: '品牌描述' }},
	{ logo: { name: 'LOGO', dataOnly: true }},
	{ url: { name: '品牌链接' }},

	{ deleted: { name: '是否删除', dataOnly: true }},
	{ ctime: { name: '创建时间' }},
	{ mtime: { name: '更新时间', dataOnly: true }}
], '/ecommerse/brand')
