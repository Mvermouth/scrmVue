import '../../../../scripts/common/app'
import View from './index.vue'
import ShareContent from '../../timeline/create/components/share-content.vue'

new Vue({
	el: '#app',
	components: {
		ShareContent
	},
	render: h => h(View)
})

