export default [
	{
		property: 'phone',
		filter: 'EQ',
		label: '手机号码',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	}
]