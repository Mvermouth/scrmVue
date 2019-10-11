import '../../../../scripts/common/app'

import Employee from '../../../../models/erp/employee'
import Role from '../../../../models/auth/role'
import formItems from './form/form-items'
import View from '../../../../views/domain/create.vue'
import MultipleDepartment from './components/multiple-department.vue'

(async() => {
	const roles = await Role.pageNoAuth(1, 50, [{ filterType: 'EQ', property: 'deleted', value: false }], [], true)
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
				formItems
			}})
			return App.target === 'dialog' ? v : <card>{v}</card>
		}
	})
})()

