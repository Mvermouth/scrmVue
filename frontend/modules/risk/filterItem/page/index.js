import '../../../../scripts/common/app'
import FilterItem from '../../../../models/risk/filterItem'

import formItems from './table/form-items'
import columns from './table/columns'
import View from '../../../../views/domain/page.vue'
const defaultSort = [
	{
		'ignoreCase': false,
		'property': 'ctime',
		'type': 'DSC'
	}
]
// 自定义加载数据
new Vue({
	el: '#app',
	render: h => {
		const v = h(View, { props: {
			formItems,
			columns,
			defaultSort,
			domain: FilterItem,
			actions: ['view', 'create']
		}})
		return <card>{v}</card>
	}
})
