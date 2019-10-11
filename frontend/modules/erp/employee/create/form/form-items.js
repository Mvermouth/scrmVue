import Department from '../../../../../models/erp/department'
import User from '../../../../../models/auth/user'
import Employee from '../../../../../models/erp/employee'
import { validatePassword } from '../../../../../scripts/utils/misc'
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
			if (data.content.length !== 0) {
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
		rule: { required: true, message: '请填写姓名' },
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
			if (data.content.length !== 0) {
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
				return
			}
			value.forEach(it => { arr.push(_.last(it)) })
			const deweightingArr = _.uniq(arr)
			if (deweightingArr.length !== value.length) {
				callback(new Error('选择的部门不能重复'))
				return
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
		prop: 'password',
		label: '密码',
		type: 'password',
		trim: true,
		rule: { required: true, validator: (rule, value, form, defaultForm, callback) => {
			if (!validatePassword(value)) {
				callback(new Error('您输入的密码不符合规范，或过于简单!'))
				return
			}
			callback()
		} },
		render(h) {
			return <i-input type='password' v-model={this.model} placeholder='请填写密码'></i-input>
		}
	},

	{
		prop: 'confirmPassword',
		label: '确认密码',
		type: 'password',
		trim: true,
		rule: { required: true, validator: (rule, value, form, defaultForm, callback) => {
			if (!value) {
				callback(new Error('请填写确认密码'))
				return
			}
			if (value !== form.password) {
				callback(new Error('确认密码不一致'))
				return
			}
			callback()
		}, trigger: 'blur' },
		render(h) {
			return <i-input type='password' v-model={this.model} placeholder='请填写确认密码'></i-input>
		}
	}
]
