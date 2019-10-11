import '../../../../scripts/common/app'

import Link from '../../../../models/matter/link'
import formItems from './form/form-items'
import View from '../../../../views/domain/create.vue'
import Constant from '../../../../configs/constant'

const create = async(data) => {
	data.type = Constant.AssetType.Link.value
	await Link.create(data)
}
new Vue({
	el: '#app',
	render: h => {
		const v = h(View, { props: {
			domain: Link,
			formItems,
			labelWidth: 120,
			create
		}})
		return App.target === 'dialog' ? v : <card>{v}</card>
	}
})
