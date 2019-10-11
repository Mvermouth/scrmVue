import '../../../../scripts/common/app'
import { parseUrl } from '../../../../scripts/utils/url'
import Constant from '../../../../configs/constant'
import View from './index.vue'
const { query } = parseUrl(location.href, true)
const value = query.type === 'message' ? Constant.MailboxResourceType.Message.value : Constant.MailboxResourceType.Timeline.value
const employee = App.data.employee
const employeeRecommendFilter = [
	{
		filterType: 'EQ',
		property: 'resourceType',
		value: value
	},
	{
		filterType: 'EQ',
		property: 'receiverType',
		value: Constant.MailboxSenderType.Employee.value
	},
	{
		filterType: 'EQ',
		property: 'receiverId',
		value: employee.id
	}
]
const departmentRecommendFilter = [
	{
		filterType: 'EQ',
		property: 'resourceType',
		value: value
	},
	{
		filterType: 'EQ',
		property: 'receiverType',
		value: Constant.MailboxSenderType.Department.value
	}
]
if (!_.isEmpty(employee.departmentIds)) {
	departmentRecommendFilter.push({
		filterType: 'IN',
		property: 'receiverId',
		value: employee.departmentIds
	})
}
new Vue({
	el: '#app',
	render: h => h(View, { props: { employeeRecommendFilter: employeeRecommendFilter, departmentRecommendFilter: departmentRecommendFilter }})
})
