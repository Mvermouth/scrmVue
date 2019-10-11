import '../../../../scripts/common/app'
import RecomendCard from '../../../../models/im/recommendCard'
import formItems from './table/form-items'
import columns from './table/columns'
import View from '../../../../views/domain/page.vue'
const defaultSort = [
	{
		'ignoreCase': false,
		'property': 'ctime',
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
				domain: RecomendCard,
				defaultSort,
				actions: ['view']
			}
		})
		return <card>{v}</card>
	}
})
