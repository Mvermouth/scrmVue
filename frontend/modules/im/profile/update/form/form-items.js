import Employee from '../../../../../models/erp/employee'
export default [
	{
		prop: 'employeeId',
		label: '归属员工',
		rule: { required: false, message: '请输入归属员工' },
		render(h) {
			const defaultOptions = this.$root.defaultOptions
			const loadOptions = async value => {
				if (!value) return []
				const ps = [
					Employee.search(1, 20, [{ filterType: 'LIKE', property: 'sn', value: value }, { filterType: 'EQ', property: 'deleted', value: false }], [], true),
					Employee.search(1, 20, [{ filterType: 'LIKE', property: 'name', value: value }, { filterType: 'EQ', property: 'deleted', value: false }], [], true)
				]
				const results = await Promise.all(ps)
				const content = _.unionWith(results[0].content, results[1].content, _.isEqual)
				return content.map(it => { return { value: it.id, label: `${it.sn}(${it.name})` } })
			}
			return <remote-select v-model = {this.model} load-options={loadOptions} defaultOptions = {defaultOptions} placeholder='请输入工号和姓名'></remote-select>
		}
	},
	{
		prop: 'tags',
		label: '标签',
		default: [],
		rule: { required: false, message: '请填写标签' },
		render(h) {
			h = this.$root.$createElement
			return <tags-input v-model={this.model} btnName='添加标签'></tags-input>
		}
	},
	{
		prop: 'registeredDate',
		label: '注册时间',
		rule: { required: false, message: '请填写运营号的注册时间' },
		transform(value) {
			if (value) {
				console.log('value:', value)
				return dateformat(value, 'yyyy-mm-dd')
			}
			return null
		},
		render(h) {
			return <date-picker v-model={this.model} placeholder='请选择时间' type='date' format='yyyy/MM/dd'></date-picker>
		}
	},
	{
		prop: 'autoApprovedFriend',
		label: '自动通过好友',
		rule: { required: false, message: '是否自动通过好友' },
		render(h) {
			return <i-switch v-model={this.model}></i-switch>
		}
	},
	{
		prop: 'banned',
		label: '是否被封',
		rule: { required: false, message: '是否被封' },
		render(h) {
			return <i-switch v-model={this.model}></i-switch>
		}
	},

	{
		prop: 'paymentPassword',
		label: '支付密码',
		rule: { required: false, message: '请填写支付密码' },
		render(h) {
			return <i-input v-model={this.model} placeholder='请填写标签'></i-input>
		}
	},

	{
		prop: 'loginPassword',
		label: '登录密码',
		rule: { required: false, message: '请填写登录密码' },
		render(h) {
			return <i-input v-model={this.model} placeholder='请填写登录密码'></i-input>
		}
	},

	{
		prop: 'bankName',
		label: '银行名称',
		rule: { required: false, message: '请填写银行名称' },
		render(h) {
			return <i-input v-model={this.model} placeholder='请填写银行名称'></i-input>
		}
	},

	{
		prop: 'bankCardNo',
		label: '银行卡号',
		rule: { required: false, message: '请填写标签' },
		render(h) {
			return <i-input v-model={this.model} placeholder='请填写银行卡号'></i-input>
		}
	},

	{
		prop: 'bankCardAccount',
		label: '银行卡账户名',
		rule: { required: false, message: '请填写银行卡账户名' },
		render(h) {
			return <i-input v-model={this.model} placeholder='请填写银行卡账户名'></i-input>
		}
	},

	{
		prop: 'bankBindMobile',
		label: '银行卡预留手机号',
		rule: { required: false, message: '请填写预留手机号' },
		render(h) {
			return <i-input v-model={this.model} placeholder='请填写预留手机号'></i-input>
		}
	},
	{
		prop: 'idCardName',
		label: '身份证姓名',
		rule: { required: false, message: '请填写身份证姓名' },
		render(h) {
			return <i-input v-model={this.model} placeholder='请填写身份证姓名'></i-input>
		}
	},

	{
		prop: 'idCardNo',
		label: '身份证号',
		rule: { required: false, message: '请填写身份证号' },
		render(h) {
			return <i-input v-model={this.model} placeholder='请填写身份证号'></i-input>
		}
	},
	{
		prop: 'remark',
		label: '备注',
		rule: { required: false, message: '请填写备注' },
		render(h) {
			return <i-input v-model={this.model} type='textarea' autosize={true} placeholder='请填写备注'></i-input>
		}
	}
]
