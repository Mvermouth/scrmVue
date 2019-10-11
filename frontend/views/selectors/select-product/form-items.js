export default [
	{
		property: 'name',
		filter: 'LIKE',
		label: '商品名称',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	}
]
