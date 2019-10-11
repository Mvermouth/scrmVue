<template>
	<i-form  v-model="messageForm"  :rules="ruleValidate" :label-width="80"  style="padding:30px 0" :class="`${clsPrefix}func-form`">
		<form-item  label="消息名称" prop="name">
			<i-input  v-model="messageForm.name" clearable placeholder="请输入消息名称"></i-input>
		</form-item>
		<form-item label="生效时间" prop="week">
				<radio-group v-model= messageForm.week>
					<radio label='monday'>周一</radio>
					<radio label='tuesday'>周二</radio>
					<radio label='wednesday'>周三</radio>
					<radio label='thursday'>周四</radio>
					<radio label='friday'>周五</radio>
					<radio label='saturday'>周六</radio>
					<radio label='sunday'>周天</radio>
				</radio-group>
		</form-item>
			<form-item  label="发送时间" prop="time">
			<date-picker type="datetimerange" v-model= "messageForm.time" format=“yyyy-MM-dd” placeholder="选择日期" ></date-picker>
		</form-item>
		<form-item label="设置回复内容">
		<reply-content></reply-content>
		</form-item>
	</i-form>
</template>
<script>
import { datePickerShortcuts } from '../../../../../scripts/utils/misc'
import ReplyContent from '../../../autoreply/create/components/reply-content.vue'
export default {
	components: {
		ReplyContent
	},
	data() {
		return {
			clsPrefix: App.options.styles.prefix,
			num: 0,
			datePickerShortcuts: datePickerShortcuts,
			ruleValidate: {
				name: [
					{
						required: true,
						message: 'The name cannot be empty',
						trigger: 'blur'
					}
				],
				week: [
					{
						required: true,
						message: 'The name cannot be empty',
						trigger: 'blur'
					}
				],
				time: [
					{
						required: true,
						message: 'The name cannot be empty',
						trigger: 'blur'
					}
				],
				content: [
					{
						required: true,
						message: 'The name cannot be empty',
						trigger: 'blur'
					}
				]
			},
			messageForm: {
				name: '',
				week: '',
				time: '',
				content: ''
			},
			uploadType: [
				{ icon: 'document-text', label: '图文', name: 'text' },
				{ icon: 'image', label: '图片', name: 'image' },
				{ icon: 'android-image', label: '图文', name: 'imageText' },
				{ icon: 'android-image', label: '活动', name: 'activity' }
			]
		}
	},
	computed: {
		amount() {
			return this.num * 388
		}
	},
	methods: {
		submit() {}
	}
}
</script>

