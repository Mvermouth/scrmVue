import Department from '../../../../../models/erp/department'

export default [
	{
		prop: 'name',
		label: '部门名称',
		rule: { required: true, message: '请填写部门名称' },
		render(h) {
			return <i-input v-model={this.model} placeholder='请填写部门名称'></i-input>
		}
	},
	{
		prop: 'parentId',
		label: '上级部门',
		default: [],
		transform(value) {
			if (_.isArray(value) && value.length > 0) {
				return _.last(value)
			}
			return null
		},
		rule: { required: false, message: '请选择上级部门' },
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
		prop: 'roleIds',
		label: '角色',
		default: [],
		rule: { required: false, message: '请选择角色' },
		render(h) {
			const roles = this.$root.roles
			const options = roles.map(it => { return <i-option value={it.id}>{it.name}</i-option> })
			return <i-select v-model={this.model} multiple clearable>{options}</i-select>
		}
	},

	{
		prop: 'mobile',
		label: '联系电话',
		rule: { required: false, message: '请填写联系电话' },
		render(h) {
			return <i-input v-model={this.model} placeholder='请填写联系电话'></i-input>
		}
	},

	{
		prop: 'leader',
		label: '负责人',
		rule: { required: false, message: '请填写负责人' },
		render(h) {
			return <i-input v-model={this.model} placeholder='请填写联系负责人'></i-input>
		}
	}
]
