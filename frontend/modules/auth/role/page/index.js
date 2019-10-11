import '../../../../scripts/common/app'

import Role from '../../../../models/auth/role'

import formItems from './table/form-items'
import columns from './table/columns'
import View from '../../../../views/domain/page.vue'

new Vue({
	el: '#app',
	render: h => {
		const v = h(View, { props: {
			formItems,
			columns,
			domain: Role,
			actions: ['view', 'create', 'update']
		}})
		return <card>{v}</card>
	} 
})
