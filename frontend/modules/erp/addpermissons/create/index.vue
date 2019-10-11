<template>
    <card>
       <domain-create :formItems="fromItems" :domain="Addpermissions"></domain-create>
    </card>
</template>
<script>

import DomainCreate from '../../../../views/domain/create.vue'
import fromItems from './form/form-items'
import Addpermissions from '../../../../models/erp/addpermissons'
export default {
	props:{

	},
	components: {
		DomainCreate
	},
	data() {
		return {
            fromItems
			,Addpermissions
		}
	},
	methods: {

	}
}
</script>

