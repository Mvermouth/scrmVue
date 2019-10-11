import areaData from '../../../../../configs/wxaddress.json'
export default [
	{
		property: 'realname',
		filter: 'LIKE',
		label: '姓名',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'mobile',
		filter: 'LIKE',
		label: '手机号',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'address',
		filter: (formItem, value) => {
			const criterias = []
			const arr = ['province', 'city', 'district']
			arr.forEach((it, index) => {
				if (value.length > index) {
					criterias.push({
						property: it,
						value: value[index],
						filterType: 'EQ'
					})
				}
			})
			return criterias
		},
		default: [],
		label: '地址',
		render(h) {
			return <cascader data={areaData} v-model={this.model} placeholder='请选择地区'></cascader>
		}
	}
]
