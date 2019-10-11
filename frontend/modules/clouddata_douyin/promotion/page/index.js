import '../../../../scripts/common/app'
import Promotion from '../../../../models/clouddata/douyin/promotion'

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
				domain: Promotion,
				defaultSort: [
					{
						'property': 'sales',
						'type': 'DSC'
					}
				],
				actions: ['view']
			}
		})
		return <card>{v}</card>
	}
})
