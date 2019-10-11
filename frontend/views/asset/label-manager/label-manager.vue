<style lang="less" scoped>
	ul{
		list-style: none;
		li{
			height: 30px;
			line-height: 30px;
			text-align: center
		}
	}
	.active {
		background: #fff;
		color: #2d8cf0
	}
</style>

<template>
	<ul>
		<li v-for="item in items" :key="item.id" @click="clickItem(item)" :class="{active: index===item.id ? true : false }">{{item.name}}</li>
	</ul>
</template>
<script>
export default {
	props: {
		items: {
			type: Array,
			required: true
		},
		onItemSelect:{
			type: Function,
			required:true
		}
	},
	data() {
		return {
			index: 'all'
		}
	},
	methods: {
		async clickItem(item) {
			this.index = item.id
			console.log(item)
			await this.onItemSelect(item)
		}
	}
}
</script>

