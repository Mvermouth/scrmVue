import '../../../../scripts/common/app'
import FilterItem from '../../../../models/risk/filterItem'
import formItems from '../create/form/form-items'

import View from '../../../../views/domain/update.vue'

new Vue({
	el: '#app',
	render: h => {
		const v = h(View, { props: {
			domain: FilterItem,
			formItems
		}})
		return App.target === 'dialog' ? v : <card>{v}</card>
	}
})
