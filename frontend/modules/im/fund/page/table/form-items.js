import { datePickerShortcuts } from '../../../../../scripts/utils/misc'
import { constant2Array } from '../../../../../scripts/utils/misc'
import constant from '../../../../../configs/constant'
export default [
	{
		property: 'profile.customID',
		filter: 'EQ',
		label: '运营微信号',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'profile.nickname',
		filter: 'LIKE',
		label: '运营微信号昵称',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'contact.customID',
		filter: 'LIKE',
		label: '好友微信号',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'contact.nickname',
		filter: 'LIKE',
		label: '好友昵称',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'type',
		filter: 'EQ',
		label: '类型',
		render(h) {
			const options = constant2Array(constant.ExchangeType).map(it => { return <i-option value={it.value}>{it.text}</i-option> })
			return <i-select v-model={this.model}>{options}</i-select>
		}
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
		label: '录入系统时间',
		render(h) {
			return <date-picker type='datetimerange' v-model={this.model} format='yyyy-MM-dd' style={{ width: '100%' }} options={{ shortcuts: datePickerShortcuts() }} placeholder='选择日期' ></date-picker>
		}
	}
]
