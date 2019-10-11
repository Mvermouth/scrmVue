import '../../../../scripts/common/app'

import Category from '../../../../models/ecommerse/category'
import formItems from '../create/form/form-items'

import View from '../../../../views/domain/update.vue'

new Vue({
	el: '#app',
	render: h => {
		const v = h(View, { props: {
			domain: Category,
			formItems,
			formProps: {
				labelWidth: 120
			},
			defaults: App.data.domain
		}})
		return App.target === 'dialog' ? v : <card>{v}</card>
	}
})
