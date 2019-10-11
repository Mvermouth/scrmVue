
export default [
	{
		prop: 'mixin',
		label: '分享内容',
		//rule: { required: false, message: '分享内容为必填项', trigger: 'blur' },
		render(h) {
			h = this.$root.$createElement
			//, { icon: 'ios-videocam', label: '视频', name: 'video' }
			const uploadType = [{ icon: 'image', label: '图片', name: 'image' }, { icon: 'android-image', label: '文字', name: 'Text' }]
			return <share-content ref="sharecontentwidget" v-model={ this.model } uploadType={ uploadType }></share-content>
		}
	},
	{
		prop: 'content',
		label: '朋友圈内容',
		default:"",
		rule: { required: true, message: '朋友圈内容为必填项', trigger: 'blur' },
		render(h) {
			return <limit-word-num-textarea v-model={this.model}></limit-word-num-textarea>
		}
	},
	// {
	// 	prop: 'replyText',
	// 	label: '评论',
	// 	default:"",
	// 	rule: { required: true, message: '分享文案为必填项', trigger: 'blur' },
	// 	render(h) {
	// 		return <limit-word-num-textarea v-model={ this.model }></limit-word-num-textarea>
	// 	}
	// },

	{
		prop: 'mode',
		label: '可见情况',
		default: '0',
		render(h) {
			return 	<radio-group v-model={this.model}>
				<radio label='0'>全部用户可见</radio>
				<radio label='1'>仅标签用户可见</radio>
			</radio-group>
		}
	},
	{
		prop: 'customIDs',
		label: '执行账号',
		default: '已选择5个运营号',
		rule: { required: true, message: '设备为必填项', trigger: 'blur' },
		render(h) {
			h = this.$root.$createElement
			//return 	<div>选择</div>
			return <choose v-model={ this.model } ref="choosewidget"></choose>
		}
	},
	{
		prop: 'actionTime',
		label: '发送时间',
		render(h) {
			return <date-picker  v-model={ this.model } format='yyyy-MM-dd HH:mm:ss' type='datetime' placeholder='请选择发送时间' style='width: 80%'></date-picker>
		}
	}
]
