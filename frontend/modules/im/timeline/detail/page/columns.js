import Employee from '../../../../../models/im/employee'
import { tableColumnsByDomain } from '../../../../../scripts/utils/table-utils'
import { constantText } from '../../../../../scripts/utils/table-renders'
import Constants from '../../../../../configs/constant'

const width = App.options.styles.table.width

const options = {
	status: {
		width: width.w_6,
		render(h, context) {
			const EmployeeStatus = Constants.EmployeeStatus
			const value = context.row.status
			const highlights = {
				[EmployeeStatus.Duty.value]: 'success',
				[EmployeeStatus.NoDuty.value]: 'error'
			}
			return constantText.call(this, h, context, value, EmployeeStatus, highlights)
		}
	}

}

export default tableColumnsByDomain(Employee, options)
