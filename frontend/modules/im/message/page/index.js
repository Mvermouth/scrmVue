import '../../../../scripts/common/app'
import Message from '../../../../models/im/message'

import formItems from './table/form-items'
import columns from './table/columns'
import View from '../../../../views/domain/page.vue'
// import { constant2Array } from '../../../../scripts/utils/misc'
const defaultSort = [
	{
		'ignoreCase': false,
		'property': 'sendTime',
		'type': 'DSC'
	}
]
const defaultCriterias =
    [
    	{
    		filterType: 'EQ',
    		property: 'sessionType',
    		value: 1
    	}
    ]
new Vue({
	el: '#app',
	render: h => {
		const v = h(View, {
			props: {
				formItems,
				formProps: {
					labelWidth: 120
				},
				columns,
				defaultCriterias,
				defaultSort,
				domain: Message,
				actions: ['view']
			}
		})
		return <card>{v}</card>
	}
})
