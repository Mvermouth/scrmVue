import '../../../../scripts/common/app'
import User from '../../../../models/clouddata/douyin/user'

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
				domain: User,
				defaultSort: [
					{
						'property': 'follower_count',
						'type': 'DSC'
					}
				],
				actions: ['view']
			}
		})
		return <card>{v}</card>
	}
})
