<template>
    <tabs :value="addMethod">
        <tab-pane label="自主添加" name="bindBySelf">
            <i-form class="form" ref="forms" label-position="top" :model="forms">
                <form-item label="绑定方式一：设备唯一识别码">
                    <p :class="`${clsPrefix}tips`">Android: 手机拨号界面输入*#06#即可查看IMEI号，若手机有多个IMEI号则填第一个<br/>iOS: 请输入设备的UDID码, <a href="#" target="_blank">如何获取UDID码</a></p>
                    <i-input v-model="forms.UDID" placeholder="请输入设备唯一识别码"></i-input>
                </form-item>
                <form-item label="绑定方式二：手机扫码绑定">
                    <div :class="`${clsPrefix}center`"><img width="300" height="300" src="/dms/device/create_qrcode" alt=""></div>
                </form-item>
            </i-form>
        </tab-pane>
        <tab-pane label="客服添加" name="bindBycustomerService">
            <Alert show-icon>
                添加说明
                <span slot="desc">1）系统所使用的手机需要先进行必要的配置，联系客服可以直接购买已经配置好的手机，并绑定到您的账号下 </span>
            </Alert>
            <div :class="`${clsPrefix}center`" style="textAlign: center"><i-button  @click="routerToQQ" type="primary" size="large">联系客服,已购买</i-button></div>
        </tab-pane>
    </tabs>
</template>

<script>
import Device from '../../../../../models/dms/device'
export default {
    data() {
        return {
            addMethod: 'bindBySelf',
            clsPrefix: App.options.styles.prefix,
            forms: {
                UDID: ''
            }
        }
    },
    watch: {
       addMethod(val) {
           console.log(val)
       } 
    },
    methods: {
        async submit() {
            if(this.forms.UDID === '') {
                this.$Notice.error({title: 'UDID不能为空'})
                return false
            }
            const UDID = this.forms.UDID
            const result = await Device.bind(UDID)
            this.$Notice.success({title: '手机绑定成功'})
        },
        routerToQQ() {
            window.open('http://wpa.qq.com/msgrd?v=3&uin=1450612626&site=qq&menu=yes')
        }
    }
}
</script>

