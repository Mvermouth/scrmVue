import { constant2Array, datePickerShortcuts } from '../../../../../scripts/utils/misc'
import constant from '../../../../../configs/constant'
import Employee from '../../../../../models/erp/employee'
import Department from '../../../../../models/erp/department'
const addSourceArr = constant2Array(constant.CollectSourceType)
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
			property: 'contact.nickname',
			filter: 'LIKE',
			label: '好友昵称',
			render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
		},
		{
			property: 'profile.customID',
			filter: 'LIKE',
			label: '运营微信号',
			render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
		},
		{
			property: 'profile.platformUid',
			filter: 'LIKE',
			label: '运营微信ID',
			render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
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
			property: 'address',
			filter: (formItem, value) => {
				const criterias = []
				const arr = ['contact.country', 'contact.state', 'contact.city']
				arr.forEach((it, index) => {
					if (value.length > index) {
						criterias.push({
							property: it,
							value: value[index],
							filterType: 'EQ'
						})
					}
				})
				return criterias
			},
			default: [],
			label: '地址',
			render(h) {
				return <address-cascader v-model={this.model}></address-cascader>
			}
		},
		{
			property: 'profile.employee.departmentIds',
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
			label: '部门名称',
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
		{
			property: 'alias',
			filter: 'LIKE',
			label: '好友备注',
			render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
		},
		{
			property: 'platformTags',
			filter: 'EQ',
			label: '标签',
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
