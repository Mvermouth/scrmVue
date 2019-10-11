
export default [
	{
		prop: 'tags',
		label: '标签',
		default: [],
		rule: { required: false, message: '请填写标签' },
		render(h) {
			h = this.$root.$createElement
			return <tags-input v-model={this.model} btnName='添加标签'></tags-input>
		}
	},
	{
		prop: 'remark',
		label: '备注',
		default: [],
		rule: { required: false, message: '请填写好友的备注信息' },
		render(h) {
			return <i-input v-model={this.model} type='textarea'></i-input>
		}
	}
]
