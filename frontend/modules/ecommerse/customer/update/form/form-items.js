import areaData from '../../../../../configs/wxaddress.json'

export default [
	{
		prop: 'realname',
		label: '真实姓名',
		rule: { required: false, message: '真实姓名' },
		render(h) {
			return <i-input v-model={this.model} placeholder='请输入真实姓名'></i-input>
		}
	},
	{
		prop: 'mobile',
		label: '手机号',
		rule: { required: false, message: '手机号' },
		render(h) {
			return <i-input v-model={this.model} placeholder='请输入手机号'></i-input>
		}
	},
	{
		prop: 'gender',
		label: '性别',
		rule: { required: false, message: '请选择性别' },
		render(h) {
			return <radio-group v-model={this.model}><radio label='male'>男</radio><radio label='female'>女</radio></radio-group>
		}
	},
	{
		prop: 'birthday',
		label: '出生日期',
		rule: { required: false, message: '清选择日期' },
		render(h) {
			return <date-picker v-model={this.model} type='date' placeholder='清选择出生日期'></date-picker>
		}
	},

	{
		prop: 'addr',
		label: '省市区',
		rule: { required: false, message: '请选择省市区' },
		render(h) {
			return <cascader data={areaData} v-model={this.model} placeholder='请选择省市区'></cascader>
		}
	},
	{
		prop: 'position',
		label: '职业',
		rule: { required: false, message: '请填写职业' },
		render(h) {
			return <i-input v-model={this.model} placeholder='请填写职业'></i-input>
		}
	}
]
