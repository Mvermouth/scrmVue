<template>
    <Cascader v-model="address" :data="dataSource" filterable change-on-select></Cascader>
</template>
<script>
import CitySource from './city.json'
export default {
	props: {
		value: {
			type: Array,
			required: false
		}
	},

	data: function() {
		return {
			dataSource: CitySource,
			address: []
		}
	},

	watch: {

		value: function(val) {
			if (Array.isArray(val)) {
				this.address = val
			} else {
				this.address = []
			}
		},

		address: function() {
			if (Array.isArray(this.address)) {
				this.$emit('input', this.address)
			}
		}
	}
}
</script>