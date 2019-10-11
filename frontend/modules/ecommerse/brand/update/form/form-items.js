
export default [
	{
		prop: 'name',
		label: '品牌名称',
		rule: { required: true, message: '请输入品牌名称' },
		render(h) {
			return <i-input v-model={this.model} placeholder='请输入品牌名称'></i-input>
		}
	},
	{
		prop: 'description',
		label: '品牌描述',
		rule: { required: true, message: '请输入品牌描述' },
		render(h) {
			return <i-input v-model={this.model} placeholder='请输入品牌描述'></i-input>
		}
	},
	{
		prop: 'url',
		label: '品牌链接',
		rule: { required: false, message: '请输入品牌链接' },
		render(h) {
			return <i-input v-model={this.model} placeholder='请输入品牌链接'></i-input>
		}
	}
]
