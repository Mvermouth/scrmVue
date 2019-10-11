import '../../../../scripts/common/app'

import Spec from '../../../../models/ecommerse/spec'
import formItems from './form/form-items'

import View from '../../../../views/domain/update.vue'
const retrieve = async id => {
	const defaults = App.data.domain
	defaults.value = JSON.parse(defaults.value)
	if (defaults.value && defaults.value.length > 0) {
		defaults.value = _.map(defaults.value, it => { return { name: it.name, show: true } })
	}
	return defaults
}

const update = async data => {
	data.value = data.value.map(it => { return { name: it.name } })
	data.value = JSON.stringify(data.value)
	return Spec.update(data)
}
new Vue({
	el: '#app',
	render: h => {
		const v = h(View, {
			props: {
				domain: Spec,
				formItems,
				formProps: {
					labelWidth: 120
				},
				defaults: retrieve,
				update
			}
		})
		return App.target === 'dialog' ? v : <card>{v}</card>
	}
})
