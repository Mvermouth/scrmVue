<style lang="less" scoped>
    .text {
        color: rgba(0, 0, 0, 0.5);
    }
    .red {
        color: red
    }
</style>

<template>
    <Card>
        <p slot="title">
            <i class="fas fa-user"></i>
            个人中心
        </p>
        <i-form :label-width="100">
            <form-item label="用户名：">
                 <span class="text">{{user.username}}</span>
            </form-item>
            <form-item label="手机：">
                 <span class="text">{{user.phone}}</span>
            </form-item>
            <form-item label="姓名：">
                 <span class="text">{{(user.employee && user.employee.name) || ''}}</span>
            </form-item>
            <form-item label="工号：">
                 <span class="text">{{(user.employee && user.employee.sn) || ''}}</span>
            </form-item>
            <form-item label="部门：">
                 <span class="text">{{departments}}</span>
            </form-item>
            <form-item label="状态：">
                 <span :class="['text', {'red': user.employee && user.employee.status==='NONDUTY'}]">{{ status }}</span>
            </form-item>
            <form-item label="登录密码：">
                <Button type="primary" @click="editPassword">修改密码</Button>
            </form-item>
        </i-form>
    </Card>
</template>
<script>
// 数据预处理
const user = App.data.domain || {}
import Constant from '../../../../configs/constant'
import { value2Text } from '../../../../scripts/utils/misc'
import EditPassword from './components/edit-password.vue'
export default {
	components: {
		EditPassword
	},
	data() {
		return {
			// 用户信息
			user,
			status: value2Text(Constant.EmployeeStatus, user.employee && user.employee.status),
			departments: user.employee && user.employee.departments && user.employee.departments.join(',')
		}
	},
	methods: {
		// 修改密码
		editPassword() {
			App.modal({
				title: '修改密码',
				width: 'small',
				loading: true,
				render: (h) => {
					h = this.$createElement
					return <edit-password></edit-password>
				},
				onOk: async(comp, modal) => {
                    try {
                        const result = await comp.submit()
						this.$Notice.success({ title: result.message})
						if (result.code === -1) {
							modal.cancelLoading()
							return
						}
						App.removeModal()
                    } catch (e) {
                        modal.cancelLoading()
                    }
				}
			})
		}
	}
}
</script>

