<template>
	<steps :current="current">
        <step v-for="(status, index) in statusItems" :key="`status_${index}`" :title="status.title" :content="status.content"></step>
    </steps>
</template>
<script>
export default {
	props: {
		statusItems: {
			type: Array,
			required: true
		},
		current: {
			type: Number,
			required: true
		}
	}
}
</script>

