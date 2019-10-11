<template>
    <div>
        <i-form :model="loginForms" label-position="top">
            <alert v-if="error.show" type="error" show-icon closable @on-close="closeAlert">{{error.msg}}</alert>
            <form-item prop="domain" v-if="enableRegister">
                <i-input v-model="loginForms.domain" placeholder="请输入域ID" size="large"></i-input>
            </form-item>
            <form-item prop="username">
                <i-input v-model="loginForms.username" placeholder="请输入手机号或用户名" size="large"></i-input>
            </form-item>
            <form-item prop="password">
                <i-input ref="loginPassword" type="password"  v-model="loginForms.password" placeholder="请输入密码" size="large"></i-input>
            </form-item>
			<form-item prop="code">
                <i-input class="graphical" v-model="loginForms.code" placeholder="请输入图形识别码" size="large">
                    <span slot="append"><img ref="Img" @click="reloadImg" src="/auth/captcha" style="width: 110px; height: 36px" alt=""/></span>
                </i-input>
            </form-item>
            <form-item>
                <checkbox v-model="saveUsername"></checkbox>记住手机号或用户名</form-item>
            <form-item>
                <i-button class="comfirm-btn" type="primary" long size="large" @click="loginSubmit" :loading="loginLoading">登&nbsp;&nbsp;录</i-button>
            </form-item>
        </i-form>
        <div v-if="enableRegister" class="bottom-btn">
            <a href="javascript:void(0);" @click="resetPassword">忘记密码?</a>
        </div>
    </div>
</template>
<script>
import Cookies from 'js-cookie'

export default {

    props: {
        enableRegister: {
            type: Boolean,
            required: false,
            default: true
        }
    },

	data() {
        let saveUsername = Cookies.get('saveUsername')
        saveUsername = saveUsername === undefined ? true : (saveUsername === 'true')

		return {
			loginForms: {
				domain: Cookies.get('domain') || '',
				username: Cookies.get('username') || '',
				password: Cookies.get('password')|| '',
				code: ''
            },
            saveUsername,
			error: {
				show: false,
				msg: ''
            },
            errorTypes: {
                domain: '请输入域ID',
				username: '请输入用户名',
				password: '请输入密码',
				code: '请输入图形验证码',
            },
			loginLoading: false // 登录loading
		}
    },

	created() {
        this.init()
        
        // 登录错误信息
        App.registerApiFailed(-3001, async response => {
            this.showError('您输入的密码和账户名不匹配，是否忘记密码或账户名')
        })

        App.registerApiFailed(-3002, async response => {
            this.showError('您输入的密码和账户名不匹配，是否忘记密码或账户名')
        })
        App.registerApiFailed(-3012, async response => {
            this.showError(response.data.msg)
		})
		
		App.registerApiFailed(-3005, async response => {
            this.showError('图形验证码错误')
        })
    },

	methods: {

		init() { 
			const domain = this.getCookie('domain')
            this.loginForms.domain = domain === 'undefined' ? '' : domain
            if(!this.enableRegister) {
                this.$delete(this.loginForms, 'domain')
            }
        },

		//刷新图形验证码
        reloadImg() {
            this.$refs.Img.src = `/auth/captcha?tm=${Math.random()}`
		},
		
		getCookie(name) {
            let arr
            const reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
            if (arr = document.cookie.match(reg))
                return unescape(arr[2])
            else
                return null
        },

		// 登录提交
		loginSubmit() { 
			if (this.loginLoading) {
				return false
            }
            
            for(let i in this.loginForms) {
                if(this.loginForms[i] === '') {
                    this.error.show = true
                    this.error.msg = this.errorTypes[i]
                    return false
                }
            }

            this.loginLoading = true
            axios.post(window.location.href, this.loginForms)
                .then(result => {
                    Cookies.set('domain', this.loginForms.domain)
                    Cookies.set('saveUsername', this.saveUsername)
                    this.saveUsername ? Cookies.set('username', this.loginForms.username) : Cookies.remove('username')
                    this.saveUsername ? Cookies.set('password', this.loginForms.password) : Cookies.remove('password')
                    this.loginLoading = false
                    result = result.data
                    window.location.href = result.data.redirect
                })
                .catch(e => {
					this.loginLoading = false
					this.reloadImg()
                })
        },

        resetPassword() {
            this.$emit('reset-password')
        },

        closeAlert() {
            this.error.show = false
            this.error.msg = ''
        },
        showError(msg) {
            this.loginLoading = false
            this.error.show = true
            this.error.msg = msg
        }  
    }
}
</script>

