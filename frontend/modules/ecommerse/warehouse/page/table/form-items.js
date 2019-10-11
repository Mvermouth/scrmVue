export default [
	{
		property: 'name',
		filter: 'LIKE',
		label: '仓库名称',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	}
]
