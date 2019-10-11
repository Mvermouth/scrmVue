<style lang="less" scoped>
 	@import './index.less';
</style>
<template>
	<div class="">
		<div class="title">{{title}}：</div>
		<div class="text">{{text}}</div>
	</div>	
</template>
<script>
export default {
	props: {
		title: {
			type: String,
			required: true
		},
		text: {
			type: [String, Number, Object],
			required: true
		}
	}
}
</script>

