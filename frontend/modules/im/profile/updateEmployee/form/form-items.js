import Employee from '../../../../../models/erp/employee'
export default [
	{
		prop: 'employeeId',
		label: '归属员工',
		rule: { required: false, message: '请输入归属员工' },
		render(h) {
			const defaultOptions = this.$root.defaultOptions
			const loadOptions = async value => {
				if (!value) return []
				const ps = [
					Employee.search(1, 20, [{ filterType: 'LIKE', property: 'sn', value: value }, { filterType: 'EQ', property: 'deleted', value: false }], [], true),
					Employee.search(1, 20, [{ filterType: 'LIKE', property: 'name', value: value }, { filterType: 'EQ', property: 'deleted', value: false }], [], true)
				]
				const results = await Promise.all(ps)
				const content = _.unionWith(results[0].content, results[1].content, _.isEqual)
				return content.map(it => { return { value: it.id, label: `${it.sn}(${it.name})` } })
			}
			return <remote-select v-model = {this.model} load-options={loadOptions} defaultOptions = {defaultOptions} placeholder='请输入工号和姓名'></remote-select>
		}
	}
]
