import Employee from '../../../../../models/erp/employee'
import Department from '../../../../../models/erp/department'
export default async () => {
	// const departments = await Department.expand()
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
			property: 'sn',
			filter: 'EQ',
			label: '员工工号',
			render(h) {
				const loadOptions = async value => {
					if (!value) return []
					const result = await Employee.search(1, 20, [{ filterType: 'LIKE', property: 'sn', value }, { filterType: 'EQ', property: 'deleted', value: false }], [], true)
					return result.content.map(it => { return { value: it.sn, label: it.sn } })
				}
				return <remote-select v-model={this.model} load-options={loadOptions} placeholder='请输入'></remote-select>
			}
		},

		{
			property: 'name',
			filter: 'EQ',
			label: '员工姓名',
			render(h) {
				const loadOptions = async value => {
					if (!value) return []
					const result = await Employee.search(1, 20, [{ filterType: 'LIKE', property: 'name', value }, { filterType: 'EQ', property: 'deleted', value: false }], [], true)
					return result.content.map(it => { return { value: it.name, label: it.name } })
				}
				return <remote-select v-model={this.model} load-options={loadOptions} placeholder='请输入'></remote-select>
			}
		},
		{
			property: 'departmentId',
			filter: 'EQ',
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
			property: 'position',
			filter: 'LIKE',
			label: '职位',
			render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
		}
	]
}
