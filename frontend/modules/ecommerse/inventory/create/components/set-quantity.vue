<template>
    <div>
        <domain-page ref="domainPage" v-bind="domainPageProps"></domain-page>
    </div>
</template>
<script>
import DomainPage from '../../../../../views/domain/page.vue'
import {img } from '../../../../../scripts/utils/table-renders'
const width = App.options.styles.table.width

export default {
	components: {
		DomainPage
	},

	props: {
		value: {
			type: Array,
			required: true
		}
	},

	data() {
		return {
			// 订单物品v-model
			model: this.value,
			// 库存表格配置设置

			// TODO @fioman 不需要用domain-page
			domainPageProps: {
				loadPage: async() => {
					return {
						pageNo: 1,
						pageSize: 20,
						total: this.model.length,
						content: this.model
					}
				},
				columns: [
					{
						key: 'product.image',
						width: width.img,
						title: '商品图片',
						render(h, context) {
							const url = context.row.product.image
							return img.call(this, h, context, url)
						}
					},
					{
						key: 'product.name',
						width: width.w_16,
						title: '商品名称',
						render(h, context) {
							return <span>{context.row.product.name}</span>
						}
					},
					{
						key: 'code',
						title: '货号',
						width: width.w_10
					},
					{
						key: 'specDesc',
						width: width.w_16,
						title: '商品规格',
						render(h, context) {
							const specArr = []
							for (let i = 1; i <= 5; i++) {
								if (context.row[`exStr${i}`]) {
									specArr.push(context.row[`exStr${i}`])
								}
							}
							return <span>{specArr.join(',')}</span>
						}
					},
					{
						key: 'price',
						title: '价格',
						width: width.w_6,
						render: (h, context) => {
							return <span>{context.row.price}</span>
						}
					},
					{
						key: 'quantity',
						width: width.w_10,
						title: '库存',
						render: (h, context) => {
							const id = context.row.id
							const quantity = context.row.quantity

							let newQuantity = quantity

							// 编辑过程中记录最新值
							const onValue = value => {
								console.log('new Value:', value)
								newQuantity = value
							}

							// 编辑结束保存结果
							const onComplete = () => {
								this.setQuantity(id, newQuantity)
							}

							return (
								<input-number class='w100p' value={quantity} size='small' on-on-change={onValue} on-on-blur={onComplete}/>
							)
						}
					},
					{
						key: 'onSale',
						title: '上下架',
						width: width.w_10,
						render(h, context) {
							const text = context.row.onSale ? '上架' : '下架'
							return <span>{text}</span>
						}
					}
				],
				actions: [],
				size: 'small',
				topPaginator: false,
				bottomPaginator: false
			}
		}
	},

	computed: {

	},

	watch: {
		value() {
			this.model = this.value
		},

		model() {
			this.$emit('input', this.model)
		}

	},

	methods: {
	/**
     * 改变设置的库存的值
     *
     */
		setQuantity(id, quantity) {
			const idx = this.model.findIndex(it => it.id === id)
			if (idx >= 0) {
				const item = this.model[idx]
				item.quantity = quantity
			}
		},
		batchSetQuantity(quantity) {
			console.log('batchSetQuantity:', quantity)
			this.model.map(it => {
				it.quantity = quantity
			})
			this.$refs.domainPage.load()
		}
	}
}
</script>

