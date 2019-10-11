import RestfulDomainModel from '../base/RestfulDomainModel'

import User from '../auth/user'
import Department from './department'
class Model extends RestfulDomainModel {
	async search(pageNo, pageSize, filter, sort) {
		return await this.post(`${this.baseUrl}/search`, { pageNo, pageSize, filter, sort })
	}
}
export default new Model([
	{ id: { name: 'ID', dataOnly: true }},
	{ sn: { name: '工号' }},
	{ name: { name: '姓名' }},
	{ tenantId: { name: '租户', dataOnly: true }},
	{ userId: { name: '用户', dataOnly: true, include: User, as: 'user', retrieve: true, deep: true }},
	{ mobile: { name: '联系电话', dataOnly: true }},
	{ position: { name: '职位', dataOnly: true }},
	{ status: { name: '状态' }},
	{ remark: { name: '备注', dataOnly: true }},
	{ gender: { name: '性别', dataOnly: true }},
	{ departmentIds: { name: '所属部门', dataOnly: true, include: [Department], as: 'departments', retrieve: true, deep: true }}
], '/erp/employee')
