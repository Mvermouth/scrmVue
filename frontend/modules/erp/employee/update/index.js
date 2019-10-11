import '../../../../scripts/common/app'

import Employee from '../../../../models/erp/employee'
import Department from '../../../../models/erp/department'
import Role from '../../../../models/auth/role'
import formItems from './form/form-items'
import View from '../../../../views/domain/update.vue'
import MultipleDepartment from '../create/components/multiple-department.vue'

(async() => {
	const id = App.data.domain.id
	const employeeData = await Employee.retrieve(id, true)
	const roles = await Role.pageNoAuth(1, 50, [{ filterType: 'EQ', property: 'deleted', value: false }], [])

	const retrieve = async id => {
		const defaults = _.cloneDeep(employeeData)
		defaults.username = defaults.user.username
		defaults.roleIds = defaults.user.roleIds
		if (defaults.departmentIds && defaults.departmentIds.length > 0) {
			// 有父级，查询父级路径
			const path = await Department.batchParentPath(defaults.departmentIds)
			defaults.departmentIds = path
		} else {
			// 没有父级，使用表单默认
			delete defaults.departmentIds
		}
		return defaults
	}

	new Vue({
		el: '#app',
		components: {
			MultipleDepartment
		},
		data: {
			roles: roles.content
		},
		render: h => {
			const v = h(View, { props: {
				domain: Employee,
				formItems,
				defaults: retrieve
			}})
			return App.target === 'dialog' ? v : <card>{v}</card>
		}
	})
})()
