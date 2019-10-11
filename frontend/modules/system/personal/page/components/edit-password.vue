<template>
    <div>
        <i-form ref="forms" :model="forms" :rules="passwordRules" :label-width="120">
            <form-item label="旧密码" prop="oldPassword">
                <i-input type="password" v-model="forms.oldPassword"></i-input>
            </form-item>
            <form-item label="新密码" prop="newPassword">
                <i-input type="password" v-model="forms.newPassword"></i-input>
            </form-item>
            <form-item label="确认新密码" prop="checkPassword">
                <i-input type="password" v-model="forms.checkPassword"></i-input>
            </form-item>
        </i-form>
    </div>
</template>
<script>
import User from '../../../../../models/auth/user'
import { validatePassword } from '../../../../../scripts/utils/misc'

export default {
	data() {
		const validatePassCheck = (rule, value, callback) => {
			if (value !== this.forms.newPassword) {
				callback(new Error('确认新密码和新密码不一致'))
			} else {
				callback()
			}
		}
		const validatePass = (rule, value, callback) => {
            if (!validatePassword(value)) {
                callback(new Error('密码为字符/数字/特殊符号至少两者及以上的组合!'))
            } else {
                callback()
            }
        }
		return {
			forms: {
				oldPassword: '',
				newPassword: '',
				checkPassword: ''
			},
			passwordRules: {
				oldPassword: [
					{ required: true, message: '旧密码不能为空', trigger: 'blur' }
				],
				newPassword: [
					{ validator: validatePass, trigger: 'blur' }
				],
				checkPassword: [
					{ validator: validatePassCheck, trigger: 'change' }
				]

			}
		}
	},
	methods: {
		async submit(id) {
			const changePasswordParams = {
				oldPassword: this.forms.oldPassword,
				newPassword: this.forms.newPassword
			}
			const validate = await this.$refs.forms.validate()
			if (validate) {
				try {
					const result = await User.changePassword(changePasswordParams)
					return {
						code: 0,
						message: '修改密码成功'
					}
				} catch (e) {
					console.error(e)
					return {
						code: -1,
						message: '修改密码失败'
					}
				}
			} else {
				return {
					code: -1,
					message: '输入密码不一致'
				}
			}
		}
	}
}
</script>

