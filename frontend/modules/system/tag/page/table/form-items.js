import { constant2Array } from '../../../../../scripts/utils/misc'
import constant from '../../../../../configs/constant'
export default [

	{
		property: 'name',
		filter: 'LIKE',
		label: '名称',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'type',
		filter: 'EQ',
		label: '类型',
		render(h) {
			const options = constant2Array(constant.TagType).map(it => { return <i-option value={it.value}>{it.text}</i-option> })
			return <i-select v-model={this.model}>{options}</i-select>
		}
	}
]
