export default [
    {
		prop: 'groupName',
		label: '任务名称',
		default: '',
		rule: { required: true, message: '任务名称为必填项', trigger: 'blur' },
		render(h) {
			h = this.$root.$createElement
			return <i-input v-model={ this.model }></i-input>
		}
	},
    {
		prop: 'profilePlatformUids',
		label: '执行账号',
		default: '',
		rule: { required: true, message: '设备为必填项', trigger: 'blur' },
		render(h) {
			h = this.$root.$createElement
			//return 	<div>选择</div>
			return <choosepeople v-model={ this.model } ref="choosewidget"></choosepeople>
		}
	},
	{
		prop: 'platformTags',
		label: '执行标签',
		default: '',
		rule: { required: true, message: '标签为必填项', trigger: 'blur' },
		render(h) {
			h = this.$root.$createElement
			return <choosetags v-model={ this.model } ref="choosetagswidget"></choosetags>
		}
	},
	{
		prop: 'messages',
		label: '添加信息',
		default: '',
		rule: { required: true, message: '信息为必填项', trigger: 'blur' },
		render(h) {
			h = this.$root.$createElement
			return <wxmessage v-model={ this.model } ref="vxmessagewidget"></wxmessage>
		}
	},
	{
		prop: 'sendTime',
		label: '发送时间',
		render(h) {
			return <date-picker v-model={ this.model } format='yyyy-MM-dd HH:mm:ss' type='datetime' placeholder='设置发送时间' style='width: 100%'></date-picker>
		}
	}
]
