<template>
    <i-form :model="forms" :rules="rules" :label-width="120" style="padding-top: 20px">
		<form-item label="选择运营号">
			
		</form-item>
		<form-item label="消息名称">
			<i-input v-model="forms.messageName" placeholder="请输入消息名称"></i-input>
		</form-item>
		<form-item label="回复方式">
			<radio-group v-model="forms.methods">
				<radio label="random">随机回复</radio>
				<radio label="all">全部回复</radio>
			</radio-group>
		</form-item>
		<form-item label="设置回复内容">
			<reply-content></reply-content>
		</form-item>
	</i-form>
</template>
<script>
import ProfileColumns from '../table/profile-columns'
import Profile from '../../../../../models/marketing/profile'
import ReplyContent from './reply-content.vue'
export default {
	components: {
		ReplyContent
	},
	data() {
		return {
			clsPrefix: App.options.styles.prefix,
			forms: {
				messageName: '',
				methods: 'random'
			},
			rules: {
				messageName: [
                        { required: true, message: 'The messageName cannot be empty', trigger: 'blur' }
                    ],
			},
			profileProps: {
				selection: true,
                domain: Profile,
				columns: ProfileColumns,
            }
		}
	},
	computed: {
		
	},
	methods: {
		
	}
}
</script>

