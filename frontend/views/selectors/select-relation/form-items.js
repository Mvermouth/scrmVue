import Employee from '../../../models/erp/employee'
export default [
	{
		property: 'contact.customID',
		filter: 'LIKE',
		label: '好友微信号',
		render(h) { return <i-input v-model={this.model} size='small' placeholder='请输入'></i-input> }
	},
	{
		property: 'contact.platformUid',
		filter: 'EQ',
		label: '好友微信ID',
		render(h) { return <i-input v-model={this.model} size='small' placeholder='请输入'></i-input> }
	},
	{
		property: 'contact.nickname',
		filter: 'LIKE',
		label: '好友昵称',
		render(h) { return <i-input v-model={this.model} size='small' placeholder='请输入'></i-input> }
	},
	{
		property: 'profile.customID',
		filter: 'LIKE',
		label: '运营微信号',
		render(h) { return <i-input v-model={this.model} size='small' placeholder='请输入'></i-input> }
	},
	{
		property: 'profile.platformUid',
		filter: 'EQ',
		label: '运营微信ID',
		render(h) { return <i-input v-model={this.model} size='small' placeholder='请输入'></i-input> }
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
		property: 'alias',
		filter: 'LIKE',
		label: '好友备注',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	}
]
