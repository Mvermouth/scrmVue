import '../../../../scripts/common/app'

import Department from '../../../../models/erp/department'
import Role from '.././../../../models/auth/role'
import formItems from '../create/form/form-items'
import View from '../../../../views/domain/update.vue'

// 这个函数写得比较乱，等iview remote研究透彻重新写
(async() => {
	const id = App.data.domain.id
	const department = await Department.retrieve(id, true)

	const roleIds = department.group ? _.unionWith(department.group.currentRoleIds, department.group.roleIds, _.isEqual) : []
	// const labelRoles = _.unionWith(_.map(department.group.currentRoles, it =>  it.name), _.map(department.group.roles, it =>  it.name), _.isEqual)
	const roles = await Role.pageNoAuth(1, 50, [{ filterType: 'EQ', property: 'deleted', value: false }], [], true)

	const retrieve = async id => {
		const defaults = _.cloneDeep(department)
		defaults.roleIds = roleIds
		if (defaults.parentId) {
			// 有父级，查询父级路径
			const path = await Department.parentPath(defaults.parentId)
			defaults.parentId = path
		} else {
			// 没有父级，使用表单默认
			delete defaults.parentId
		}
		return defaults
	}

	new Vue({
		el: '#app',
		data: {
			roles: roles.content
		},
		render: h => {
			const v = h(View, { props: {
				domain: Department,
				formItems,
				defaults: retrieve
			}})
			return App.target === 'dialog' ? v : <card>{v}</card>
		}
	})
})()

