<template>
    <Cascader v-model="category" :data="dataSource" filterable change-on-select></Cascader>
</template>
<script>
import Category from '../../models/ecommerse/category'
export default {
	props: {
		value: {
			type: Array,
			required: false
		}
	},

	data: function() {
		return {
			dataSource: [],
			category: []
		}
	},
	async mounted(){
		await this.initData()
	},
	watch: {

		value: function(val) {
			if (Array.isArray(val)) {
				this.category = val
			} else {
				this.category = []
			}
		},

		category: function() {
			if (Array.isArray(this.category)) {
				this.$emit('input', this.category)
			}
		}
	},
	methods:{
		async initData(){
			const categories = await Category.expand()
			this.dataSource = this.transformData(categories)
			console.log("this.dataSource:",this.dataSource)
		},
		transformData(categories){
			const arr = _.map(categories, it => {
				it.label = it.name
				it.value = it.id

				if(!_.isEmpty(it.children)){
					it.children = this.transformData(it.children)
				}
				it =  _.pick(it,'label','value','children')
				return it
			})
			return arr
		}
	}
}
</script>