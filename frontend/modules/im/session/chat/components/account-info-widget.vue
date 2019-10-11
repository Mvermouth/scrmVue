<style lang="less" scoped>
    .account-widget {
        position: absolute;
        left: 55px;
        top: 0;
        width: 340px;
        height: 270px;
        padding: 40px;
        border-radius: 5px;
        background-color: #f8f8f9;
        border: 1px solid #ccc;
        box-shadow: 1px 1px 1px 1px #e9eaec;
        z-index: 10000;
        .info {
            padding-bottom: 16px;
            border-bottom: 1px solid #ccc;
            &::after {
                content: '';
                display: block;
                clear: both;
            }
            .wechat-info {
                float: left;
                .nickname {
                    font-size: 16px;
                    color: #000000;
                    margin-bottom: 10px
                }
                .wechat-account {
                    font-size: 12px;
                    color: rgba(0, 0, 0, 0.4);
                    height: 20px;
                    line-height: 20px;
                }
            }
            .avatar {
                float: right;
            }
        }
        .other-info {
            padding-top: 16px;
            div {
                height: 30px;
                line-height: 30px;
                font-size: 14px;
                span {
                    color: rgba(0, 0, 0, 0.8);
                    .name {
                        color: rgba(0, 0, 0, 0.4)
                    }
                }
            }
        }
    }
</style>

<template>
    <div class="account-widget">
        <div class="info">
            <div class="wechat-info">
                <div class="nickname"><span>{{fromContact.nickname}}</span><span :class="['gender-cion',  `gender-${fromContact.gender || 0}`]"></span></div>
                <div class="wechat-account"><span>微信号：</span>{{fromContact.customID}}</div>
                <div class="wechat-account"><span>微信ID：</span>{{fromContact.platformUid}}</div>
            </div>
            <div class="avatar">
                <im-avatar :url="fromContact.avatar" :size="60"></im-avatar>
            </div>
        </div>
        <div class="other-info">
            <div class="region">
                <span><span class="name">归属员工：</span>{{employee}}</span>
            </div>
            <div class="sign">
                <span><span class="name">归属部门：</span>{{departments}}</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        fromContact: {
            type: Object,
            required: true
        }
    },
    computed: {
        employee() {
            if(this.fromContact.employee && this.fromContact.employee.name) {
                return `${this.fromContact.employee.name}(${this.fromContact.employee.sn})`
            }
            return ''
        },
        departments() {
            if(this.fromContact.employee && this.fromContact.employee.departments && this.fromContact.employee.departments.length > 0) {
                const department = this.fromContact.employee.departments.map( it => {
                    return it.name
                })
                return department.join('、')
            }
            return ''
        }
    }
}
</script>

