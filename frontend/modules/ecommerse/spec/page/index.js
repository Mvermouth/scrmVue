import '../../../../scripts/common/app'
import Spec from '../../../../models/ecommerse/spec'

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
			domain: Spec,
			defaultCriterias,
			actions: ['view', 'create']
		}})
		return <card>{v}</card>
	}
})
