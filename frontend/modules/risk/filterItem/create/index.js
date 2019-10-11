import '../../../../scripts/common/app'

import FilterItem from '../../../../models/risk/filterItem'
import formItems from './form/form-items'

import View from '../../../../views/domain/create.vue'

new Vue({
	el: '#app',
	render: h => {
		const v = h(View, { props: {
			domain: FilterItem,
			formItems,
			labelWidth: 120
		}})
		return App.target === 'dialog' ? v : <card>{v}</card>
	}
})
