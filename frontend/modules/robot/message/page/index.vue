<template>
    <card>
		<domain-page v-bind="MessageDomain"></domain-page>
    </card>
</template>
<script>

import DomainPage from '../../../../views/domain/page.vue'
import Message from '../../../../models/robot/message'
import Columns from './form/columns'
const defaultSort = [
    {
        "ignoreCase": false,
        "property": "ctime",
        "type": "DSC"
    }
]
export default {
	props:{
		
	},
	components: {
		DomainPage
	},
	data() {
		return {
			MessageDomain:{
				domain:Message
				,columns: Columns
				,defaultSort
				,formProps: {
	                labelWidth: 100
	            }
	            ,selection: App.data.actions.indexOf("delete") > -1 ? true : false
	            //create是去configs的routes.js里面添加路由，不添加默认打开一个新的 create 的页面。
	            //这里的权限跟权限设置有关，如没有这个权限，这里的按钮将不会出现。但是可以设置免权限认证
	            ,actions: ['view',"create","delete"]
			}
		}
	},
	methods: {

	}
}
</script>

