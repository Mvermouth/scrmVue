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
		<div style="width:100%; height:100%">
			<video loop=”loop“ @mouseenter="e => e.target.play()" @mouseleave="e => e.target.pause()" @loadedmetadata="loadmetadata" style="width:100%; height:100%" :src="asset.url"/>
			<p style="position:absolute;left:0px;top:3px">{{duration}}s</p>
		</div>			
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
	data() {
		return {
			duration:0
		}
	},
	methods:{
		loadmetadata(e){
			const target = e.target
			const length = target.duration
			this.duration = parseInt(target.duration)
		}
	}
}
</script>