import { constant2Array } from '../../../../../scripts/utils/misc'
import constant from '../../../../../configs/constant'
export default [
	{
		property: 'content',
		filter: 'LIKE',
		label: '敏感词',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'level',
		filter: 'EQ',
		label: '敏感级别',
		render(h, context) {
			const options = constant2Array(constant.SensitiveLevel).map(it => { return <i-option v-model={it.value}>{it.text}</i-option> })
			return <i-select clearable v-model={this.model}>{options}</i-select>
		}
	}
]
