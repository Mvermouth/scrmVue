import '../../../../scripts/common/app'

import Customer from '../../../../models/ecommerse/customer'
import formItems from './form/form-items'

import View from '../../../../views/domain/update.vue'
const retrieve = async id => {
	const defaults = App.data.domain
	defaults.gender = defaults.sex === 2 ? 'male' : 'female'
	defaults.birthday = defaults.birthday ? new Date(defaults.birthday) : ''
	if (defaults.province && defaults.city && defaults.district) {
		defaults.addr = [defaults.province, defaults.city, defaults.district]
	}
	return defaults
}

const update = async data => {
	data.sex = data.gender === 'male' ? 1 : 2
	if (!_.isEmpty(data.addr)) {
		const addr = data.addr
		data.province = addr[0]
		data.city = addr[1]
		data.district = addr[2]
	}
	data.birthday = data.birthday ? data.birthday.getTime() : null
	return Customer.update(data)
}
new Vue({
	el: '#app',
	render: h => {
		const v = h(View, {
			props: {
				domain: Customer,
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
