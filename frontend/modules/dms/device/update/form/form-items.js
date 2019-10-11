import Employee from '../../../../../models/erp/employee'
export default [

	{
		prop: 'extra.sn',
		label: '设备编号',
		render(h) {
			return <i-input v-model={this.model} placeholder='请填写设备编号'></i-input>
		}
	},

	{
		prop: 'extra.employeeId',
		label: '归属员工',
		rule: { required: false, message: '请选择归属员工' },
		render(h) {
			const defaultOptions = this.$root.defaultOptions
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
			return <remote-select v-model = {this.model} defaultOptions={defaultOptions} load-options={loadOptions} placeholder='请输入'></remote-select>
		}
	},

	{
		prop: 'extra.remark',
		label: '备注',
		render(h) {
			return <i-input v-model={this.model} placeholder='请填写设备备注'></i-input>
		}
	}
]
