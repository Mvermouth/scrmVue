<template>
    <card>
		<detail :detailData = "detailData"></detail>
    </card>
</template>
<script>

import detail from './components/detail.vue'

export default {
	props:{
		
	},
	components: {
		detail
	},
	data() {
		return {
			detailData:window.wxgroupData
		}
	},
	methods: {

	}
}
</script>

