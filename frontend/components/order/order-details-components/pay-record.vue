<template>
	<div class="pay-info">
		<tabs value="pay_info">
			<tab-pane label="支付列表" name="pay_info"></tab-pane>
		</tabs>
		<no-paginator-page  v-bind="domainPageProps"></no-paginator-page>
	</div>
</template>
<script>
import NoPaginatorPage from '../../../views/domain/no-paginator-page.vue'
const width = App.options.styles.table.width
import columns from '../../../modules/ecommerse/payment/page/table/columns'
import Payment from '../../../models/ecommerse/payment'
const defaultCriterias = [

]
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
			columns,
			domain: Payment,
			defaultCriterias:[
					{
						property: 'paid',
						filterType: 'EQ',
						value: true
					},
					{
						property: 'orderId',
						filterType: 'EQ',
						value: this.order.id
					}
			],
			}
		}
	}
}
</script>

