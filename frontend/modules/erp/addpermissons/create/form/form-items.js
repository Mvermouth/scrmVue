export default [
    {
		prop: 'name',
		label: '权限名称',
		default: '',
		rule: { required: true, message: '任务名称为必填项', trigger: 'blur' },
		render(h) {
			h = this.$root.$createElement
			return <i-input v-model={ this.model }></i-input>
		}
	}
	,{
		prop: 'uri',
		label: '权限uri标识',
		default: '',
		rule: { required: true, message: '任务名称为必填项', trigger: 'blur' },
		render(h) {
			h = this.$root.$createElement
			return <i-input v-model={ this.model }></i-input>
		}
	}
]
