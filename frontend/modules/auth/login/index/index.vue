<template>
    <div class="login-body">
        <div class="login-layout">
            <row>
                <i-col :xs="{ span: 20, offset: 2 }" :sm="{ span: 16, offset: 4 }"  :md="{ span: 10, offset: 2 }" :lg="{ span: 11, offset: 2}">
                    <p class="h1">欢迎使用{{site.title}}系统</p>
                    <p class="h2">新零售社交平台-{{site.title}}</p>
                    <div class="left-bg">
                        <img src="./images/login-bg.png" alt="login-bg"/>
                    </div>
                </i-col>
                <i-col :xs="{ span: 20, offset: 2 }" :sm="{ span: 16, offset: 4}"  :md="{ span: 9, offset: 1}" :lg="{ span: 8,  offset: 1}">
                    <card class="login-wrapper">
                        <div slot="title" class="header">
                            <div class="logo-icon" v-if="site.logo_small"><img :src="site.logo_small"/></div>
                            <p class="title">{{site.title}}系统</p>
                        </div>
                        <tabs v-show="type==='login'" :animated="false" v-model="type_login">
                            <tab-pane label="用户登录" name="login">
                                <login v-if="type_login==='login'" :enableRegister="enableRegister" @reset-password="resetPassword"></login>
                            </tab-pane>
                            <tab-pane v-if="enableRegister" label="用户注册" name="register">
                                <register v-if="type_login==='register'"></register>
                            </tab-pane>
                        </tabs>
                        <tabs v-show="type==='resetPassword' && enableRegister" :animated="false">
                            <tab-pane label="重置密码" name="resetPassword">
                                <reset-password v-if="type==='resetPassword'" :enableRegister="enableRegister" @reset-password-to-login="resetPasswordToLogin"></reset-password>
                            </tab-pane>
                        </tabs>
                    </card>    
                </i-col>
            </row>
            <p class="copy-right">{{site.copyright}}</p>
        </div>
    </div>
</template>
<script>
import login from './component/login.vue'
import register from './component/register.vue'
import resetPassword from './component/reset-password.vue'
const enableRegister = AppData.enableRegister
const site = AppData.site

 

export default {
    components: {
        login,
        register,
        resetPassword
    },
    data() {
        return {
            site,
            type: 'login', //切换重置密码
            type_login: 'login', //切换登录和注册 
            enableRegister: enableRegister //是否可以注册
        }
    },
    methods: {
        resetPassword() {
            this.type = 'resetPassword'
        },
        resetPasswordToLogin() {
            this.type = 'login'
        },
        //控制密码是否显示
        switchState(element) {
            if(this.$refs[element].type === 'password') {
                this.$refs[element].type = 'text'
                this.$refs[element].icon = 'eye'
            }
            if(this.$refs[element].type === 'text') {
                this.$refs[element].type = 'password'
                this.$refs[element].icon = 'eye-disabled'
            }
        }
    }
}
</script>

