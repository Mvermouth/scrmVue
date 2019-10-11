<style lang="less" scoped>
	.image-container {
		width: 120px;
		height: 120px;
		padding: 4px;
		.image-item {
			width: 100%;
			height: 100%;
		}
	}
</style>

<template>
	<div style="width:120px; height:120px;padding:4px">
		<!-- <div class="image-item tc" :style="{backgroundImage: `url(${asset.url})`}" ></div>  -->
		<img style="width:100%; height:100%" :src="asset.url"/>
	</div>
</template>
<script>
export default {
    
    props: {

        // 资源信息
        asset: {
            type: Object,
            required: true
        }
	},
	mounted() {
		
	},
	methods: {
		zoomImage(url) {
			App.viewImages([url])
		},
	}
}
</script>