import { datePickerShortcuts } from '../../../../../scripts/utils/misc'
export default [
	{
		property: 'extStr2',
		filter: 'LIKE',
		label: '订单编号',
		render(h) {
			return <i-input v-model={this.model}></i-input>
		}
	},
	{
		property: 'amount',
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
		label: '金额',
		default: [0, 0],
		render(h) {
			return <input-number-range v-model={this.model}></input-number-range>
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
		label: '支付时间',
		render(h) {
			return <date-picker type='datetimerange' v-model={this.model} format='yyyy-MM-dd' style={{ width: '100%' }} options={{ shortcuts: datePickerShortcuts() }} placeholder='选择日期' ></date-picker>
		}
	}
]
