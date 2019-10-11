import { constant2Array, datePickerShortcuts } from '../../../../../scripts/utils/misc'
import constant from '../../../../../configs/constant'
import Employee from '../../../../../models/erp/employee'
import Department from '../../../../../models/erp/department'
export default async () => {
	const departments = await Department.expand()
	const getDepartments = (id, departments, result) => {
		departments.forEach(it => {
			if (it.id === id) {
				result.push(it)
			}
			if (it.children && it.children.length > 0) {
				getDepartments(id, it.children, result)
			}
		})
		return result
	}
	const getDepartmentIds = (departments, result) => {
		departments.forEach(it => {
			result.push(it.id)
			if (it.children && it.children.length > 0) {
				getDepartmentIds(it.children, result)
			}
		})
		return result
	}
	return [
		{
			property: 'customID',
			filter: 'EQ',
			label: '微信号',
			render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
		},

		{
			property: 'platformUid',
			filter: 'EQ',
			label: '微信ID',
			render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
		},
		{
			property: 'nickname',
			filter: 'EQ',
			label: '昵称',
			render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
		},
		{
			property: 'employee.id',
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
			property: 'employee.departmentIds',
			filter: (formItem, value) => {
				const criterias = []
				if (value.length > 0) {
					value = _.last(value)
					const selectedDepartments = getDepartments(value, departments, [])
					const ids = getDepartmentIds(selectedDepartments, [])
					criterias.push({
						property: formItem.property,
						value: ids,
						filterType: 'IN'
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
				const loadData = async () => {
					const result = await Department.expand()
					tranformData(result)
					return result
				}
				return <remote-cascader v-model={this.model} load-data={loadData}></remote-cascader>
			}
		},
		// {
		// 	property: 'gender',
		// 	filter: 'EQ',
		// 	label: '性别',
		// 	render(h) {
		// 		const options = constant2Array(constant.Gender).map(it => { return <i-option v-model={it.value}>{it.text}</i-option> })
		// 		return <i-select clearable v-model={this.model}>{options}</i-select>
		// 	}
		// },
		{
			property: 'deviceID',
			filter: (formItem, value) => {
				const criterias = []
				if (value) {
					criterias.push({
						property: formItem.property,
						value: value.toLowerCase(),
						filterType: 'LIKE'
					})
				}
				return criterias
			},
			label: 'UDID',
			render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
		},
		{
			property: 'mobilephone',
			filter: 'LIKE',
			label: '绑定号码',
			render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
		},
		{
			property: 'tags',
			filter: 'EQ',
			label: '标签',
			render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
		},
		{
			property: 'online',
			filter: 'EQ',
			label: '在线状态',
			render(h) {
				const options = constant2Array(constant.UserOnlineStatus).map(it => { return <i-option v-model={it.value}>{it.text}</i-option> })
				return <i-select clearable v-model={this.model}>{options}</i-select>
			}
		},
		{
			property: 'contactCount',
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
						filterType: 'LTE'
					})
				}
				return criterias
			},
			label: '好友总数',
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
			label: '录入系统时间',
			render(h) {
				return <date-picker type='datetimerange' v-model={this.model} format='yyyy-MM-dd' style={{ width: '100%' }} options={{ shortcuts: datePickerShortcuts() }} placeholder='选择日期' ></date-picker>
			}
		}
	]
}
