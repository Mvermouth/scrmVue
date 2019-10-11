
export default [
	{
		prop: 'name',
		label: '素材标题',
		rule: { required: true, message: '素材标题为空', trigger: 'blur' },
		render(h) {
			return <i-input v-model={this.model} placeholder='请输入素材标题'></i-input>
		}
	},

	{
		prop: 'url',
		label: '链接地址',
		rule: { required: true, message: '链接地址不能为空', trigger: 'blur' },
		render(h) {
			return <i-input v-model={this.model} placeholder='请输入链接地址'></i-input>
		}
	}
]
