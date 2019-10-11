import createSelector from '../create-selector'

import Sku from '../../../models/ecommerse/sku'
import columns from './columns'
import formItems from './form-items'

const selector = createSelector({
	domain: Sku,
	formItems,
	formProps: {
		labelWidth: 120
	},
	columns,
	selection: true
})

export default selector
