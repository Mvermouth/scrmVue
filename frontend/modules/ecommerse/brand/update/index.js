import '../../../../scripts/common/app'

import Brand from '../../../../models/ecommerse/brand'
import formItems from './form/form-items'

import View from '../../../../views/domain/update.vue'

new Vue({
	el: '#app',
	render: h => {
		const v = h(View, { props: {
			domain: Brand,
			formItems,
			formProps: {
				labelWidth: 120
			},
			defaults: App.data.domain
		}})
		return App.target === 'dialog' ? v : <card>{v}</card>
	}
})
