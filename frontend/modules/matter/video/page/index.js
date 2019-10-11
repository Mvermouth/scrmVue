import '../../../../scripts/common/app'

import View from './index.vue'

new Vue({
	el: '#app',
	render: h => {
		const v = h(View, {
			props: {
				defaultCriterias: [
					{
						filterType: 'EQ',
						property: 'type',
						value: 'video'
					}
				]
			}
		})
		return <card>{v}</card>
	}
})

