import '../../../../scripts/common/app'

import Profile from '../../../../models/im/profile'
import Employee from '../../../../models/erp/employee'
import formItems from './form/form-items'

import View from '../../../../views/domain/update.vue'

(async() => {
	const employeeId = App.data.domain.extra.employeeId
	const defaultOptions = []
	try {
		if (employeeId) {
			const employeeData = await Employee.retrieve(employeeId)
			defaultOptions.push({ value: employeeId, label: `${employeeData.sn}(${employeeData.name})` })
		}
	} catch (error) {
		console.log('cannot find employee:', employeeId)
	}
	const retrieve = async id => {
		const defaults = App.data.domain
		if (defaults.extra) {
			defaults.employeeId = defaults.extra.employeeId
		}
		return defaults
	}

	const update = async data => {
		const extra = {}
		if (data.employeeId) {
			extra.employeeId = data.employeeId
		} else {
			extra.employeeId = null
		}
		const updateParams = {
			id: data.id,
			extra: extra
		}
		const val = await Profile.update(updateParams)
		return val
	}

	new Vue({
		el: '#app',
		data: {
			defaultOptions: defaultOptions
		},
		render: h => {
			const v = h(View, {
				props: {
					domain: Profile,
					formItems,
					formProps: {
						labelWidth: 130
					},
					defaults: retrieve,
					update
				}
			})
			return App.target === 'dialog' ? v : <card>{v}</card>
		}
	})
})()

