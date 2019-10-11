import { constant2Array, datePickerShortcuts } from '../../../../../scripts/utils/misc'
import constant from '../../../../../configs/constant'
import Employee from '../../../../../models/erp/employee'
export default [
	{
		property: 'profile.platformUid',
		filter: 'EQ',
		label: '运营号ID',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'profile.customID',
		filter: 'EQ',
		label: '运营微信号',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'profile.nickname',
		filter: 'LIKE',
		label: '运营号昵称',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'action',
		filter: 'EQ',
		label: '操作类型',
		render(h) {
			const options = constant2Array(constant.WxActionSetting).map(it => { return <i-option v-model={it.value}>{it.text}</i-option> })
			return <i-select clearable v-model={this.model}>{options}</i-select>
		}
	},
	{
		property: 'profile.employee.id',
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
		property: 'contact.customID',
		filter: 'EQ',
		label: '好友微信号',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'contact.nickname',
		filter: 'EQ',
		label: '好友昵称',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
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
