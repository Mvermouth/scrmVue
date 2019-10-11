import RestfulDomainModel from '../base/RestfulDomainModel'

class Model extends RestfulDomainModel {
	async listPermissions(model) {
		return await this.get(`${this.baseUrl}/listPermissions`, model)
	}
	async pageNoAuth(pageNo, pageSize, filter, sort) {
		return await this.post(`${this.baseUrl}/pageNoAuth`, { pageNo, pageSize, sort, filter })
	}
}

export default new Model([
	{ id: { name: 'ID', dataOnly: true }},
	{ name: { name: '角色名称' }},
	{ tenantId: { name: '租户', dataOnly: true }},
	{ permissions: { name: '权限', dataOnly: true }},
	{ deleted: { name: '是否删除', dataOnly: true }},
	{ ctime: { name: '创建时间' }},
	{ mtime: { name: '更新时间', dataOnly: true }}
], '/auth/role')
