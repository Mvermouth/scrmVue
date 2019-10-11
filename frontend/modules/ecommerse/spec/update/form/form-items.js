
export default [
	{
		prop: 'name',
		label: '规格名称',
		rule: { required: true, message: '请输入规格名称' },
		render(h) {
			return <i-input v-model={this.model} placeholder='请输入规格名称'></i-input>
		}
	},
	{
		prop: 'value',
		label: '规格值',
		rule: { required: true, message: '请输入规格值' },
		render(h) {
			h = this.$root.$createElement
			return <tags-input v-model={this.model} btnName='添加规格值'></tags-input>
		}
	}
]
