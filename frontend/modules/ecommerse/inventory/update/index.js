import '../../../../scripts/common/app'

import Inventory from '../../../../models/ecommerse/inventory'
import formItems from './form/form-items'

import View from '../../../../views/domain/update.vue'

new Vue({
	el: '#app',
	render: h => {
		const v = h(View, { props: {
			domain: Inventory,
			formItems,
			formProps: {
				labelWidth: 120
			},
			defaults: App.data.domain
		}})
		return App.target === 'dialog' ? v : <card>{v}</card>
	}
})
