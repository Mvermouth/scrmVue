import createSelector from '../create-selector'
import Product from '../../../models/ecommerse/product'
import columns from './columns'
import formItems from './form-items'
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
	selection: true,
	domain: Product,
	formItems,
	defaultCriterias,
	formProps: {
		labelWidth: 120
	},
	columns
})

export default selector
