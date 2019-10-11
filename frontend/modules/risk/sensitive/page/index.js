import '../../../../scripts/common/app'
import Sensitive from '../../../../models/risk/sensitive'
import formItems from './table/form-items'
import columns from './table/columns'
import View from '../../../../views/domain/page.vue'
new Vue({
	el: '#app',
	render: h => {
		const v = h(View, {
			props: {
				formItems,
				formProps: {
					labelWidth: 120
				},
				columns,
				domain: Sensitive,
				actions: ['view', 'create', 'update', 'delete']
			}
		})
		return <card>{v}</card>
	}
})
