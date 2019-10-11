import '../../../../scripts/common/app'
import AuditLog from '../../../../models/dms/auditLog'
import formItems from './table/form-items'
import columns from './table/columns'
import View from '../../../../views/domain/page.vue'
new Vue({
	el: '#app',
	render: h => {
		const v = h(View, { props: {
			formItems,
			columns,
			domain: AuditLog,
			actions: ['view']
		}})
		return <card>{v}</card>
	}
})
