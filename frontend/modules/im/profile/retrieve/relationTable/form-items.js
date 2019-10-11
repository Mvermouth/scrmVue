import { constant2Array, datePickerShortcuts } from '../../../../../scripts/utils/misc'
import constant from '../../../../../configs/constant'
const addSourceArr = constant2Array(constant.CollectSourceType)
export default [
	{
		property: 'alias',
		filter: 'LIKE',
		label: '好友备注',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'contact.nickname',
		filter: 'LIKE',
		label: '好友昵称',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'contact.customID',
		filter: 'LIKE',
		label: '好友微信号',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'contact.platformUid',
		filter: 'LIKE',
		label: '好友微信ID',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'contact.gender',
		filter: 'EQ',
		label: '性别',
		render(h) {
			const options = constant2Array(constant.Gender).map(it => { return <i-option v-model={it.value}>{it.text}</i-option> })
			return <i-select clearable v-model={this.model}>{options}</i-select>
		}
	},
	{
		property: 'favorite',
		filter: 'EQ',
		label: '星标',
		render(h) {
			const options = constant2Array(constant.YesNo).map(it => { return <i-option v-model={it.value}>{it.text}</i-option> })
			return <i-select clearable v-model={this.model}>{options}</i-select>
		}
	},
	{
		property: 'sourceType',
		filter: (formItem, value) => {
			const matchItem = _.find(addSourceArr, it => { return it.value.includes(value) })
			console.log(matchItem)
			const finalValue = matchItem ? matchItem.value : []
			const criterias = []
			if (!_.isEmpty(finalValue)) {
				criterias.push({
					property: formItem.property,
					value: finalValue,
					filterType: 'IN'
				})
			}
			return criterias
		},
		label: '添加方式',
		render(h) {
			const options = constant2Array(constant.CollectSourceType).map(it => { return <i-option v-model={it.value[0]}>{it.text}</i-option> })
			return <i-select clearable v-model={this.model}>{options}</i-select>
		}
	},
	{
		property: 'tags',
		filter: 'EQ',
		label: '标签',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'requestTime',
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
		label: '请求添加时间',
		render(h) {
			return <date-picker type='datetimerange' v-model={this.model} format='yyyy-MM-dd' style={{ width: '100%' }} options={{ shortcuts: datePickerShortcuts() }} placeholder='选择日期' ></date-picker>
		}
	},

	{
		property: 'approvedTime',
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
		label: '通过好友时间',
		render(h) {
			return <date-picker type='datetimerange' v-model={this.model} format='yyyy-MM-dd' style={{ width: '100%' }} options={{ shortcuts: datePickerShortcuts() }} placeholder='选择日期' ></date-picker>
		}
	}
]
