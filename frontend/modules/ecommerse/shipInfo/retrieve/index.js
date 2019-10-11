import '../../../../scripts/common/app'

import View from './views/index.vue'
const shipInfo = App.data.domain
new Vue({
	el: '#app',
	render: h => h(View, { props: { shipInfo }})
})
