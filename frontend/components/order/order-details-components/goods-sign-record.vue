<template>
	<div class="goods-info">
		<tabs value="goods_info">
			<tab-pane label="收货单据列表" name="goods_info"></tab-pane>
		</tabs>
		<no-paginator-page  v-bind="domainPageProps"></no-paginator-page>
	</div>
</template>
<script>
import NoPaginatorPage from '../../../views/domain/no-paginator-page.vue'
import Order from '../../../models/ecommerse/order' 
const width = App.options.styles.table.width
export default {
	props: {
	 	order: {
			 type: Object,
			 required: true
		 }
	},
	components: {
		NoPaginatorPage
	},
	data() {
		return {
			domainPageProps: {
				loadPage: async() => {
					const content = await Order.operations(this.order.id)
					return {
						content:content,
						page:{
							pageNo:1,
							pageSize:20
						},
						total:content.length
					}
				},
				columns: [
					{
						key: 'ctime',
						title: '操作时间',
						width: width.datetime,
						render(h,context){
							return <span>{dateformat(new Date(context.row.ctime),"yyyy-mm-dd HH:MM:ss")}</span>
						}
					},
					// {
					// 	key: 'sn',
					// 	title: '流水号',
					// 	width: width.w_10
					// },
					{
						key: 'action',
						title: '操作',
						width: width.w_6,
						render(h,context){
							return <span>{context.row.action}</span>
						}
					},
					{
						key: 'operatorName',
						title: '操作人',
						width: width.w_6,
						render(h,context){
							return <span>{context.row.operatorName}</span>
						}
					},
					// {
					// 	key: 'logisticsCompany',
					// 	title: '物流公司',
					// 	width: width.w_10,
					// },
					// {
					// 	key: 'logisticsSn',
					// 	title: '物流单号',
					// 	width: width.w_12
					// },
					// {
					// 	key: 'status',
					// 	title: '状态',
					// 	width: width.w_10
					// },
					{
						key: 'remark',
						title: '备注',
						width: width.w_20
					}
				]
			}
		}
	}
}
</script>

