
export default [
	{
		prop: 'remark',
		label: '备注',
		rule: { required: false, message: '备注不能为空' },
		render(h) {
			h = this.$root.$createElement
			return <div>
				<i-input v-model={this.model} type='textarea' rows={4} placeholder='请输入备注'></i-input>
				<input type='text' style='display: none;'></input>
			</div>
		}
	}
]
