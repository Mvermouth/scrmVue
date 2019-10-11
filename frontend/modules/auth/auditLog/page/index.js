import '../../../../scripts/common/app'

import AuditLog from '../../../../models/auth/auditLog'

import formItems from './table/form-items'
import columns from './table/columns'
import View from '../../../../views/domain/page.vue'
import Vue from 'vue'
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
			domain: AuditLog,
			defaultSort,
			actions: ['view', 'create', 'update']
		}})
		return <card>{v}</card>
	}
})
