import { constant2Array } from '../../../../../scripts/utils/misc'
import constant from '../../../../../configs/constant'
import Employee from '../../../../../models/erp/employee'
export default [
	{
		property: 'customID',
		filter: 'EQ',
		label: '微信号',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'employee.id',
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
		property: 'nickname',
		filter: 'LIKE',
		label: '昵称',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	}
]
