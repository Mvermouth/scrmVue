<template>
	<div style="height: 600px;overflow: scroll">
		<tabs type="card" v-model="tab" @on-click="handleClickTab">
			<tab-pane v-for="(tab, index) in tabs" :key="`tab_${index}`" :label="tab.title" :name="tab.key"></tab-pane>
		</tabs>
		<div>
			<keep-alive>
				<component :is="currentTabComponent" :order="currentTabInfo.props"></component>
			</keep-alive>
		</div>
	</div>
</template>
<script>
import RefundInfo from './refund-info.vue'
import ConsultRecord from './consult-record.vue'
import Order from '../../../models/ecommerse/order'
export default {
	props: {
		refundOrder: {
			type: Object,
			required: true
		}
	},
	data() {
		
		return {
			orderInfo: {},
			tabs: [
				{
					key: 'refundInfo',
					title: '退款信息',
					icon: '',
					component: RefundInfo,
					props: this.refundOrder
				},

			],
			tab: 'refundInfo', //当前指向的tab
			currentTabInfo: {}
		}
	},
	computed: {
		currentTabComponent() {
			return this.currentTabInfo.component
		}
	},
	
	async mounted() {
		//如果传入参数先打开哪个面板，这里进行判断
		this.currentTabInfo = this.tabs[0]
		const order = await Order.page(1, 1, [{ property: 'id', value: this.refundOrder.orderId, filterType: 'EQ' }], [])
		this.orderInfo = order.content[0]
	},
	methods: {
		handleClickTab(tab) {
			this.tabs.map(it=> {
				if(tab === it.key) {
					this.currentTabInfo = it
				}
			})
		}
	}
}
</script>

