import '../../../../scripts/common/app'

import Tag from '../../../../models/system/tag'
import formItems from './form/form-items'

import View from '../../../../views/domain/create.vue'

new Vue({
	el: '#app',
	render: h => {
		const v = h(View, { props: {
			domain: Tag,
			formItems,
			labelWidth: 120
		}})
		return App.target === 'dialog' ? v : <card>{v}</card>
	}
})
