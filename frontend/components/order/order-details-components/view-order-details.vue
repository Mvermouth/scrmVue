<style lang="less" scoped>
	.down-table {
		margin-top: 23px;
		padding: 10px 36px;
		height: 52px;
		background: #f5f5f5;
		border-bottom-left-radius: 2px;
		border-bottom-right-radius: 2px;
	}
</style>
<template>
	<div style="height: 600px;overflow: scroll">
		<tabs type="card" v-model="tab" @on-click="handleClickTab">
			<tab-pane v-for="(tab, index) in tabs" :key="`tab_${index}`" :label="tab.title" :name="tab.key"></tab-pane>
		</tabs>
		<div>
			<keep-alive>
				<component :is="currentTabComponent" :order="order"></component>
			</keep-alive>
		</div>
		<!-- <div>
			<Row class="down-table" type="flex" justify="center">
				<Col span="20"><Input v-model="remark" placeholder="请输入订单备注"/></Col>
				<Col span="4"><Button type="default" @click="submitRemark">提交</Button></Col>
			</Row>
    	</div> -->
	</div>
</template>
<script>
import BasicInfo from './basic-info.vue'
import PayRecord from './pay-record.vue'
import GoodsSignRecord from './goods-sign-record.vue'
import ShipInfo from './ship-info.vue'
import OrderRemark from './order-remark.vue'
import OrderAudit from './order-audit.vue'
export default {
	props: {
		order: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			tabs: [
				{
					key: 'logistics',
					title: '物流信息',
					icon: '',
					component: ShipInfo
				},
				{
					key: 'basic',
					title: '基本信息',
					icon: '',
					component: BasicInfo
				},
				{
					key: 'pay',
					title: '支付记录',
					icon: '',
					component: PayRecord
				},
				// {
				// 	key: 'goodsSign',
				// 	title: '收退货记录',
				// 	icon: '',
				// 	component: GoodsSignRecord
				// },
				{
					key: 'remark',
					title: '订单备注',
					icon: '',
					component: OrderRemark
				},
				{
					key: 'log',
					title: '订单日志',
					icon: '',
					component: OrderAudit
				}
			],
			tab: this.order.shipStatus=== "not_shipped"? 'basic':'logistics' , //当前指向的tab
			currentTabInfo: {},
			remark:''
		}
	},
	computed: {
		currentTabComponent() {
			return this.currentTabInfo.component
		}
	},
	mounted() {
		//如果传入参数先打开哪个面板，这里进行判断
		this.currentTabInfo = this.tabs.find(it => {return it.key === this.tab})
	},
	methods: {
		handleClickTab(tab) {
			this.tabs.map(it=> {
				if(tab === it.key) {
					this.currentTabInfo = it
				}
			})
		},
		async submitRemark(){
			console.log("submit remark")
		}
	}
}
</script>

