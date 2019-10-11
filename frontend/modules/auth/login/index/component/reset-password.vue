<template>
    <div>
        <i-form :model="resetPasswordForms" label-position="top" :rules="resetPasswordFormsRule">
            <alert v-if="error.show" type="error" show-icon closable @on-close="closeAlert">{{error.msg}}</alert>
            <form-item prop="domain" v-if="enableRegister">
                <i-input v-model="resetPasswordForms.domain" placeholder="请输入域ID" size="large"></i-input>
            </form-item>
            <form-item prop="mobile">
                <i-input v-model="resetPasswordForms.mobile" size="large" placeholder="请输入手机号"></i-input>
            </form-item>
            <form-item prop="captcha">
                <i-input class="graphical" v-model="resetPasswordForms.captcha" placeholder="请输入图形识别码" size="large">
                    <span slot="append"><img ref="Img" @click="reloadImg" src="/auth/captcha" style="width: 110px; height: 36px" alt=""/></span>
                </i-input>
            </form-item>
            <form-item prop="code">
                <i-input :class="['code', {'prohibit': wait !== 0}]" v-model="resetPasswordForms.code" placeholder="请输入手机验证码" size="large">
                    <i-button type="primary" slot="append"  @click="smsCode" style="width: 110px; font-size: 14px;">{{wait === 0 ? `获取验证码` : `重新发送(${wait}s)`}}</i-button>
                </i-input>
            </form-item>
            <form-item prop="password">
                <i-input type="password" v-model="resetPasswordForms.password" size="large" placeholder="请输入新密码"></i-input>
            </form-item>
            <form-item>
                <i-button class="comfirm-btn" type="primary" long size="large" :loading="resetPasswordLoading" @click="resetPasswordSubmit">确&nbsp;&nbsp;认</i-button>
            </form-item>
        </i-form>
        <div class="bottom-btn">
            <a href="javascript:void(0);" @click="resetPasswordToLogin" >直接登录</a>
        </div>
    </div>
</template>
<script>
import Cookies from 'js-cookie'
import {validatePassword,isMobile} from '../../../../../scripts/utils/misc'
export default {
    props: {
        enableRegister: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    data() {
        const validatePass = (rule, value, callback) => {
            if (!validatePassword(value)) {
                callback(new Error('密码为字符/数字/特殊符号至少两者及以上的组合!'));
            } else {
                callback();
            }
        }
        const validateMobile = (rule, value, callback) => {
            if (!isMobile(value)) {
                callback(new Error('请输入正确的手机号!'));
            } else {
                callback();
            }
        }
        return {
            resetPasswordForms: {
                domain: Cookies.get('domain') || '',
                mobile: '',
                captcha: '',
                code: '',
                password: ''
            },
            errorTypes: {
                domain: '请输入域ID',
                mobile: '请输入手机号',
                captcha: '请输入图形验证码',
                code: '请输入手机验证码',
                password: '请输入新密码'
            },
            error: {
				show: false,
				msg: ''
            },
            //重置密码的手机号是否被通过
            isMobile: false,
            //重置密码等待60s重新发送
            wait: 0,
            resetPasswordFormsRule:{
                password: [{ validator: validatePass, trigger: 'blur' }],
                mobile: [{ validator: validateMobile, trigger: 'blur' }]
            },
            resetPasswordLoading: false //重置密码loading
        }
    },
    mounted() {
        //图形验证码错误
        App.registerApiFailed(-3005, async response => {
            this.error.show = true
            this.error.msg = response.data.msg
        })
    },
    methods: {
        //刷新图形验证码
        reloadImg() {
            this.$refs.Img.src = `/auth/captcha?tm=${Math.random()}`
        },
        resetPasswordToLogin() {
            this.$emit('reset-password-to-login')
        },
        //重置密码
        
        //获取手机验证码
        async smsCode() {
            const reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/ 
            if(this.resetPasswordForms.mobile === '' || !reg.test(this.resetPasswordForms.mobile)) {
                this.error.show = true
                this.error.msg = '请输入正确的手机号码'
                return false
            }
            if(this.resetPasswordForms.captcha === '') {
                this.error.show = true
                this.error.msg = '请输入图形验证码'
                return false
            }
            this.error.show = false
            const data = await axios.get('/auth/mobileCode', {params:{mobile: this.resetPasswordForms.mobile, captcha: this.resetPasswordForms.captcha}})
            this.wait = 60
            this.settime()
        },
         //注册倒计时60s
       settime() {
            if (this.wait === 0) {
                return false;
            } else {
                this.wait--;
            }
            setTimeout(()=>{this.settime()}, 1000)
        },
        //确认修改密码
        resetPasswordSubmit() {
            if(this.resetPasswordLoading) {
                return
            }
            for(let i in this.resetPasswordForms) {
               if(this.resetPasswordForms[i] === '') {
                    this.error.show = true
                    this.error.msg = this.errorTypes[i]
                    return false
               }
            }
            this.error.show = false
            this.resetPasswordLoading = true
            axios.post('/auth/resetPassword', this.resetPasswordForms).then(result => {
                this.resetPasswordLoading = false
                this.$Notice.success({title: '重置密码成功'})
                this.$emit('reset-password-to-login')
            })
            .catch(e => {
                this.resetPasswordLoading = false
            })
        },
        closeAlert() {
            this.error.show = false
            this.error.msg = ''
        }    
    }
}
</script>

