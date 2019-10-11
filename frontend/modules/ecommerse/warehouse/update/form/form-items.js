
export default [
	{
		prop: 'name',
		label: '仓库名称',
		rule: { required: true, message: '请输入仓库名称' },
		render(h) {
			return <i-input v-model={this.model} placeholder='请输入仓库名称'></i-input>
		}
	},
	{
		prop: 'description',
		label: '仓库描述',
		rule: { required: false, message: '请输入仓库描述' },
		render(h) {
			return <i-input v-model={this.model} placeholder='请输入仓库描述'></i-input>
		}
	},
	{
		prop: 'address',
		label: '仓库地址',
		rule: { required: false, message: '请输入仓库地址' },
		render(h) {
			return <i-input v-model={this.model} placeholder='请输入仓库地址'></i-input>
		}
	}
]
