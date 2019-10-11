import constant from '../../../../../configs/constant'
import { constant2Array } from '../../../../../scripts/utils/misc'
export default [
	{
		property: 'title',
		filter: 'LIKE',
		label: '店铺名称',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'platformId',
		filter: 'EQ',
		label: '平台',
		render(h) {
			const options = constant2Array(constant.PlatformMap).map(it => { return <i-option v-model={it.value}>{it.text}</i-option> })
			return <i-select clearable v-model={this.model}>{options}</i-select>
		}
	}
]
