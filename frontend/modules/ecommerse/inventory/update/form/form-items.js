
export default [
	{
		prop: 'quantity',
		label: '库存',
		rule: { required: true, message: '请输入库存数量' },
		render(h) {
			return <input-number v-model={this.model} placeholder='请输入库存数量'></input-number>
		}
	}
]
