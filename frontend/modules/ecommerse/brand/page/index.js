import '../../../../scripts/common/app'
import Brand from '../../../../models/ecommerse/brand'

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
const defaultCriterias = [
	{
		property: 'deleted',
		filterType: 'EQ',
		value: false
	}
]
new Vue({
	el: '#app',
	render: h => {
		const v = h(View, { props: {
			formItems,
			columns,
			domain: Brand,
			defaultSort,
			defaultCriterias,
			actions: ['view', 'create', 'update']
		}})
		return <card>{v}</card>
	}
})
