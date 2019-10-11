import Employee from '../../../../../models/erp/employee'

export default [
	{
		property: 'profile.employee.id',
		filter: 'LIKE',
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
		property: 'publisher.customID',
		filter: 'LIKE',
		label: '发布者微信号',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'publisher.platformUid',
		filter: 'LIKE',
		label: '发布者微信ID',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'publisher.nickname',
		filter: 'LIKE',
		label: '发布者昵称',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	}
]
