import createSelector from '../create-selector'

import Inventory from '../../../models/ecommerse/inventory'
import columns from './columns'
import formItems from './form-items'
const defaultSort = [
	{
		'ignoreCase': false,
		'property': 'ctime',
		'type': 'DSC'
	}
]
const defaultCriterias = [
	{
		filterType: 'EQ',
		property: 'deleted',
		value: false
	},
	{
		filterType: 'EQ',
		property: 'onSale',
		value: true
	}
]
const selector = createSelector({
	loadPage: async(pageNo, pageSize, filter, sort) => {
		return await Inventory.pageNoAuth(pageNo, pageSize, filter, sort)
	},
	selection: true,
	domain: Inventory,
	formItems,
	defaultCriterias,
	defaultSort,
	formProps: {
		labelWidth: 45,
		expandRow: 1
	},
	columns,
	defaultPageSize: 10,
	size: 'small'
})

export default selector
