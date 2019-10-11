import { datePickerShortcuts } from '../../../../../scripts/utils/misc'

export default [
	{
		property: 'sn',
		filter: 'EQ',
		label: '产品编号',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'name',
		filter: 'LIKE',
		label: '产品名称',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'brandId',
		filter: 'EQ',
		label: '商品品牌',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'categories.id',
		filter: (formItem, value) => {
			if (_.isEmpty(value)) {
				return []
			}
			const criterias = [
				{
					property: formItem.property,
					value: _.last(value),
					filterType: 'EQ'
				}

			]
			return criterias
		},
		default: [],
		label: '分类',
		render(h) {
			return <category-cascader v-model={this.model}></category-cascader>
		}
	},
	{
		property: 'ctime',
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
					filterType: 'LT'
				})
			}
			return criterias
		},
		default: ['', ''],
		label: '创建时间',
		render(h) {
			return <date-picker type='datetimerange' v-model={this.model} format='yyyy-MM-dd' style={{ width: '100%' }} options={{ shortcuts: datePickerShortcuts() }} placeholder='选择日期' ></date-picker>
		}
	}
]
