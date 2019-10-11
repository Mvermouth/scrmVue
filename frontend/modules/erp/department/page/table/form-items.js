import Department from '../../../../../models/erp/department'
export default async() => {
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
			property: 'id',
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
				const loadData = async() => {
					const result = await Department.expand()
					tranformData(result)
					return result
				}
				return <remote-cascader v-model={this.model} load-data={loadData}></remote-cascader>
			}
		},

		{
			property: 'leader',
			filter: 'LIKE',
			label: '负责人',
			render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
		}
	]
}
