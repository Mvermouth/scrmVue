
import { constant2Array } from '../../../../../scripts/utils/misc'
import constant from '../../../../../configs/constant'

export default [
	{
		prop: 'name',
		label: '名称',
		rule: { required: true, message: '标签名称', trigger: 'blur' },
		render(h) {
			return <i-input v-model={this.model} placeholder='请输入名称'></i-input>
		}
	},

	{
		prop: 'type',
		label: '类型',
		rule: { required: true, message: '类型不能为空', trigger: 'change', type: 'string' },
		default: 'asset',
		render(h) {
			const options = constant2Array(constant.TagType).map(it => { return <i-option value={it.value}>{it.text}</i-option> })
			return <i-select v-model={this.model}>{options}</i-select>
		}
	}
]
