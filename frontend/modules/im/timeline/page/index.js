import '../../../../scripts/common/app'
import Timeline from '../../../../models/im/timeline'
import formItems from './table/form-items'
import columns from './table/columns'
import View from '../../../../views/domain/page.vue'
import { parseUrl } from '../../../../scripts/utils/url'

const { query } = parseUrl(location.href, true)
const value = query.type === 'profile' ? 1 : 2
const defaultCriterias =
    [
    	{
    		filterType: 'EQ',
    		property: 'isProfile',
    		value: value
    	}
    ]
const defaultSort = [
	{
		'ignoreCase': false,
		'property': 'publishTime',
		'type': 'DSC'
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
				domain: Timeline,
				defaultCriterias,
				defaultSort,
				actions: ['view']
			}
		})
		return <card>{v}</card>
	}
})

