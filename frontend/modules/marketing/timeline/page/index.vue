<template>
    <card>
		<detail :detailData = "detailData"></detail>
    </card>
</template>
<script>

import detail from './components/detail.vue'

export default {
	components: {
		detail
	},
	props:{

	},
	data() {
		return {
			detailData:window.timelineData
		}
	},
	methods: {

	}
}
</script>

