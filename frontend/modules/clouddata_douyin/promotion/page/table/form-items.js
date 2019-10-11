import { datePickerShortcuts } from '../../../../../scripts/utils/misc'
import { constant2Array } from '../../../../../scripts/utils/misc'
import constant from '../../../../../configs/constant'
export default [
	{
		property: 'promotion_id',
		filter: '$eq',
		label: 'promotion_id',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'gid',
		filter: '$eq',
		label: 'gid',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'promotion_source',
		filter: '$eq',
		label: 'promotion_source',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'elastic_type',
		filter: '$eq',
		label: 'elastic_type',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'price',
		filter: (formItem, value) => {
			const criterias = []
			if (value[0]) {
				criterias.push({
					property: formItem.property,
					value: value[0],
					filterType: '$gte'
				})
			}
			if (value[1]) {
				criterias.push({
					property: formItem.property,
					value: value[1],
					filterType: '$lte'
				})
			}
			return criterias
		},
		label: '价格区间',
		default: [0, 0],
		render(h) {
			return <input-number-range v-model={this.model}></input-number-range>
		}
	},
	{
		property: 'sales',
		filter: (formItem, value) => {
			const criterias = []
			if (value[0]) {
				criterias.push({
					property: formItem.property,
					value: value[0],
					filterType: '$gte'
				})
			}
			if (value[1]) {
				criterias.push({
					property: formItem.property,
					value: value[1],
					filterType: '$lte'
				})
			}
			return criterias
		},
		label: '全网销量',
		default: [0, 0],
		render(h) {
			return <input-number-range v-model={this.model}></input-number-range>
		}
	},
	{
		property: 'mtime',
		filter: (formItem, value) => {
			const criterias = []
			if (value[0]) {
				criterias.push({
					property: formItem.property,
					value: value[0],
					filterType: '$gte'
				})
			}
			if (value[1]) {
				criterias.push({
					property: formItem.property,
					value: value[1],
					filterType: '$lt'
				})
			}
			return criterias
		},
		default: ['', ''],
		label: '记录更新时间',
		render(h) {
			return <date-picker type='datetimerange' v-model={this.model} format='yyyy-MM-dd' style={{ width: '100%' }} options={{ shortcuts: datePickerShortcuts() }} placeholder='选择日期' ></date-picker>
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
					filterType: '$gte'
				})
			}
			if (value[1]) {
				criterias.push({
					property: formItem.property,
					value: value[1],
					filterType: '$lt'
				})
			}
			return criterias
		},
		default: ['', ''],
		label: '记录创建时间',
		render(h) {
			return <date-picker type='datetimerange' v-model={this.model} format='yyyy-MM-dd' style={{ width: '100%' }} options={{ shortcuts: datePickerShortcuts() }} placeholder='选择日期' ></date-picker>
		}
	}
]
