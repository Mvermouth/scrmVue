import { datePickerShortcuts } from '../../../../../../scripts/utils/misc'
export default [

	{
		property: 'username',
		filter: 'LIKE',
		label: '用户名',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'type',
		filter: 'LIKE',
		label: '登录IP',
		render(h) {
			return <i-input v-model={this.model} placeholder='请输入'></i-input>
		}
	},
	{
		property: 'ctime',
		filter: (formItem, value) => {
			const criterias = []
			if (value[0]) {
				criterias.push({
					property: formItem.property,
					value: value[0].getTime(),
					filterType: 'GTE'
				})
			}
			if (value[1]) {
				criterias.push({
					property: formItem.property,
					value: value[1].getTime(),
					filterType: 'LT'
				})
			}
			return criterias
		},
		default: ['', ''],
		label: '登录时间',
		render(h) {
			return <date-picker type='datetimerange' v-model={this.model} format='yyyy-MM-dd' style={{ width: '100%' }} options={{ shortcuts: datePickerShortcuts() }} placeholder='选择日期' ></date-picker>
		}
	}
]
