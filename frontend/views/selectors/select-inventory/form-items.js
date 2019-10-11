export default [
	{
		property: 'productName',
		filter: 'LIKE',
		label: '名称',
		render(h) { return <i-input v-model={this.model} size='small' placeholder='请输入'></i-input> }
	},
	{
		property: 'code',
		filter: 'EQ',
		label: '货号',
		render(h) { return <i-input v-model={this.model} size='small' placeholder='请输入'></i-input> }
	},
	{
		property: 'price',
		filter: (formItem, value) => {
			const criterias = []
			if (value[0]) {
				criterias.push({
					property: formItem.property,
					value: value[0] * 100,
					filterType: 'GTE'
				})
			}
			if (value[1]) {
				criterias.push({
					property: formItem.property,
					value: value[1] * 100,
					filterType: 'LTE'
				})
			}
			return criterias
		},
		label: '售价',
		default: [0, 0],
		render(h) {
			return <input-number-range v-model={this.model}></input-number-range>
		}
	},
	{
		property: 'quantity',
		filter: (formItem, value) => {
			const criterias = []
			if (value[0]) {
				criterias.push({
					property: formItem.property,
					value: value[0],
					filterType: 'GTE'
				})
			}
			if (value[1]) {
				criterias.push({
					property: formItem.property,
					value: value[1],
					filterType: 'LTE'
				})
			}
			return criterias
		},
		label: '库存',
		default: [0, 0],
		render(h) {
			return <input-number-range v-model={this.model}></input-number-range>
		}
	}
]
