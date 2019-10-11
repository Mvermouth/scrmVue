<style lang="less" scoped>
    .set-domain-layout {
        max-width: 600px;
        margin: 0 auto;
        padding-top: 200px 
    }
    .set-domain-title {
        text-align: center;
        color: #000000;
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 50px
    }
</style>

<template>
    <div class="set-domain-layout">
        <div class="set-domain-title">为账户设置域</div>
        <i-form ref="domainForms" :label-width="80" :model="domainForms"  :rules="domainnValidate">
            <form-item label="设置域：" prop="domain">
                <i-input v-model="domainForms.domain" placeholder="请设置域" size="large"></i-input>
            </form-item>
            <form-item>
                <i-button type="primary" long size="large" @click="setDomain" :loading="domainLoading">确定</i-button>
            </form-item>
        </i-form>
        <div class="bottom-btn">
            <alert show-icon>
                为账户设置域
                <template slot="desc">尽量使用简洁的带有唯一标识性的字符,只能使用数字和字符组成的字符串 </template>
            </alert>
        </div>
    </div>
</template>
<script>
import Cookies from 'js-cookie'

export default {
    data() {
         
        return {
            domainForms: {
                domain: ''
            },
            domainnValidate: {
                domain: [
                    {pattern: /^[A-Za-z0-9]{6,}$/, message: '至少6个字符或者数字组成', trigger: 'blur'},
                ]
            },
            domainLoading: false
        }
    },
    methods: {
        setDomain() {
            if(this.domainForms.domian === '') {
                this.$Notice.error({title: '域不能为空'})
            }
            if (this.domainLoading) {
				return
            }
            this.$refs.domainForms.validate((valid) => { 
                if (valid) {
                    if(this.domainLoading){
                        return
                    }
                    this.domainLoading = true
                    axios.post('/auth/setDomain', {domain: this.domainForms.domain}).then(result=> {
                        this.domainLoading = false
                        result = result.data
                        if(result.code === 0) {
                            if(result.data.redirect === false){
                                this.$Notice.error({title: '域已存在'});
                            } else {
                                Cookies.set('domain', this.domainForms.domain)
                                window.location.href = result.data.redirect
                            }
                        }else {
                            this.error = result.msg
                        }
                    })
                    .catch(e=> {
                        this.domainLoading = false
                    })
                } else {
                    this.$Notice.error({title: '域不合法'});
                }
            })
        }
    }
}
</script>

