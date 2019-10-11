import '../../../../scripts/common/app'

import Tag from '../../../../models/system/tag'
import formItems from '../create/form/form-items'

import View from '../../../../views/domain/update.vue'

new Vue({
	el: '#app',
	render: h => {
		const v = h(View, { props: {
			domain: Tag,
			formItems
		}})
		return App.target === 'dialog' ? v : <card>{v}</card>
	}
})
