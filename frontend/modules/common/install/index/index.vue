<style scoped>
.guide-wrap {
    min-height: 250px;
    margin-top: 40px;
}
.loading {
    margin: 0 auto;
    width: 32px;
}
.confirm {
    margin-top: 20px;
}
</style>

<template>
<div class="main-page">
    <row class="main-content">
        <i-col span="16" offset="4">
            <Card>
                <p slot="title">{{title}} - 安装向导</p>
                <div>
                    <Steps :current="step">
                        <Step title="创建商户"></Step>
                        <Step title="创建商户管理员"></Step>
                        <Step title="安装"></Step>
                        <Step title="成功"></Step>
                    </Steps>

                    <div class="guide-wrap">
                        <row v-show="step === 0">
                            <i-col span="16" offset="4">
                                <i-form ref="merchantForm" :model="form.merchant">
                                    <form-item prop="name" :show-message="false">
                                        <i-input v-model="form.merchant.name" placeholder="请输入商户名称"></i-input>
                                    </form-item>
                                    <form-item prop="contactName" :show-message="false">
                                        <i-input v-model="form.merchant.contactName" placeholder="请输入联系人姓名"></i-input>
                                    </form-item>
                                    <form-item prop="contactMobile" :show-message="false">
                                        <i-input v-model="form.merchant.contactMobile" placeholder="请输入联系人手机号"></i-input>
                                    </form-item>
                                    <form-item prop="contactEmail" :show-message="false">
                                        <i-input v-model="form.merchant.contactEmail" placeholder="请输入联系人邮箱"></i-input>
                                    </form-item>
                                    <form-item class="confirm">
                                        <i-button size="large" type="success" @click="onNextStep" long>下一步</i-button>
                                    </form-item>
                                </i-form>
                            </i-col>
                        </row>
                        <row v-show="step === 1">
                            <i-col span="16" offset="4">
                                <i-form ref="userForm" :model="form.user">
                                    <form-item prop="username" :show-message="false">
                                        <i-input v-model="form.user.username" placeholder="请输入用户名"></i-input>
                                    </form-item>
                                    <form-item prop="password" :show-message="false">
                                        <i-input v-model="form.user.password" type="password" placeholder="请输入密码"></i-input>
                                    </form-item>
                                    <form-item prop="confirmPassword" :show-message="false">
                                        <i-input v-model="form.user.confirmPassword" type="password" placeholder="请确认密码"></i-input>
                                    </form-item>
                                    <form-item class="confirm">
                                        <i-button size="large" type="success" @click="onNextStep" long>下一步</i-button>
                                    </form-item>
                                </i-form>
                            </i-col>
                        </row>
                        <row v-show="step === 2">
                            <i-col span="16" offset="4">
                                <div class="loading">
                                    <spin v-if="loading" size="large"></spin>
                                </div>
                                <Alert v-if="errorMsg" type="error" show-icon>
                                    {{errorMsg}}
                                    <span slot="desc">
                                        {{errorDesc}}
                                    </span>
                                </Alert>
                            </i-col>
                        </row>
                        <row v-show="step === 3">
                            <i-col span="16" offset="4">
                                <i-button size="large" type="success" @click="onLogin" long>立即登录</i-button>
                            </i-col>
                        </row>
                    </div>
                </div>
            </Card>
        </i-col>
    </row>
</div>
</template>
<script>
import axios from 'axios'
import _ from 'lodash'
import { isMobile, isEmail } from '../../../../scripts/utils/misc'

export default {

    data() {
        return {
            step: 0,
            form: {
                merchant: {
                    name: '',
                    contactName: '',
                    contactMobile: '',
                    contactEmail: ''
                },
                user: {
                    username: '',
                    password: '',
                    confirmPassword: ''
                }
            },
            loading: false,
            errorMsg: '',
            errorDesc: '',
            title: App.data.site.title,
            copyright: App.data.site.copyright
        }
    },

    methods: {

        onNextStep() {
            switch(this.step) {
                case 0: {
                    this.setMerchant()
                    break
                }
                case 1: {
                    this.setUser()
                    break
                }
            }
        },

        setMerchant() {
            const merchant = this.form.merchant
            if (!merchant.name.trim()) {
                this.$Notice.error({title: '请填写商户名称'})
                return
            }
            if (!merchant.contactName.trim()) {
                this.$Notice.error({title: '请填写商户联系人'})
                return
            }
            if (!merchant.contactMobile.trim()) {
                this.$Notice.error({title: '请填写商户联系人手机号'})
                return
            }
            if (!isMobile(merchant.contactMobile)) {
                this.$Notice.error({title: '请填写正确的手机号'})
                return
            }
            if (merchant.contactEmail) {
                if (!isEmail(merchant.contactEmail)) {
                    this.$Notice.error({title: '请填写正确的邮箱地址'})
                    return
                }
            }
            this.step++
        },

        setUser() {
            const user = this.form.user
            if (!user.username.trim()) {
                this.$Notice.error({title: '请填写用户名'})
                return
            }
            if (!user.password.trim()) {
                this.$Notice.error({title: '请填写密码'})
                return
            }
            if (!user.confirmPassword.trim()) {
                this.$Notice.error({title: '请填写确认密码'})
                return
            }
            if (user.password !== user.confirmPassword) {
                this.$Notice.error({title: '确认密码不一致'})
                return
            }
            this.step++

            this.install()
        },

        install() {
            this.loading = true

            const data = _.cloneDeep(this.form)
            delete data.user.confirmPassword

            axios.post(window.location.href, data)
            //axios.post("http://127.0.0.1:5201/auth/user/create", data)
                .then(result => {debugger;
                    this.loading = false
                    this.step++

                    result = result.data
                    this.errorMsg = `安装失败，错误码: ${result.code}`
                    this.errorDesc = result.msg
                })
                .catch(e => {debugger;
                    this.step++
                    this.loading = false
                    this.errorMsg = '安装失败'
                    this.errorDesc = e.message
                })
        },

        onLogin() {
            window.location.href = '/'
        }
    }
}
</script>

