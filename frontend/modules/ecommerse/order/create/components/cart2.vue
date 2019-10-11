<template>
    <div>
        <domain-page ref="domainPage" v-bind="domainPageProps"></domain-page>
        <p class="tr pl1f pr1f">合计：<b class="c-error">¥ {{ (totalAmount/100).toFixed(2) }}</b></p>
    </div>
</template>
<script>
import _ from 'lodash'
import DomainPage from '../../../../../views/domain/no-paginator-page.vue'
import { img, longText, price, labelActions } from '../../../../../scripts/utils/table-renders'

const width = App.options.styles.table.width

export default {

	components: {
		DomainPage
	},

	props: {

		/**
		 * 购物车物品
		 * 
		 * 结构
		 * 	{
		 * 		skuId,
		 * 		name,
		 * 		image,
		 * 		code,
		 * 		spec,
		 * 		quantity,
		 * 		price,
		 * 		discountAmount,
		 * 		sku: {
		 * 			// 关联的原始sku信息 ...
		 * 		}
		 * 	}
		 */
		value: {
			type: Array,
			required: true
		}
	},

	data() {
		return {
			// 订单物品v-model
			model: this.value,

			// 购物车列表配置
			// TODO @fioman 不用domain page
			domainPageProps: {
				loadPage: async() => {
					return {
						pageNo: 1,
						pageSize: 20,
						total: 0,
						content: this.model
					}
				},
				columns: [
					{
						key: 'name',
						title: '名称',
						align: 'left',
						width: width.w_12,
						render: (h, context) => {
							return longText(h, context, context.row.name, true)
						}
					},
					{
						key: 'image',
						title: '图片',
						width: width.img,
						render: (h, context) => {
							return img(h, context, context.row.image)
						}
					},
					{
						key: 'code',
						title: '货号',
						align: 'left',
						width: width.w_10
					},
					{
						key: 'spec',
						title: '规格',
						align: 'left',
						width: width.w_10
					},
					{
						key: 'sku.quantity',
						title: '库存',
						width: width.w_6
					},
					{
						key: 'price',
						title: '单价',
						width: width.w_10,
						render: (h, context) => {
							const skuId = context.row.skuId
							const value = context.row.price
							return <input-money value={value} on-input={value => this.setPrice(skuId, value)} size='small'></input-money>
						}
					},
					{
						key: 'quantity',
						title: '数量',
						width: width.w_10,
						render: (h, context) => {
							const skuId = context.row.skuId
							const quantity = context.row.quantity

							let newQuantity = quantity

							// 编辑过程中记录最新值
							const onValue = value => { newQuantity = value }

							// 编辑结束保存结果
							const onComplete = () => {
								if (newQuantity > quantity) {
									this.incr(skuId, newQuantity - quantity)
								} else if (newQuantity < quantity) {
									this.decr(skuId, quantity - newQuantity)
								}
							}

							return <input-number min={1} max={context.row.sku.quantity} class='w100p' value={quantity} size='small'
								on-on-change={onValue} on-on-blur={onComplete}></input-number>
						}
					},
					{
						key: 'discountAmount',
						title: '优惠',
						width: width.w_10,
						render: (h, context) => {
							const skuId = context.row.skuId
							const value = context.row.discountAmount
							return <input-money value={value} on-input={value => this.setDiscountAmount(skuId, value)} size='small'></input-money>
						}
					},
					{
						key: '_totalAmount',
						title: '总额',
						align: 'right',
						width: width.price,
						render: (h, context) => {
							const row = context.row
							const totalAmount = row.price * row.quantity - row.discountAmount
							return price(h, context, totalAmount)
						}
					},
					{
						key: '_actions',
						title: '删除',
						width: width.label_actions_1,
						render: (h, context) => {
							const skuId = context.row.skuId
							const quantity = context.row.quantity
							const name = context.row.name

							return labelActions(h, context, null, [
								{
									delete: {
										onAction: () => {
											this.$Modal.confirm({
												title: '确认删除',
												content: `是否删除 ${name} ？`,
												onOk: () => {
													const $list = this.$refs.domainPage.$refs.list
													this.decr(skuId, quantity)
													$list.deselect([skuId])
													$list.load()
												}
											})
										}
									}
								}
							])
						}
					}
				],
				actions: [
					{
						delete: {
							unauthorize: true,
							onAction: ($list, rows) => {
								this.$Modal.confirm({
									title: '确认删除',
									content: `是否删除 ${rows.length} 件商品 ？`,
									onOk: () => {
										const keys = []
										rows.forEach(it => {
											const skuId = it.skuId
											const quantity = it._quantity
											this.decr(skuId, quantity)
											keys.push(skuId)
										})
										$list.deselect(keys)
										$list.load()
									}
								})
							}
						}
					}
				],
				size: 'small',
				defaultIdKey: 'skuId'
			}
		}
	},
	
	computed: {

		// 购物车总金额
		totalAmount() {
			return this.model.reduce((sum, it) => {
				return sum + (it.price * it.quantity - it.discountAmount)
			}, 0)
		}

	},

	watch: {

		value() {
			this.model = this.value
		},

		model() {
			this.$emit('input', this.model)
			this.$refs.domainPage.load()
		}
	},

	methods: {

		/**
		 * 向购物车添加物品
		 */
		addItems(items) {
			items.forEach(it => {
				const idx = this.model.findIndex(it2 => it2.skuId === it.skuId)
				if (idx >= 0) {
					// 已存在，增加数量
					const item = this.model[idx]
					item.quantity = Math.min(item.quantity + it.quantity, item.sku.quantity)
					this.model.splice(idx, 1, item)
				} else {
					// 新添加
					this.model.push(it)
				}
			})
		},

		/**
         * 增加购物车物品数量
         */
		incr(skuId, count) {
			const idx = this.model.findIndex(it => it.skuId === skuId)
			if (idx >= 0) {
				// 已经存在
				const item = this.model[idx]
				item.quantity = Math.min(item.quantity + count, item.sku.quantity)
				this.model.splice(idx, 1, item)
			} else {
				// 新添加
				const sku = this.skus[skuId]
				const item = {
					skuId,
					price: sku.price,
					quantity: Math.min(1, this.skus[skuId].quantity),
					discountAmount: 0
				}
				this.model.push(item)
			}
		},

		/**
         * 减少购物车物品数量
         */
		decr(skuId, count) {
			const idx = this.model.findIndex(it => it.skuId === skuId)
			if (idx < 0) {
				console.warn('购物车Sku不存在: ' + skuId)
				return
			}

			const item = this.model[idx]
			item.quantity = Math.max(0, item.quantity - count)
			
			if (item.quantity > 0) {
				// 校验优惠
				this.checkDiscountAmount(item)
				this.model.splice(idx, 1, item)
			} else {
				// 数量清零，移出购物车
				this.model.splice(idx, 1)
			}
		},

		/**
         * 自定义价格
         */
		setPrice(skuId, price) {
			const idx = this.model.findIndex(it => it.skuId === skuId)
			if (idx < 0) {
				console.warn('购物车Sku不存在: ' + skuId)
				return
			}

			const item = this.model[idx]
			item.price = Math.max(price, 0)

			// 校验优惠
			this.checkDiscountAmount(item)

			// 更新
			this.model.splice(idx, 1, item)
		},

		/**
         * 优惠金额
         */
		setDiscountAmount(skuId, discountAmount) {
			const idx = this.model.findIndex(it => it.skuId === skuId)
			if (idx < 0) {
				console.warn('购物车Sku不存在: ' + skuId)
				return
			}

			const item = this.model[idx]
			item.discountAmount = Math.max(discountAmount, 0)

			// 校验优惠
			this.checkDiscountAmount(item)

			// 更新
			this.model.splice(idx, 1, item)
		},

		/**
         * 校验优惠金额
         */
		checkDiscountAmount(item) {
			// 总额不能为负
			const totalAmount = item.price * item.quantity - item.discountAmount
			if (totalAmount < 0) {
				item.discountAmount = Math.max(0, item.discountAmount + totalAmount)
			}
		},

		/**
         * 清空购物车
         */
		clear() {
			this.model = []
		}
	}

}
</script>

