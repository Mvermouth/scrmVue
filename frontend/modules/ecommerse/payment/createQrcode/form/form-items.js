
import { parseUrl } from '../../../../../scripts/utils/url'
const { query } = parseUrl(location.href, true)
const sn = query.sn
export default [
	{
		prop: 'sn',
		label: '订单编号',
		rule: { required: true, message: '请输入订单编号' },
		default: sn,
		render(h) {
			return <i-input v-model={this.model} placeholder='请输入订单编号'></i-input>
		}
	},
	// {
	// 	prop: 'title',
	// 	label: '收款标题',
	// 	rule: { required: true, message: '请输入收款标题' },
	// 	render(h) {
	// 		return <i-input v-model={this.model} placeholder='请输入收款标题'></i-input>
	// 	}
	// },
	{
		prop: 'amount',
		label: '金额',
		rule: { required: true, message: '请输入金额' },
		render(h) {
			return <i-input v-model={this.model} placeholder='请输入金额'></i-input>
		}
	},
	{
		prop: 'fix_amount',
		label: '固定金额',
		default: true,
		render(h) {
			return <i-switch v-model={this.model}></i-switch>
		}
	}
]
