import Department from '../../../../../models/erp/department'
import User from '../../../../../models/auth/user'
import Employee from '../../../../../models/erp/employee'
export default [
	{
		prop: 'username',
		label: '用户名',
		trim: true,
		rule: { required: true, validator: async(rule, value, form, defaultForm, callback) => {
			if (!value) {
				callback(new Error('用户名不能为空'))
				return
			}
			const data = await User.page(1, 10, [{ filterType: 'EQ', property: 'nickname', value: value }], [])
			if (defaultForm.username !== value && data.content.length !== 0) {
				callback(new Error('用户名已经存在'))
				return
			}
			callback()
		}, trigger: 'blur' },
		render(h) {
			return <i-input v-model={this.model} placeholder='请填写用户名'></i-input>
		}
	},

	{
		prop: 'name',
		label: '姓名',
		render(h) {
			return <i-input v-model={this.model} placeholder='请填写姓名'></i-input>
		}
	},

	{
		prop: 'sn',
		label: '工号',
		trim: true,
		rule: { required: true, validator: async(rule, value, form, defaultForm, callback) => {
			if (!value) {
				callback(new Error('员工工号不能为空'))
				return
			}
			const data = await Employee.search(1, 10, [{ filterType: 'EQ', property: 'sn', value: value }], [])
			if (defaultForm.sn !== value && data.content.length !== 0) {
				callback(new Error('员工工号已经存在'))
				return
			}
			callback()
		}, trigger: 'blur' },
		render(h) {
			return <i-input v-model={this.model} placeholder='请填写工号'></i-input>
		}
	},

	{
		prop: 'departmentIds',
		label: '部门',
		default: [[]],

		transform(value) {
			const arr = []
			value.forEach(it => { if (_.last(it)) arr.push(_.last(it)) })
			return arr.length > 0 ? arr : null
		},

		rule: { required: true, validator: (rule, value, form, defaultForm, callback) => {
			const arr = []
			if (value[0].length === 0) {
				callback(new Error('请选择上级部门'))
				return false
			}
			value.forEach(it => { arr.push(_.last(it)) })
			const deweightingArr = _.uniq(arr)
			if (deweightingArr.length !== value.length) {
				callback(new Error('选择的部门不能重复'))
				return false
			}
			callback()
		}, trigger: 'blur' },

		render(h) {
			h = this.$root.$createElement
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
			return <multiple-department v-model={this.model} load-data={loadData}></multiple-department>
		}
	},

	{
		prop: 'roleIds',
		label: '角色',
		default: [],
		render(h) {
			const roles = this.$root.roles
			const options = roles.map(it => { return <i-option value={it.id}>{it.name}</i-option> })
			return <i-select v-model={this.model} multiple clearable>{options}</i-select>
		}
	},

	{
		prop: 'status',
		label: '在职状态',
		default: 'DUTY',
		render(h) {
			return <radio-group v-model={this.model}>
				<radio label='DUTY'>在职</radio>
				<radio label='NONDUTY'>离职</radio>
			</radio-group>
		}
	}
]
