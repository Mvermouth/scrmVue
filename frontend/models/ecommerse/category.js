import RestfulDomainModel from '../base/RestfulDomainModel'

class Model extends RestfulDomainModel {
	async expand() {
		return await this.post(`${this.baseUrl}/expand`)
	}
}

export default new Model([
	{ id: { name: 'ID', dataOnly: true }},
	{ name: { name: '分类名称' }},
	{ tenantId: { name: '租户', dataOnly: true }},
	{ parentId: { name: '上级分类' }},
	{ weight: { name: '权重' }},
	{ deleted: { name: '是否删除', dataOnly: true }},
	{ ctime: { name: '创建时间' }},
	{ mtime: { name: '更新时间', dataOnly: true }}
], '/ecommerse/category')
