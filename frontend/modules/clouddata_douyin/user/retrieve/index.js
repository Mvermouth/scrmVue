import '../../../../scripts/common/app'

import User from '../../../../models/clouddata/douyin/user'
import View from './views/index.vue'


(async () => {
	const user = await User.retrieve(App.data.domain.id)
	new Vue({
		el: '#app',
		components: {},
		render: h => h(View, { props: { user } })
	})
})()
