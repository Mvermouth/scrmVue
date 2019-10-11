export default [
	{
		property: 'alias',
		filter: 'LIKE',
		label: '好友备注',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'toContact.nickname',
		filter: 'LIKE',
		label: '好友昵称',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'toContact.customID',
		filter: 'LIKE',
		label: '好友微信号',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	}
]
