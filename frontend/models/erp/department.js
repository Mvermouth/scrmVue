import RestfulDomainModel from '../base/RestfulDomainModel'
import Group from '../auth/group'

class Model extends RestfulDomainModel {
	async expand(params) {
		return await this.get(`${this.baseUrl}/expand`, params)
	}
	async getEmployees(id) {
		return await this.get(`${this.baseUrl}/getEmployees/${id}`)
	}
	async map() {
		const results = await this.expand()
		const map = {}
		results.forEach(it => tree2Map(it, map))
		return map
	}

	async parentPath(id) {
		const map = await this.map()
		return walkUp(id, map, [])
	}

	async batchParentPath(ids) {
		const map = await this.map()
		return ids.map(it => walkUp(it, map, []))
	}
}

const tree2Map = (node, map) => {
	map[node.id] = node
	const children = node.children || []
	children.forEach(it => tree2Map(it, map))
}

const walkUp = (id, map, list) => {
	list.unshift(id)
	const node = map[id]
	return (node && node.parentId) ? walkUp(node.parentId, map, list) : list
}

export default new Model([
	{ id: { name: 'ID', dataOnly: true }},
	{ parentId: { name: '上级部门', dataOnly: true, include: 'self', as: 'parent', retrieve: true }},
	{ tenantId: { name: '租户', dataOnly: true }},
	{ groupId: { name: '权限组', dataOnly: true, include: Group, as: 'group', retrieve: true, deep: true }},
	{ name: { name: '名称' }},
	{ mobile: { name: '联系电话' }},
	{ leader: { name: '负责人' }},
	{ children: { name: '下级部门', dataOnly: true }}
], '/erp/department')
