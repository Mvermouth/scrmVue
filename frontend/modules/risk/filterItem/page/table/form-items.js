import { constant2Array } from '../../../../../scripts/utils/misc'
import constant from '../../../../../configs/constant'
export default [
	{
		property: 'category',
		filter: 'EQ',
		label: '类型',
		render() {
			const options = constant2Array(constant.FilterItemCategory).map(it => { return <i-option v-model={it.value}>{it.text}</i-option> })
			return <i-select clearable v-model={this.model}>{options}</i-select>
		}
	},
	{
		property: 'content',
		filter: 'LIKE',
		label: '内容',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	}

]
