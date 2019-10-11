import '../../../../scripts/common/app'

import Profile from '../../../../models/im/profile'
import GroupMember from './component/group-member.vue'
import View from './views/index.vue'

(async() => {
	// 这里需要通过page来查找视图
	const profilePage = await Profile.page(1, 1, [{ property: 'id', value: App.data.domain.id, filterType: 'EQ' }], [])
	const profile = profilePage.content[0]

	new Vue({
		el: '#app',
		components: {
			GroupMember
		},
		render: h => h(View, { props: { profile }})
	})
})()
