import '../../../../scripts/common/app'

import Product from '../../../../models/ecommerse/product'

import formItems from './table/form-items'
import columns from './table/columns'
import View from '../../../../views/domain/page.vue'
import ProductList from './product-list.vue'
import BatchPricing from './batch-pricing.vue'

const defaultCriterias = [
	{
		property: 'deleted',
		filterType: 'EQ',
		value: false
	},
	{
		property: 'onSale',
		filterType: 'EQ',
		value: true
	}
]
new Vue({
	comments: {
		ProductList,
		BatchPricing
	},
	el: '#app',
	render: h => {
		const v = h(View, {
			props: {
				formItems,
				formProps: {
					labelWidth: 120
				},
				columns,
				domain: Product,
				defaultCriterias,
				defaultSort: [
					{
						'ignoreCase': false,
						'property': 'ctime',
						'type': 'DSC'
					}
				],
				actions: ['view', 'create',
					{
						'batch_pricing': {
							title: '批量改价',
							// icon: 'ivu-icon ivu-icon-plus',
							type: 'info',
							unauthorize: true,
							selection: true,
							onAction: function($list, rows) {
								App.modal({
									crossFrame: false,
									title: '批量改价',
									width: 'large',
									loading: true,
									render: (h) => {
										h = this.$createElement
										return <BatchPricing items={rows} />
									},
									onOk: async(item, modal) => {
										try {
											const ok = await item.submit()
											if (!ok) {
												// 校验失败，取消loading
												modal.cancelLoading()
												return
											}
											this.$Message.info('批量设置价格成功')
											App.removeModal()
											App.event.$emit(Product.events.Update)
										} catch (e) {
											modal.cancelLoading()
										}
									}
								})
							}
						}
					},
					{
						'batch_down_shelf': {
							title: '批量下架',
							icon: 'ivu-icon ivu-icon-plus',
							type: 'info',
							unauthorize: true,
							selection: true,
							onAction: function($list, rows) {
								App.modal({
									title: '批量下架',
									width: 400,
									content: '下架后，店铺内将不再展示这些商品\n确认下架？',
									loading: true,
									onOk: async(view, modal) => {
										console.log('批量下架 具体逻辑: ', rows)
										// TODO
										try {
											const params = {
												ids: rows.map(it => it.id)
											}
											await Product.batchUnSale(params)
											this.$Message.info('批量下架商品成功')
											App.removeModal()
											App.event.$emit(Product.events.Update)
										} catch (error) {
											this.$Message.error('批量下架商品失败!')
											modal.cancelLoading()
										}
									}
								})
							}
						}
					},
					{
						'delete': {
							title: '批量删除',
							icon: 'ivu-icon ivu-icon-trash-b',
							type: 'error',
							unauthorize: true,
							selection: true,
							onAction: function($list, rows) {
								App.modal({
									title: '批量删除',
									width: 500,
									content: ' 删除后，店铺内将不再展示这些商品，并且库存以及SKU将全部一并删除,该商品相关的订单将再无法编辑,确认删除？',
									loading: true,
									onOk: async(view, modal) => {
										console.log('批量删除 具体逻辑: ', rows)
										// TODO
										try {
											const ids = rows.map(it => it.id)
											await Product.batchDelete(ids)
											this.$Message.info('批量删除商品成功')
											App.removeModal()
											App.event.$emit(Product.events.Delete)
										} catch (error) {
											this.$Message.error('批量删除商品失败!')
											modal.cancelLoading()
										}
									}
								})
							}
						}
					}
				],
				display: 'custom',
				listComponent: ProductList
			}
		})
		return <card>{v}</card>
	}
})
