<template>
	<div>
    	<!-- <p v-for = "(item ,index) in list" :key= "shipInfo_${index}">{{item}}</p> -->
	</div>

</template>
<script>

import ShipInfo from '../../../../../models/ecommerse/shipInfo'
export default {

	props: {
		shipInfo: {
			type: Object,
			required: true
		}
	},

	data() {
		return {
			list: []
		}
	},
	async mounted(){
		await this.initData()
	},
	methods: {
		async initData(){
			const result  = await ShipInfo.refreshShipInfo(this.shipInfo.id)
			this.list = result.list 
		}
	}
}
</script>
