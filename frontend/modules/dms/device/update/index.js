import '../../../../scripts/common/app'

import Device from '../../../../models/dms/device'
import Employee from '../../../../models/erp/employee'
import formItems from './form/form-items'
import View from '../../../../views/domain/update.vue'

(async() => {
	const employeeId = App.data.domain.extra ? App.data.domain.extra.employeeId : null
	const defaultOptions = []
	if (employeeId) {
		try {
			const employeeData = await Employee.retrieve(employeeId)
			defaultOptions.push({ value: employeeId, label: `${employeeData.sn}(${employeeData.name})` })
		} catch (error) {
			console.log('error:', error)
		}
	}
	const retrieve = async id => {
		const defaults = App.data.domain
		return defaults
	}
	const update = async(row) => {
		const updateParams = {
			id: row.id,
			extra: row.extra
		}
		return await Device.update(updateParams)
	}
	new Vue({
		el: '#app',
		data: {
			defaultOptions: defaultOptions
		},
		render: h => {
			const v = h(View, {
				props: {
					domain: Device,
					formItems,
					defaults: retrieve,
					update
				}
			})
			return App.target === 'dialog' ? v : <card>{v}</card>
		}
	})
})()
