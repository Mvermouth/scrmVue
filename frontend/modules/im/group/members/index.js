import '../../../../scripts/common/app'

import View from './views/index.vue'
const contact = App.data.domain
new Vue({
	el: '#app',
	render: h => h(View, { props: { contact }})
})
