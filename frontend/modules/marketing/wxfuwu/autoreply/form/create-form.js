import { datePickerShortcuts } from '../../../../../scripts/utils/misc'
export default [
	{
		prop: 'name',
		label: '消息名称',
		rule: { required: true, message: '消息名称为必填项', trigger: 'change' },
		render(h) {
			return <i-input v-model={this.model}></i-input>
		}
	},
	{
		prop: 'week',
		label: '生效时间',
		default: 'random',
		rule: { required: true, trigger: 'change' },
		render(h) {
			return <radio-group v-model={this.model}>
				<radio label='monday'>周一</radio>
				<radio label='tuesday'>周二</radio>
				<radio label='wednesday'>周三</radio>
				<radio label='thursday'>周四</radio>
				<radio label='friday'>周五</radio>
				<radio label='saturday'>周六</radio>
				<radio label='sunday'>周天</radio>
			</radio-group>
		}
	},
	{
		prop: 'time',
		label: '时间',
		default: 'random',
		rule: { required: true, trigger: 'change' },

		render(h) {
			return <date-picker type='datetimerange' v-model={this.model} format='yyyy-MM-dd' style={{ width: '100%' }} options={{ shortcuts: datePickerShortcuts() }} placeholder='选择日期' ></date-picker>
		}

	},
	{
		prop: 'content',
		label: '设置回复内容',
		rule: { required: true, message: '回复内容为必填项', trigger: 'blur' },
		render(h) {
			h = this.$createElement
			const uploadType = [{ icon: 'image', label: '图片', name: 'image' }, { icon: 'android-image', label: '图文', name: 'imageText' }, { icon: '', label: '活动', name: 'activity' }, { icon: 'ios-videocam', label: '短视频', name: 'shortVideo' }, { icon: 'link', label: '外链接', name: 'link' }]
			return <share-content v-model={this.model} uploadType={uploadType}></share-content>
		}
	}
]
