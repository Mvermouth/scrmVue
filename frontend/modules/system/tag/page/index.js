import '../../../../scripts/common/app'

import Tag from '../../../../models/system/tag'

import formItems from './table/form-items'
import columns from './table/columns'
import View from '../../../../views/domain/page.vue'
import Vue from 'vue'
new Vue({
	el: '#app',
	render: h => {
		const v = h(View, { props: {
			formItems,
			columns,
			domain: Tag,
			actions: ['view', 'create', 'update']
		}})
		return <card>{v}</card>
	}
})
