
export default [
	{
		prop: 'tags',
		label: '标签',
		default: [],
		rule: { required: false, message: '请填写标签' },
		render(h) {
			h = this.$root.$createElement
			return <div>
				<tags-input v-model={this.model} btnName='添加标签'></tags-input>
				<input type='text' style='display: none;'></input>
			</div>
		}
	}
]
