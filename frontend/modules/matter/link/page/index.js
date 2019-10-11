import '../../../../scripts/common/app'

import Link from '../../../../models/matter/link'

import formItems from './table/form-items'
import columns from './table/columns'
import View from '../../../../views/domain/page.vue'
import Constant from '../../../../configs/constant'

const defaultCriterias =
[
	{
		filterType: 'EQ',
		property: 'type',
		value: Constant.AssetType.Link.value
	}
]
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
		const v = h(View, { props: {
			formItems,
			columns,
			domain: Link,
			defaultCriterias,
			defaultSort,
			actions: [
				{
					'create': {
						title: '新建外部链接',
						unauthorize: true
					},
					view: {
						title: '查看',
						unauthorize: true
					}
				}]
		}})
		return <card>{v}</card>
	}
})
