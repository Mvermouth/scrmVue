import '../../../../scripts/common/app'

import Relation from '../../../../models/im/relation'
import View from './views/index.vue'

(async() => {
	// 这里需要通过page来查找视图
	const relationPage = await Relation.page(1, 1, [{ property: 'profile.contactID', value: App.data.domain.fromId, filterType: 'EQ' }, { property: 'contact.id', value: App.data.domain.toId, filterType: 'EQ' }], [])

	const relation = relationPage.content[0]
	new Vue({
		el: '#app',
		render: h => h(View, { props: { relation }})
	})
})()
