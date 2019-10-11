export default [

	{
		property: 'name',
		filter: 'LIKE',
		label: '标题',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	}
]
