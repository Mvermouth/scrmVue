
import { constant2Array } from '../../../../../scripts/utils/misc'
import constant from '../../../../../configs/constant'
const validateSensitive = (rule, value, callback) => {
	if (value === '') {
		callback(new Error('请填写敏感词'))
	} else {
		if (value.length <= 1) {
			callback(new Error('敏感词长度必须大于1'))
		} else {
			callback()
		}
	}
}
export default [
	{
		prop: 'content',
		label: '敏感词',
		rule: [{ validator: validateSensitive, trigger: 'blur' }],
		render(h) {
			return <i-input v-model={this.model} placeholder='请输入敏感词'></i-input>
		}
	},

	// {
	// 	prop: 'replaceContent',
	// 	label: '替换词',
	// 	render(h) {
	// 		return <i-input v-model={this.model} placeholder='请输入替换词'></i-input>
	// 	}
	// },

	{
		prop: 'level',
		label: '敏感级别',
		default: 1,
		rule: [{ required: true, message: '', trigger: 'change', type: 'integer' }],
		render(h) {
			const options = constant2Array(constant.SensitiveLevel).map(it => { return <i-option value={it.value}>{it.text}</i-option> })
			return <i-select v-model={this.model}>{options}</i-select>
		}
	}
]
