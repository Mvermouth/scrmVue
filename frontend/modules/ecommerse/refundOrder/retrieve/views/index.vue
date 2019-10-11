<style lang="less" scoped>
	.refund-wrapper {
    min-height: 700px;
    border-left: 1px solid #dcdcdc;
    border-right: 1px solid #dcdcdc;
	border-bottom: 1px solid #dcdcdc;
	padding: 20px;
	background: #fff;
	overflow-y: hidden;
	.ope-btn {
		text-align: center;
		border-radius: 2px;
		margin-right: 10px;
	}
	.timeline-time{
        font-size: 16px;
        font-weight: bold;
	}
	.timeline-content{
		margin-top: 3px;
        padding-left: 5px;
    }
}
</style>

<template>
	<div>
		<div class="refund-wrapper">
			<Row type="flex">
				<Col span="16">
					<Card class="mb1f">
						<p slot="title"><span>客户信息</span></p>
						<relation-info v-if="relation.id" :relation="relation"></relation-info>
						
					</Card>
					<Card class="mb1f">
						<p slot="title"><span>地址信息</span></p>
						<p class="dpib pr0_5f pl0_5f c-bg-info br-sm" >
							<span class="dpib w5f ellipsis vb">{{address.consignee}}</span>
							<span class="dpib w8f">{{address.mobile}}</span>
							<span class="dpib w25f ellipsis vb">{{[address.country, address.state, address.city, address.district, address.address].filter(it => !!it).join(', ')}}</span>
						</p>
					</Card>
					<Card class="mb1f">
						<p slot="title"><span>退款信息</span></p>
						<refund-info  :order="refundOrder"></refund-info>
					</Card>
				</Col>
				<Col span="8" style="padding-left:30px">
					<div>
						<Button v-for="item in actions" type="primary" class="ope-btn" @click="operateRefundOrder(item.action)">{{item.text}}</Button>
					</div>
					<div style="margin-top:30px">
						<Timeline>
							<TimelineItem v-for="item in timelines" :color="item.color">
								<p class="timeline-time">{{item.date}}</p>
            					<p class="timeline-content">{{item.text}}</p>
							</TimelineItem>
    					</Timeline>
					</div>	
				</Col>
			</Row>	
		</div>

	</div>

</template>
<script>
import RefundInfo from '../../../../../components/order/refund-details-components/refund-info.vue'
import RelationInfo from '../../../order/create/components/relation-info.vue'
import RefundOrder from '../../../../../models/ecommerse/refundOrder';
import Order from '../../../../../models/ecommerse/order'
import Address from '../../../../../models/ecommerse/address'
import Relation from '../../../../../models/im/relation'
export default {
	components: {
		RefundInfo,
		RelationInfo
	},
	props: {
		refundOrder: {
			type: Object,
			required: true
		}
	},

	data() {
		return {
			operations: [],
			relation: Relation.defaults(),
			address:Address.defaults(),
		}
	},
	async mounted(){
		await this.initData()
		await this.fetchRelation()
	},
	computed:{
		
		actions() {
			const type = this.refundOrder.type
			const actions = this.refundOrder.orderActions ? this.refundOrder.orderActions.map(it =>{
				const action = {
					action: it
				}
				let text = ''
				if(it ==='confirm'){
					text = '审核通过'
				}
				else if(it === 'unconfirm'){
					text = '审核不通过'
				}
				else if(it === 'refund'){
					text = '退款完成'
				}
				else {
					text = '拒绝退款'
				}
				action.text = text
				return action
			})
			: [];
			return actions
		},
		timelines(){
			const timelines = this.operations.map(it =>{
				return {
					date: dateformat(new Date(it.ctime),'yyyy-mm-dd HH:MM:ss'),
					color:'green',
					text: it.description||''
				}
			})
			return timelines
		}
	},
	methods: {
		async operateRefundOrder(action){
			let content = ""
			if(action ==='confirm'){
				content = "确认审核通过?"
			}
			else if(action ==='unconfirm'){
				content = "确认审核不通过?" 
			}
			else if(action ==='refund'){
				content = "确认退款已完成？"
			}
			else if(action ==='unrefund'){
				content = "确认拒绝该退款？"
			}
			App.modal({
				width: 400,
				title: '提示',
				render: h => {
					h = this.$root.$createElement
					return <refund-order-transform content={content} action={action} refundOrder={this.refundOrder}></refund-order-transform>
				},
				onOk: async(refundOrderTransform) => {
					await refundOrderTransform.submit()
					await this.refresh()
				}
			})
		},
		async fetchRelation(){
			const order = await Order.retrieve(this.refundOrder.orderId)
			// console.log(order, this.refundOrder);
			if(order.metadata.relationId){
				const filter = [
					{ property: 'id', filterType: 'EQ', value: order.metadata.relationId }
				]
				const page = await Relation.page(1, 1, filter, [])
				this.relation = page.content[0] 
			}
			else {

			}

			if(order.metadata.addressId){
				const address = await Address.retrieve(order.metadata.addressId)
				this.address = address
			}
			else {
				this.address = order.address;
			}
		},

		async initData(){
			const operations = await Order.operations(this.refundOrder.id)
			const sortOperations = _.reverse(_.sortBy(operations,['ctime']))
			this.operations = sortOperations
		},
		async refresh(){
			const refundOrderPage = await RefundOrder.page(1,1,[{filterType:'EQ',property:'id',value:this.refundOrder.id}],[])
			if(!_.isEmpty(refundOrderPage.content)){
				this.refundOrder = refundOrderPage.content[0]
			}
			const operations = await Order.operations(this.refundOrder.id)
			const sortOperations = _.reverse(_.sortBy(operations,['ctime']))
			this.operations = sortOperations
		}
	}
}
</script>
