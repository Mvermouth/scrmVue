import { datePickerShortcuts } from '../../../../../scripts/utils/misc'
import { constant2Array } from '../../../../../scripts/utils/misc'
import constant from '../../../../../configs/constant'
export default [
	{
		property: 'id',
		filter: '$eq',
		label: 'id',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'short_id',
		filter: '$eq',
		label: '抖音号',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'follower_count',
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
		label: '粉丝总数',
		default: [0, 0],
		render(h) {
			return <input-number-range v-model={this.model}></input-number-range>
		}
	},
	{
		property: 'province',
		filter: '$eq',
		label: '省份',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'city',
		filter: '$eq',
		label: '城市',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'live_commerce',
		filter: '$eq',
		label: '是否商家',
		render(h) {
			return <radio-group v-model={this.model} type="button">
				<radio label="">全部</radio>
				<radio label={true}>是</radio>
				<radio label={false}>否</radio>
			</radio-group>
			/*
			return <i-select clearable v-model={this.model}>
				<i-option value={1}>是</i-option>
				<i-option value={0}>否</i-option>
			</i-select>
			*/
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
