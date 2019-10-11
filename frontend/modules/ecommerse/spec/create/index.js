import '../../../../scripts/common/app'

import Spec from '../../../../models/ecommerse/spec'
import formItems from './form/form-items'

import View from '../../../../views/domain/create.vue'
const create = async data => {
	data.value = data.value.map(it => { return { name: it.name } })
	data.value = JSON.stringify(data.value)
	return Spec.create(data)
}
new Vue({
	el: '#app',
	render: h => {
		const v = h(View, { props: {
			domain: Spec,
			formItems,
			formProps: {
				labelWidth: 120
			},
			defaults: App.data.domain,
			create
		}})
		return App.target === 'dialog' ? v : <card>{v}</card>
	}
})
