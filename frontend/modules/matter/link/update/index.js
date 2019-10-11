import '../../../../scripts/common/app'

import Link from '../../../../models/matter/link'
import formItems from '../create/form/form-items'

import View from '../../../../views/domain/update.vue'

new Vue({
	el: '#app',
	render: h => {
		const v = h(View, { props: {
			domain: Link,
			formItems
		}})
		return App.target === 'dialog' ? v : <card>{v}</card>
	}
})
