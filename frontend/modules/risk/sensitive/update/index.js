import '../../../../scripts/common/app'

import Sensitive from '../../../../models/risk/sensitive'
import formItems from '../create/form/form-items'

import View from '../../../../views/domain/update.vue'

new Vue({
	el: '#app',
	render: h => {
		const v = h(View, { props: {
			domain: Sensitive,
			formItems
		}})
		return App.target === 'dialog' ? v : <card>{v}</card>
	}
})
