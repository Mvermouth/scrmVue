export default [
	{
		prop: 'name',
		label: '消息名称',
		render(h) {
			return <i-input> v-model={this.model}></i-input>
		}
	},
	{
		prop: 'status',
		label: '状态',
		render(h) {
			const options = [
				<i-option>使用中</i-option>,
				<i-option>停止使用</i-option>
			]
			return <i-select>{options}</i-select>
		}
	},
	{
		prop: 'deviceId',
		label: '执行运营号',
		render(h) {
			return <i-input> v-model={this.model}></i-input>
		}
	}
]
