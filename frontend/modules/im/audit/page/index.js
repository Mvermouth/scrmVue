import '../../../../scripts/common/app'
import Audit from '../../../../models/im/audit'
import formItems from './table/form-items'
import columns from './table/columns'
import View from '../../../../views/domain/page.vue'
import Profile from '../../../../models/im/profile'

// 自定义加载数据
const loadPage = async(pageNo, pageSize, filter, sort) => {
	// 微信号的搜索转换成wxId的搜索
	let platformUid
	if (!_.isEmpty(filter)) {
		const result = await Profile.page(pageNo, pageSize, filter, sort)
		if (!_.isEmpty(result.content)) {
			platformUid = result.content[0].platformUid
		}
	}
	return await Audit.page(platformUid, pageNo, pageSize, 0)
}

new Vue({
	el: '#app',
	render: h => {
		const v = h(View, { props: {
			formItems,
			columns,
			domain: Audit,
			loadPage,
			actions: ['view']
		}})
		return <card>{v}</card>
	}
})
