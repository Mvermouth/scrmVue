<template>
	<div class="order-logs">
		<tabs value="order_logs">
			<tab-pane label="订单日志列表" name="order_logs"></tab-pane>
		</tabs>
		<no-paginator-page  v-bind="domainPageProps"></no-paginator-page>
	</div>
</template>
<script>
import NoPaginatorPage from '../../../views/domain/no-paginator-page.vue'
import OrderAudit from '../../../models/ecommerse/orderAudit'
import Constant from '../../../configs/constant'
import { constantText } from '../../../scripts/utils/table-renders'
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
			domainPageProps: {
				loadPage: async(pageNo,pageSize,filter,sort) => {
					return await OrderAudit.page(pageNo,pageSize,filter,[{ignoreCase:false,property:'ctime',type:'DSC'}])
				},
				defaultCriterias :
					[
						{
							filterType: 'EQ',
							property: 'orderId',
							value: this.order.id
						}
					],
				defaultSort : [
					{
						'ignoreCase': false,
						'property': 'ctime',
						'type': 'DSC'
					}
				],
				columns: [
					{
						key: 'ctime',
						title: '时间',
						width: width.w_12,
						render(h, context){
							return <span>{dateformat(context.row.ctime,'yyyy-mm-dd HH:MM:ss')}</span>
						}
					},
					{
						key: 'operatorName',
						title: '操作人',
						width: width.w_10
					},
					{
						key: 'content',
						title: '操作内容',
						width: width.w_12,
					},
					{
						key: 'operateType',
						title: '操作类型',
						width: width.w_8,
						render(h, context){
							const value = context.row.operateType
							return constantText.call(this, h, context, value, Constant.OrderOperation)
						}
					},
				]
			}
		}
	}
}
</script>

