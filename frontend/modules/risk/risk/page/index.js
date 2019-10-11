import '../../../../scripts/common/app'
import Risk from '../../../../models/risk/risk'
import formItems from './table/form-items'
import columns from './table/columns'
import Sensitive from '../../../../models/risk/sensitive'
import View from '../../../../views/domain/page.vue'

(async() => {
	const defaultSort = [
		{
			'ignoreCase': false,
			'property': 'ctime',
			'type': 'DSC'
		}
	]
	let sensitivePage
	try {
		sensitivePage = await Sensitive.pageNoAuth(1, 1000, [], [])
	} catch (error) {
		console.log('load sensitive page err:', error)
	}

	new Vue({
		el: '#app',
		data: {
			sensitives: sensitivePage ? sensitivePage.content : []
		},
		render: h => {
			const v = h(View, {
				props: {
					formItems,
					formProps: {
						labelWidth: 120
					},
					columns,
					domain: Risk,
					defaultSort,
					actions: ['view']
				}
			})
			return <card>{v}</card>
		}
	})
})()

