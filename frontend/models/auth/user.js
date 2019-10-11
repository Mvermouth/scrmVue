import RestfulDomainModel from '../base/RestfulDomainModel'

import Group from './group'
import Role from './role'
class Model extends RestfulDomainModel {
	async changePassword(model) {
		return await this.post(`${this.baseUrl}/changePassword`, model)
	}
	async resetPassword(model) {
		return await this.post(`${this.baseUrl}/resetPassword`, model)
	}
	async register(model) {
		debugger;
	}
}
export default new Model([
	{ id: { name: 'ID', dataOnly: true }},
	{ tenantId: { name: '租户', dataOnly: true }},
	{ username: { name: '用户名' }},
	{ nickname: { name: '昵称', dataOnly: true }},
	{ sex: { name: '性别', dataOnly: true }},
	{ deleted: { name: '已删除', dataOnly: true }},
	{ disabled: { name: '已禁用', dataOnly: true }},
	{ ctime: { name: '注册时间' }},
	{ mtime: { name: '更新时间', dataOnly: true }},
	{ roleIds: { name: '权限', dataOnly: true, include: [Role], as: 'roles', retrieve: true, deep: true }},
	{ groupIds: { name: '权限组', dataOnly: true, include: [Group], as: 'groups', retrieve: true, deep: true }},
	{ super: { name: '超级管理员' }}
], '/auth/user')
