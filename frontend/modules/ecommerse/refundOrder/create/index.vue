<style lang="less" scoped>
	.submit-btn {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 50px;
		padding-top: 10px;
		background: #f5f5f5;
		z-index: 10000
	}
</style>
<template>
	<div>
		<card v-if="relation.id">
			<p slot="title"><span>客户信息</span></p>
			<relation-info v-if="relation.id" :relation="relation"></relation-info>
		</card>
		<card>
			<p slot="title"><span>地址信息</span></p>
			<p class="dpib pr0_5f pl0_5f c-bg-info br-sm">
				<span class="dpib w5f ellipsis vb">{{address.consignee}}</span>
				<span class="dpib w8f">{{address.mobile}}</span>
				<span class="dpib w25f ellipsis vb">{{[address.country, address.state, address.city, address.district, address.address].filter(it => !!it).join(', ')}}</span>
			</p>
		</card>
		<card style="margin-top: 30px;">
			<p slot="title">售后</p>
			<i-form ref="refundForms" v-model="refundForms" :rules="ruleValidate" :label-width="100">
				<form-item label="申请服务">
					<p>{{refundTypes[type]}}</p>
				</form-item>
				<div>
					<tabs value="product_info">
						<tab-pane label="商品清单" name="product_info"></tab-pane>
					</tabs>
					<div v-if="refundForms.type === 'refund'">
						<no-paginator-page ref="refundPage" v-bind="refundPageProps" ></no-paginator-page>
					</div>
					<div v-if="refundForms.type === 'return'">
						<no-paginator-page ref="refundSkuPage" v-bind="domainPageProps" ></no-paginator-page>
					</div>
				</div>
				<tabs value="refund_form">
					<tab-pane label="填写售后信息" name="refund_form"></tab-pane>
				</tabs>
				<row v-if="refundForms.type === 'refund' || refundForms.type === 'return'">
					<i-col :md="12" :lg="12" :xl="12">
						<form-item label="退款账号">
							<i-input class="w300" v-model="refundForms.cardNumber" placeholder="请输入支付宝、微信、银行卡账户"></i-input>
						</form-item>
					</i-col>
					<i-col :md="12" :lg="12" :xl="12">
						<form-item label="退款金额" prop="refundAmount">
							<InputNumber v-model="refundForms.refundAmount" :disabled="refundAmountDisabled"></InputNumber>
						</form-item>
					</i-col>
				</row>
				<row>
					<i-col :md="12" :lg="12" :xl="12">
						<form-item label="退款(货)原因">
							<i-select v-model="refundForms.reason" class="w300">
								<i-option v-for="(reason, index) in reasons" :value="reason.value" :key="`reason_${index}`">{{reason.label}}</i-option>
							</i-select>
						</form-item>
					</i-col>
					<i-col :md="12" :lg="12" :xl="12">
						<form-item label="联系方式" prop="tel">
							<i-input  class="w300" v-model="refundForms.tel" placeholder="请输入联系方式"></i-input>
						</form-item>
					</i-col>
				</row>
				<row>
					<form-item label="备注">
						<i-input class="w500" type="textarea" v-model="refundForms.internalRemark" :autosize="{minRows: 3,maxRows: 5}"></i-input>
					</form-item>
				</row>
			</i-form>
		</card>
		<div class="submit-btn" style="text-align: center"><i-button type="success" style="margin-left: 30px" :disabled="disabled" :loading="loading" @click="submit('refundForms')">提交</i-button></div>
	</div>
</template>
<script>
import RefundOrder from '../../../../models/ecommerse/refundOrder'
import Relation from '../../../../models/im/relation'
import NoPaginatorPage from '../../../../views/domain/no-paginator-page.vue'
import DescriptionInfo from '../../../../components/order/description-info.vue'
import RelationInfo from '../../order/create/components/relation-info.vue'
import { img, longText, price, labelActions } from '../../../../scripts/utils/table-renders'
import Address from '../../../../models/ecommerse/address';
const width = App.options.styles.table.width
export default {
	props: {
		order: {
			type: Object,
			required: true
		},
		// 退款单类型
		type: {
			type: String,
			required: true
		}
	},
	components: {
		NoPaginatorPage,
		DescriptionInfo,
		RelationInfo
	},
	watch: {
		
	},
	data() {
		const orderItems = _.cloneDeep(this.order.orderItems)
		orderItems.forEach(it => {
			if(it.discountType =='percent'){
				it.price = parseFloat( it.price * it.discountValue||0) 
			}else if(it.discountType == 'reduce'){
				it.price = it.price - it.discountValue||0
			}
		})
		let refundAmountDisabled = false
		if(this.order.orderStatus ==='delivering'||this.type ==='refund'){
			refundAmountDisabled = true
		}
		
		return {
			relation: {},
			orderItems: orderItems,
			address:Address.defaults(),
			refundForms: {
				type: this.type,
				cardNumber: '',
				refundAmount: 0,
				reason: '',
				tel: '',
				internalRemark: ''
			},
			disabled: false,
			refundAmountDisabled:refundAmountDisabled,
			ruleValidate: {
				refundAmount: [
					{type: 'number', message: '请输入合法的数字', trigger: 'blur'}
				],
				tel: [
                    { type: 'integer', regexp: /^1[34578]\d{9}$/ ,message: '请输入正确的手机格式', trigger: 'blur' }
				]
			},
			loading:false,
			refundTypes: {
				refund: '仅退款',
			    change:'仅换货',
				return: '退款退货'
			},			
			reasons: [
				{value:'empty', label: '空包裹/少货'},
				{value:'overtime', label: '未按约定时间发货'},
				{value:'unshipped', label: '快递一直未送达'},
				{value:'not_want', label: '拍错/拍多/不想要'},
				{value:'no_record', label: '快递无跟踪记录'},
				{value:'other', label: '其他'}
			],
			setQuantityDisabled: false,
			domainPageProps: {
				loadPage: async() => {
					// 得到退款单的数量
					const refundOrderPage = await RefundOrder.page(1,10,[{filterType:'EQ',property:'orderId',value:this.order.id}],[])
					const refunds = refundOrderPage.content.filter(it =>{return it.status != 'unconfirmed'})
					const refundSkuQuantityMap = {}
					refunds.forEach(it=>{
						it.orderItems.forEach(it2 =>{
							if(refundSkuQuantityMap[it2.skuId]){
								refundSkuQuantityMap[it2.skuId] += it2.quantity
							}else {
								refundSkuQuantityMap[it2.skuId] = it2.quantity
							}
						})
					})
					_.map(this.order.orderItems, it => {
						it.refundQuantity = 0
						if(it.discountType =='percent'){
							it.price = parseFloat( it.price * it.discountValue||0) 
						}else if(it.discountType == 'reduce'){
							it.price = it.price - it.discountValue
						}
						const skuId = it.skuId
						it.refundedNum = refundSkuQuantityMap[skuId] || 0
						it.refundQuantity = it.quantity - it.refundedNum
					})
					this.setDefaultRefundAmount(this.order.orderItems)					
					return {
						pageNo: 1,
						pageSize: 20,
						total: 0,
						content: this.order.orderItems
					}
				},
				columns: [
					{
						key: 'image',
						title: '图片',
						width: width.img,
						render: (h, context) => {
							const url = context.row.image || null
							return img(h, context, url)
						}
					},
					{
						key: 'productName',
						title: '名称',
						align: 'left',
						width: width.w_12,
						render: (h, context) => {
							return longText(h, context, context.row.productName, true)
						}
					},
					{
						key: 'skuTitle',
						title: '规格',
						align: 'left',
						width: width.w_10
					},
					{
						key: 'price',
						title: '购买价格',
						width: width.w_10
					},
					{
						key: 'quantity',
						title: '下单数量',
						width: width.w_6
					},
					{
						key: 'refundedNum',
						title: '已退款数量',
						width: width.w_8
					},
					{
						key: 'refundQuantity',
						title: '可退款数量',
						width: width.w_10,
						render: (h, context) => {
							const skuId = context.row.skuId
							let refundQuantity = context.row.refundQuantity

							let newQuantity = context.row.quantity

							// 编辑过程中记录最新值
							const onValue = value => { refundQuantity = value }

							// 编辑结束保存结果
							const onComplete = () => {
								this.editRefundQuantity(skuId, refundQuantity)
							}

							return <input-number min={0} max={context.row.quantity - context.row.refundedNum} class='w100p' disabled={refundAmountDisabled} value={refundQuantity} size='small'
								on-on-change={onValue} on-on-blur={onComplete}></input-number>
						}
					}
				]
			},
			refundPageProps: {
				loadPage: async() => {
					// 得到退款单的数量
					const refundOrderPage = await RefundOrder.page(1,10,[{filterType:'EQ',property:'orderId',value:this.order.id}],[])
					const refunds = refundOrderPage.content.filter(it =>{return it.status != 'unconfirmed'})
					const refundSkuQuantityMap = {}
					refunds.forEach(it=>{
						it.orderItems.forEach(it2 =>{
							if(refundSkuQuantityMap[it2.skuId]){
								refundSkuQuantityMap[it2.skuId] += it2.quantity
							}else {
								refundSkuQuantityMap[it2.skuId] = it2.quantity
							}
						})
					})
					_.map(this.order.orderItems, it => {
						it.refundQuantity = 0
						if(it.discountType =='percent'){
							it.price = parseFloat( it.price * it.discountValue||0) 
						}else if(it.discountType == 'reduce'){
							it.price = it.price - it.discountValue
						}
						const skuId = it.skuId
						it.refundedNum = refundSkuQuantityMap[skuId] || 0
						it.refundQuantity = it.quantity - it.refundedNum
					})
					this.setDefaultRefundAmount(this.order.orderItems)					
					return {
						pageNo: 1,
						pageSize: 20,
						total: 0,
						content: this.order.orderItems
					}
				},
				columns: [
					{
						key: 'image',
						title: '图片',
						width: width.img,
						render: (h, context) => {
							const url = context.row.image || null
							return img(h, context, url)
						}
					},
					{
						key: 'productName',
						title: '名称',
						align: 'left',
						width: width.w_12,
						render: (h, context) => {
							return longText(h, context, context.row.productName, true)
						}
					},
					{
						key: 'skuTitle',
						title: '规格',
						align: 'left',
						width: width.w_10
					},
					{
						key: 'price',
						title: '购买价格',
						width: width.w_10
					},
					{
						key: 'quantity',
						title: '下单数量',
						width: width.w_6
					},
					{
						key: 'refundQuantity',
						title: '退款数量',
						width: width.w_8
					},
					
				]
			},
		}
	},
	mounted() {
		if (this.order.metadata.relationId) {
			this.fetchRelation()
		}
		if (this.order.metadata.addressId) {
			this.fetchAddress()
		} else {
			this.address = this.order.address
		}
	},
	methods: {
		//获取好友信息
		async fetchRelation() {
			const filter = [
				{ property: 'id', filterType: 'EQ', value: this.order.metadata.relationId }
			]
			const page = await Relation.page(1, 1, filter, [])
			this.relation = page.content[0]
		},
		async fetchAddress(){
			const address = await Address.retrieve(this.order.metadata.addressId)
			this.address = address
		},
		// 设置默认退款金额
		setDefaultRefundAmount(orderItems){
			let amount = 0
			orderItems.forEach(it => {
				if(it.refundQuantity) {
					amount += it.price * it.refundQuantity
				}	
			})
			this.refundForms.refundAmount = _.min([parseInt(this.order.totalAmount),amount])
		},
		//修改退款数量，退款数量不能超过下单数量
		editRefundQuantity(skuId, count) {
			let amount = 0
			const idx = this.order.orderItems.findIndex(it => it.skuId === skuId)
			if (idx < 0) {
				console.warn('退款商品: ' + skuId)
				return
			}

			const item = this.order.orderItems[idx]
			item.refundQuantity = count
			//动态改变退款总金额
			this.order.orderItems.forEach(it => {
				if(it.refundQuantity) {
					amount += it.price * it.refundQuantity
				}	
			})
			this.refundForms.refundAmount = _.min([parseInt(this.order.totalAmount),amount])
		},
		
		async submit() {
			try {
				if(!this.refundForms.cardNumber){
					this.$Message.error("请完善退款账号!")
					return
				}
				if(!this.refundForms.reason){
					this.$Message.error("请选择退款原因!")
					return
				}
				// if(!this.refundForms.tel){
				// 	this.$Message.error("请选择联系方式!")
				// 	return
				// }
				const params = {
					orderId: this.order.id,
					type: this.refundForms.type,
					internalRemark : this.refundForms.internalRemark,
					extStr1 : this.reasons.find(it => {return it.value === this.refundForms.reason}).label,
					extStr3 : this.refundForms.tel
				}
				const orderItems = this.order.orderItems.map(it => {
					return {
						skuId: it.skuId,
						quantity: it.refundQuantity
					}
				}).filter(it => {return it.quantity > 0})
				if(_.isEmpty(orderItems)){
					this.$Message.error("可退款退货数量不足，无法提交！")
					return
				}
				params.orderItems = orderItems
				if(this.refundForms.type === 'refund' || this.refundForms.type === 'return') {
					params.refundAmount = this.refundForms.refundAmount
					params.extStr2 = this.refundForms.cardNumber
				}	
				await RefundOrder.create(params)
				this.$Notice.success({title: '创建售后订单成功'})
				this.disabled = true
				this.loading = false
			} catch (error) {
				this.loading = false
			}

		}
	}
}
</script>

