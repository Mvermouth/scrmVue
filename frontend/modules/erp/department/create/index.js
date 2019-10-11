import '../../../../scripts/common/app'

import Department from '../../../../models/erp/department'
import Role from '.././../../../models/auth/role'
import formItems from './form/form-items'
import View from '../../../../views/domain/create.vue'
import { parseUrl } from '../../../../scripts/utils/url'
import { setFormItemsDefaults } from '../../../../scripts/utils/form-utils'

(async() => {
	const roles = await Role.pageNoAuth(1, 50, [{ filterType: 'EQ', property: 'deleted', value: false }], [])
	const parent = parseUrl(window.location.href, true)
	const id = parseInt(parent.query.id)
	let path = []
	if (id !== 0) {
		path = await Department.parentPath(id)
	}
	const items = setFormItemsDefaults(formItems, { parentId: path })
	new Vue({
		el: '#app',
		data: {
			roles: roles.content,
			parentPath: path
		},
		render: h => {
			const v = h(View, { props: {
				domain: Department,
				formItems: items
			}})
			return App.target === 'dialog' ? v : <card>{v}</card>
		}
	})
})()
