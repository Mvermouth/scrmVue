import createSelector from '../create-selector'

import Relation from '../../../models/im/relation'
import columns from './columns'
import formItems from './form-items'
import Constant from '../../../configs/constant'
const selector = createSelector({
	domain: Relation,
	formItems,
	formProps: {
		labelWidth: 85,
		expandRow: 1
	},
	columns,
	defaultPageSize: 10,
	defaultCriterias: [
		{
			filterType: 'EQ',
			property: 'contact.type',
			value: 0
		},
		{
			filterType: 'EQ',
			property: 'status',
			value: Constant.ImRelationStatus.Contact.value
		},
		{
			filterType: 'NE',
			property: 'blacklistByContact',
			value: 1
		},
		{
			filterType: 'NE',
			property: 'blacklistByAccount',
			value: 1
		}
	],
	size: 'small',
	selection: true
})

export default selector
