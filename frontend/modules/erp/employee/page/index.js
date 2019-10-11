import '../../../../scripts/common/app'
import Employee from '../../../../models/erp/employee'
import Department from '../../../../models/erp/department'

import formItems from './table/form-items'
import columns from './table/columns'
import ResetPassword from './components/reset-password.vue'
import View from '../../../../views/domain/page.vue'

(async() => {
	// 自定义加载数据
	const loadPage = async(pageNo, pageSize, filter, sort) => {
		// 微信号的搜索转换成wxId的搜索
		if (!_.isEmpty(filter)) {
			const depFilter = filter.find(it => { return it.property === 'departmentId' })
			if (depFilter && !_.isEmpty(depFilter.value)) {
				const employees = await Department.getEmployees(_.last(depFilter.value))
				const employeeIds = employees.map(it => { return it.id })
				filter = _.filter(filter, it => { return it.property !== 'departmentId' })
				filter.push({
					property: 'id',
					value: employeeIds,
					filterType: 'IN'
				})
				if (_.isEmpty(employeeIds)) {
					return {
						content: [],
						pageNo: 1,
						pageSize: 10,
						total: 0
					}
				}
			}
		}
		return await Employee.page(pageNo, pageSize, filter, sort)
	}
	const defaultCriterias =
    [
    	{
    		filterType: 'EQ',
    		property: 'deleted',
    		value: false
    	}
    ]
	const defaultSort = [
		{
			'ignoreCase': false,
			'property': 'ctime',
			'type': 'DSC'
		}
	]
	const forms = await formItems()
	new Vue({
		el: '#app',
		components: {
			ResetPassword
		},
		render: h => {
			const v = h(View, { props: {
				formItems: forms,
				formProps: {
					labelWidth: 120
				},
				columns,
				defaultCriterias,
				domain: Employee,
				defaultSort,
				loadPage,
				actions: ['view', 'create', 'update']
			}})
			return <card>{v}</card>
		}
	})
})()
