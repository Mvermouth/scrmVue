import { datePickerShortcuts, constant2Array } from '../../../../../../scripts/utils/misc'
import constant from '../../../../../../configs/constant'
export default [
	{
		property: 'contactName',
		label: '联系人',
		filter: 'like',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'phoneNumber',
		filter: 'like',
		label: '电话号码',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'content',
		filter: 'like',
		label: '内容',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'direction',
		filter: 'EQ',
		label: '方向',
		render(h) {
			const options = constant2Array(constant.MessageDirection).map(it => { return <i-option value={it.value}>{it.text}</i-option> })
			return <i-select v-model={this.model}>{options}</i-select>
		}
	},
	{
		property: 'sendTime',
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
		label: '发送时间',
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
		label: '操作时间',
		render(h) {
			return <date-picker type='datetimerange' v-model={this.model} format='yyyy-MM-dd' style={{ width: '100%' }} options={{ shortcuts: datePickerShortcuts() }} placeholder='选择日期' ></date-picker>
		}
	}
]
