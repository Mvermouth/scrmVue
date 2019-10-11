import '../../../../scripts/common/app'

import Role from '../../../../models/auth/role'
import formItems from '../create/form/form-items'

import PriviledgeSelector from '../create/components/priviledge-selector.vue'

import View from '../../../../views/domain/update.vue'

const retrieve = async() => {
	const defaults = App.data.domain

	const permissions = await Role.listPermissions({ id: defaults.id })
	const permissionIds = _.map(permissions, it => { return it.id })
	defaults.permissionIds = permissionIds

	return defaults
}

(async() => {
	const defaults = await retrieve()
	new Vue({
		el: '#app',
		components: {
			PriviledgeSelector
		},
		render: h => {
			const v = h(View, { props: {
				domain: Role,
				formItems,
				defaults: defaults
			}})
			return App.target === 'dialog' ? v : <card>{v}</card>
		}
	})
})()
