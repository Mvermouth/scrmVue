import { constant2Array, datePickerShortcuts } from '../../../../../scripts/utils/misc'
import constant from '../../../../../configs/constant'
import Relation from '../../../../../models/im/relation'
export default [
	{
		property: 'textContent',
		filter: 'LIKE',
		ellipsis: true,
		label: '消息内容',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'messageType',
		filter: 'EQ',
		label: '消息类型',
		render(h) {
			const options = constant2Array(constant.MessageType).map(it => { return <i-option v-model={it.value}>{it.text}</i-option> })
			return <i-select clearable v-model={this.model}>{options}</i-select>
		}
	},
	{
		property: 'contactID',
		label: '好友',
		filter: (formItem, value) => {
			const criterias = []
			if (value.length > 0) {
				value = _.split(value, '+')[0]
				criterias.push({
					property: formItem.property,
					value: value,
					filterType: 'EQ'
				})
			}
			return criterias
		},
		render(h) {
			const loadOptions = async value => {
				if (!value) return []
				const filter = {
					'or': [
						{
							filterType: 'EQ',
							property: 'contact.customID',
							value: value
						},
						{
							filterType: 'EQ',
							property: 'contact.nickname',
							value: value
						},
						{
							filterType: 'EQ',
							property: 'alias',
							value: value
						}
					],
					and: []
				}
				const profilePage = await Relation.page(1, 30, filter, [])
				return profilePage.content.map((it, index) => { return { value: `${it.contact.id}+${index}`, label: `${it.contact.customID}(${it.contact.nickname})` } })
			}
			return <remote-select v-model={this.model} load-options={loadOptions} placeholder='请输入好友昵称、备注、微信号'></remote-select>
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
	}

]
