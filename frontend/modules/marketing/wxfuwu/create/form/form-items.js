export default [
	{
		prop: 'receiverPeoples',
		label: '群发对象',
		rule: { required: true, message: '请先选择发送对象', trigger: 'blur' },
		render(h) {
			return <i-input> v-model={this.model}></i-input>
		}
	},
	{
		prop: 'content',
		label: '编辑群发内容',
		rule: { required: true, message: '分享内容为必填项', trigger: 'blur' },
		render(h) {
			h = this.$root.$createElement
			const uploadType = [{ icon: 'image', label: '图片', name: 'image' }, { icon: 'android-image', label: '图文', name: 'imageText' }]
			return <share-content v-model={ this.model } uploadType={ uploadType }></share-content>
		}
	},
	{
		prop: 'sendTime',
		label: '发送时间',
		render(h) {
			return <date-picker type='datetime' placeholder='设置发送事件' style='width: 100%'></date-picker>
		}
	}
]
