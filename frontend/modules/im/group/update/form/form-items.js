
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
		prop: 'uploadMsg',
		label: '上报群消息',
		default: '',
		render(h) {
			return <i-switch v-model={this.model}></i-switch>
		}
	}
]
