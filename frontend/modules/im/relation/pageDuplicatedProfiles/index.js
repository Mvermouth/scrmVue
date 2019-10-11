import '../../../../scripts/common/app'
import Relation from '../../../../models/im/relation'
import Contact from '../../../../models/im/contact'

import formItems from './table/form-items'
import columns from './table/columns'
import View from '../../../../views/domain/page.vue'
import { parseUrl } from '../../../../scripts/utils/url'
const { query } = parseUrl(location.href, true)
// 自定义加载数据
const loadPage = async(pageNo, pageSize, filter, sort) => {
	const platformUid = query.platformUid
	return await Relation.pageDuplicatedProfiles(platformUid, pageNo, pageSize, 0)
}

new Vue({
	el: '#app',
	render: h => {
		const v = h(View, { props: {
			formItems,
			columns,
			domain: Contact,
			loadPage,
			actions: ['view']
		}})
		return <card>{v}</card>
	}
})
