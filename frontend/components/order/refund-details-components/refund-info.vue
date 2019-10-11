<template>
	<div>
		<div class="refund-info">
			<description-info :descriptionInfos="refundInfos" :layout="{xs:24,sm:12,md:12,lg:12}"></description-info>
		</div>
		<div class="refund-product-info">
			<tabs value="refund_product_info">
				<tab-pane label="退款商品" name="refund_product_info"></tab-pane>
			</tabs>
			<no-paginator-page  v-bind="domainPageProps"></no-paginator-page>
		</div>
	</div>
</template>
<script>
import DescriptionInfo from '../description-info.vue'
import NoPaginatorPage from '../../../views/domain/no-paginator-page.vue'
import { constant2Array,value2Text } from '../../../scripts/utils/misc'
import { img, longText, price, labelActions } from '../../../scripts/utils/table-renders'
import Constant from '../../../configs/constant';
const width = App.options.styles.table.width
export default {
	components: {
		DescriptionInfo,
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
			domainPageProps: {
				loadPage: async() => {
					return {
						pageNo: 1,
						pageSize: 20,
						total: this.order.length,
						content: this.order.orderItems
					}
				},
				columns: [
					{
						key: 'image',
						title: '图片',
						width: width.img,
						render: (h, context) => {
							let url = null;
							try {
								url = context.row.image ? JSON.parse(context.row.image)[0] : null
							}
							catch(e){
								
							}
							
							return img(h, context, url)
						}
					},
					{
						key: 'productName',
						title: '商品名称',
						width: width.w_10
					},
					{
						key: 'skuTitle',
						title: '规格',
						width: width.w_10
					},
					{
						key: 'price',
						title: '单价',
						width: width.w_6,
					},
					{
						key: 'quantity',
						title: '退款数量',
						width: width.w_6
					}
				]
			}
		}
	},
	computed: {
		refundInfos() {
			console.log("refundorderInfo:",this.order)
			const text = value2Text(constant2Array(Constant.RefundOrderType),this.order.type)
			const statusText = value2Text(constant2Array(Constant.RefundStatus),this.order.status)
			return [
				{'订单编号': this.order.orderSn},
				{'退款编号': this.order.sn},
				{'退款账号': this.order.orderExtStr2},
				{'退款类型': text},
				{'退款金额': this.order.refundAmount},
				{'退款原因': this.order.orderExtStr1},
				{'退款说明': this.order.internalRemark},
				{'退款时间': dateformat(this.order.ctime, 'yyyy-mm-dd HH:MM:ss')},
				{'状态': statusText},
			]
		}
	}
}
</script>
