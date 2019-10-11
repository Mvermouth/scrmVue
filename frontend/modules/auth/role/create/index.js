import '../../../../scripts/common/app'

import Role from '../../../../models/auth/role'
import formItems from './form/form-items'

import PriviledgeSelector from './components/priviledge-selector.vue'

import View from '../../../../views/domain/create.vue'

new Vue({
	el: '#app',
	components: {
		PriviledgeSelector
	},
	render: h => {
		const v = h(View, { props: {
			domain: Role,
			formItems,
			defaults: App.data.domain
		}})
		return App.target === 'dialog' ? v : <card>{v}</card>
	}
})
