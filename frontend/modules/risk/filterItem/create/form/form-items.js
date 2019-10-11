
import { constant2Array } from '../../../../../scripts/utils/misc'
import constant from '../../../../../configs/constant'

export default [
	{
		prop: 'content',
		label: '内容',
		rule: { required: true, message: '白名单内容为空', trigger: 'blur' },
		render(h) {
			return <i-input v-model={this.model} placeholder='请输入内容'></i-input>
		}
	},

	{
		prop: 'category',
		label: '分类',
		rule: { required: true, message: '分类不能为空', trigger: 'change' },
		render() {
			const options = constant2Array(constant.FilterItemCategory).map(it => { return <i-option value={it.value}>{it.text}</i-option> })
			return <i-select v-model={this.model}>{options}</i-select>
		}
	}

	// {
	// 	prop: 'type',
	// 	label: '类型',
	// 	rule: { required: true, message: '请选择黑白名单', trigger: 'change' },
	// 	render() {
	// 		const options = constant2Array(constant.FilterItemType).map(it => { return <i-option value={it.value}>{it.text}</i-option> })
	// 		return <i-select v-model={this.model}>{options}</i-select>
	// 	}
	// }
]
