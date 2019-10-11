import '../../../../scripts/common/app'

import Brand from '../../../../models/ecommerse/brand'
import formItems from './form/form-items'

import View from '../../../../views/domain/create.vue'
const defaultCriterias = [{
	property: 'deleted',
	filterType: 'EQ',
	value: false
}]
new Vue({
	el: '#app',
	render: h =>  {
		const v = h(View, { props: {
			domain: Brand,
			formItems,
			formProps: {
				labelWidth: 120
			},
			defaultCriterias,
			defaults: App.data.domain
		}})
		return App.target === 'dialog' ? v : <card>{v}</card>
	}
})
