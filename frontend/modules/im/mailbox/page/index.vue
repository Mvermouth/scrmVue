<template>
    <div>
        <card>
            <tabs size="small" @on-click="onTab" :value="tab">       
                <tab-pane  label="员工推荐" name="employee">
                    <domain-page :formItems="formItems" :columns="columns" :domain="domain" :actions="actions" :defaultCriterias="employeeDefaultCriterias"></domain-page>
                </tab-pane>
                <tab-pane  label="部门推荐" name="department">
                    <domain-page :formItems="formItems" :columns="columns" :domain="domain" :actions="actions" :defaultCriterias="departmentDefaultCriterias"></domain-page>
                </tab-pane>
            </tabs>
       </card>
    </div>
</template>
<script>
import Mailbox from '../../../../models/im/mailbox'

import formItems from './table/form-items'
import columns from './table/columns'
import DomainPage from '../../../../views/domain/page.vue'
export default {
	components: {
		'domain-page': DomainPage
	},
	props: {
		departmentRecommendFilter: {
			type: [Array],
			required: true
		},
		employeeRecommendFilter: {
			type: [Array],
			required: true
		}
	},
	data() {
		return {
			tab: 'employee',
			formItems: formItems,
			columns: columns,
			domain: Mailbox,
			employeeDefaultCriterias: this.employeeRecommendFilter,
			departmentDefaultCriterias: this.departmentRecommendFilter,
			actions: ['view']
		}
	},
	watch: {
		value() {}
	},
	mounted() {},

	methods: {
		onTab() {}
	}
}
</script>