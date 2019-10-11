import '../../../../scripts/common/app'
import View from '../../../../components/im/timeline/timeline-view.vue'
// import View from './index.vue'
import { parseUrl } from '../../../../scripts/utils/url'
const { query } = parseUrl(location.href, true)
const cursor = query.cursor ? new Date(parseInt(query.cursor)) : null
const fromId = query.fromId
const toId = App.data.domain.id
console.log(`fromId:${fromId},toId:${toId}`)
new Vue({
	el: '#app',
	render: h => h(View, { props: {
		filter: {
			cursor,
			fromId,
			toId,
			ownerType: 'to'
		}
	}})
})
