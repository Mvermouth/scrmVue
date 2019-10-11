import '../../../../scripts/common/app'
import Warehouse from '../../../../models/ecommerse/warehouse'

import formItems from './table/form-items'
import columns from './table/columns'
import View from '../../../../views/domain/page.vue'
const defaultCriterias = [{
	property: 'deleted',
	filterType: 'EQ',
	value: false
}]
new Vue({
	el: '#app',
	render: h => {
		const v = h(View, { props: {
			formItems,
			columns,
			domain: Warehouse,
			defaultCriterias,
			actions: ['view', 'create', 'update']
		}})
		return <card>{v}</card>
	}
})
