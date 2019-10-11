<template>
	<row>
		<i-col v-for="(info, key) in descriptionInfos" :key="`col_${key}`" :xs="layout.xs" :sm="layout.sm" :md="layout.md" :lg="layout.lg">
			<description-list :title="Object.keys(info)[0]" :text="info[Object.keys(info)[0]]"></description-list>
		</i-col>
	</row>
</template>
<script>
export default {
	props: {
		descriptionInfos: {
			type: Array,
			required: true
		},
		layout: {
			type: Object,
			required: true
		}
	}
}
</script>

