import '../../../../scripts/common/app'
import Profile from '../../../../models/im/profile'
import Fund from '../../../../models/im/fund'
import formItems from './table/form-items'
import columns from './table/columns'
import View from '../../../../views/domain/page.vue'

// 自定义加载数据
const loadPage = async(pageNo, pageSize, filter, sort) => {
	return await Fund.statistics(pageNo, pageSize, filter, sort)
}

new Vue({
	el: '#app',
	render: h => {
		const v = h(View, { props: {
			formItems,
			formProps: {
				labelWidth: 120
			},
			columns,
			domain: Profile,
			loadPage,
			actions: ['view']
		}})
		return <card>{v}</card>
	}
})
