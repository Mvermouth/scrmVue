<template>
	<div>
		<div class="product-info">
			<tabs value="product_info">
				<tab-pane label="商品信息" name="product_info"></tab-pane>
    		</tabs>
			<no-paginator-page  v-bind="domainPageProps" @on-selected-rows="getSelectedRows"></no-paginator-page>
		</div>
		<div>
			<tabs value="refund_form">
				<tab-pane label="填写退款信息" name="refund_form"></tab-pane>
			</tabs>
			<i-form v-model="refundForms">
				<row>
					<i-col :md="12" :lg="12" :xl="12">
						<form-item label="申请服务">
							<i-select v-model="refundForms.type" class="w300">
								<i-option v-for="(type, index) in refundTypes" :value="type.value" :key="`refund_${index}`">{{type.label}}</i-option>
							</i-select>
						</form-item>
					</i-col>
					<i-col :md="12" :lg="12" :xl="12">
						<form-item label="退款原因">
							<i-select v-model="refundForms.reason" class="w300">
								<i-option v-for="(reason, index) in refundReasons" :value="reason.value" :key="`reason_${index}`">{{reason.label}}</i-option>
							</i-select>
						</form-item>
					</i-col>
				</row>
				<row>
					<i-col :md="12" :lg="12" :xl="12">
						<form-item label="退款账号">
							<i-input class="w300" v-model="refundForms.cardNumber"></i-input>
						</form-item>
					</i-col>
					<i-col :md="12" :lg="12" :xl="12">
						<form-item label="退款金额">
							<i-input class="w300" v-model="refundForms.amount"></i-input>
						</form-item>
					</i-col>
				</row>
				<row>
					<i-col :md="12" :lg="12" :xl="12">
						<form-item label="联系方式">
							<i-input  class="w300" v-model="refundForms.tel"></i-input>
						</form-item>
					</i-col>
					<i-col :md="12" :lg="12" :xl="12">
						<form-item label="退款说明">
							<i-input class="w300" type="textarea" v-model="refundForms.description" :autosize="{minRows: 3,maxRows: 5}"></i-input>
						</form-item>
					</i-col>
				</row>
			</i-form>
		</div>
		
		
	</div>
</template>
<script>
import NoPaginatorPage from '../../views/domain/no-paginator-page.vue'

const width = App.options.styles.table.width
export default {
	components: {
		NoPaginatorPage
	},
	props: {
		order: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			refundForms: {
				type: 'refund',
				reason: '',
				description: '',
				amount: 0,
				cardNumber: '',
				tel: ''
			},
			refundTypes: [
				{value:'refund', label: '仅退款'},
				{value:'goods', label: '仅退货'},
				{value:'refund&goods', label: '退款退货'},
			],
			refundReasons: [
				{value:'empty', label: '空包裹/少货'},
				{value:'overtime', label: '未按约定时间发货'},
				{value:'unshipped', label: '快递一直未送达'},
				{value:'not_want', label: '拍错/拍多/不想要'},
				{value:'no_record', label: '快递无跟踪记录'},
				{value:'other', label: '其他'}
			],
			domainPageProps: {
				loadPage: async() => {
					const skuIds = this.order.orderItems.map(it => it.skuId)
					const filter = [
							{
								filterType:'IN',
								property:'skuId',
								value:skuIds
							},
							{
								filterType:'EQ',
								property:'warehouseId',
								value: this.order.warehouseId
							}
						]
					const skuPage = await Inventory.pageNoAuth(1,10,filter,[])
					const skuMap = _.keyBy(skuPage.content, 'skuId')
					this.order.orderItems.forEach(it =>{
						it.code = skuMap[it.skuId].code
						it.productName = skuMap[it.skuId].productName,
						it.specDesc = skuMap[it.skuId].specDesc
					})
					return {
						pageNo: 1,
						pageSize: 20,
						total: this.order.orderItems.length,
						content: []   //this.order.orderItems
					}
				},
				selection: 'checkbox',
				columns: [
					{
						key: 'productName',
						title: '商品名称',
						width: width.w_12
					},
					{
						key: 'code',
						title: '商品货号',
						width: width.w_10
					},
					{
						key: 'specDesc',
						title: '规格',
						width: width.w_10
					},
					{
						key: 'price',
						title: '单价',
						width: width.w_10,
					},
					{
						key: 'quantity',
						title: '数量',
						width: width.w_10
					},
					{
						key: 'discountAmount',
						title: '优惠',
						width: width.w_10
					},
					{
						key: 'totalAmount',
						title: '总额',
						width: width.price
					}
				]
			}
		}
	},
	methods: {
		getSelectedRows(rows) {
			console.log('rows:', rows)
		}
	}
}
</script>

