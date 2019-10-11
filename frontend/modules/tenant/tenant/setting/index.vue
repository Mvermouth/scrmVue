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
        <Button @click="syncTenant">同步租户</Button>
        <Button @click="syncVirtualDevice">同步虚拟设备</Button>
    </Card>
</template>
<script>
// 数据预处理
import Tenant from'../../../../models/tenant/tenant'
export default {
	data() {
		return {
		}
	},
	methods: {
		// 同步租户
        async syncTenant(){
            console.log("同步租户:")
            await Tenant.syncTenant()
            this.$Notice.success({title:"同步租户成功"})

        },
        async syncVirtualDevice(){
            console.log("同步虚拟设备:")
            await Tenant.syncVirtualDevice()
            this.$Notice.success({title:"同步虚拟设备成功"})
        }
	}
}
</script>

