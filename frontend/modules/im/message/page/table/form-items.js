import { constant2Array, datePickerShortcuts } from '../../../../../scripts/utils/misc'
import constant from '../../../../../configs/constant'
import Department from '../../../../../models/erp/department'
import Employee from '../../../../../models/erp/employee'
import Profile from '../../../../../models/im/profile'
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
		property: 'direction',
		filter: 'EQ',
		label: '消息方向',
		render(h) {
			const options = constant2Array(constant.MessageDirection).map(it => { return <i-option v-model={it.value}>{it.text}</i-option> })
			return <i-select clearable v-model={this.model}>{options}</i-select>
		}
	},
	{
		property: 'employeeId',
		filter: 'EQ',
		label: '归属员工',
		render(h) {
			const loadOptions = async value => {
				if (!value) return []
				const ps = [
					Employee.search(1, 20, [{ filterType: 'LIKE', property: 'sn', value }], [], true),
					Employee.search(1, 20, [{ filterType: 'LIKE', property: 'name', value }], [], true)
				]
				const results = await Promise.all(ps)
				const content = _.unionWith(results[0].content, results[1].content, _.isEqual)
				return content.map(it => { return { value: it.id, label: `${it.sn}(${it.name})` } })
			}
			return <remote-select v-model={this.model} load-options={loadOptions} placeholder='请输入'></remote-select>
		}
	},
	{
		property: 'profileContactID',
		filter: 'EQ',
		label: '运营号',
		render(h) {
			const loadOptions = async value => {
				if (!value) return []
				const filter = {
					'or': [
						{
							filterType: 'EQ',
							property: 'customID',
							value: value
						},
						{
							filterType: 'EQ',
							property: 'platformUid',
							value: value
						},
						{
							filterType: 'EQ',
							property: 'nickname',
							value: value
						}
					],
					and: []
				}
				const profilePage = await Profile.page(1, 50, filter, [])
				return profilePage.content.map(it => { return { value: it.contactID, label: `${it.customID}(${it.nickname})` } })
			}
			return <remote-select v-model={this.model} load-options={loadOptions} placeholder='请输入运营号'></remote-select>
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
							property: 'contact.platformUid',
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
				const content = _.uniqBy(profilePage.content.map(it => it.contact), 'id')
				return content.map((it, index) => { return { value: `${it.id}+${index}`, label: `${it.customID}(${it.nickname})` } })
			}
			return <remote-select v-model={this.model} load-options={loadOptions} placeholder='请输入好友昵称、备注、微信号'></remote-select>
		}
	},
	{
		property: 'deptIds',
		filter: (formItem, value) => {
			const criterias = []
			if (value.length > 0) {
				value = _.last(value)
				criterias.push({
					property: formItem.property,
					value: value,
					filterType: 'EQ'
				})
			}
			return criterias
		},
		label: '归属部门',
		default: [],
		render(h) {
			const tranformData = (data) => {
				data.forEach(it => {
					it.value = it.id
					it.label = it.name
					if (it.children && it.children.length > 0) {
						tranformData(it.children)
					}
				})
			}
			const loadData = async() => {
				const result = await Department.expand()
				tranformData(result)
				return result
			}
			return <remote-cascader v-model={this.model} load-data={loadData}></remote-cascader>
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

