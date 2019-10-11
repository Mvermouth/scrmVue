<template>
    <div>
        <tabs size="small" @on-click="onTab" :value="tab">       
                <tab-pane  label="登陆日志" name="login">
                    <domain-page v-bind="loginPageProps"></domain-page>
                </tab-pane>
                <tab-pane  label="操作日志" name="action">
                    <domain-page v-bind="actionPageProps"></domain-page>
                </tab-pane>
        </tabs>
    </div>
</template>
<script>
import LoginLog from '../../../../models/auth/auditLog'
import ActionLog from '../../../../models/dms/auditLog'

import loginFormItems from './table/login/form-items'
import loginColumns from './table/login/columns'
import actionFormItems from './table/action/form-items'
import actionColumns from './table/action/columns'
import DomainPage from '../../../../views/domain/page.vue'
const defaultSort = [
  {
    ignoreCase: false,
    property: "ctime",
    type: "DSC"
  }
]
export default {
	components: {
		'domain-page': DomainPage
	},
	data() {
		return {
			tab: 'login',
            loginPageProps: {
                domain: LoginLog,
                columns: loginColumns,
                formItems:loginFormItems,
                action: ['view'],
				defaultCriterias: []
            },
            
            actionPageProps: {
				domain: ActionLog,
                columns: actionColumns,
                formItems:actionFormItems,
                action:['view'],
                defaultCriterias: [],
                defaultSort
			}
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