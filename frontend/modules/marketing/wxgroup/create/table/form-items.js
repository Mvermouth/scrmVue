export default [
	{
		property: 'name',
		filter: 'EQ',
		label: '任务名称',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	}
]