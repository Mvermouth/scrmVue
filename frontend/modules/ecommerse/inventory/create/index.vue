<style lang="less" scoped>
	.btn {
		padding: 20px 0;
		text-align: center
	}
</style>

<template>
    <div>

		<!-- BEGIN 选择器 -->
		<select-product v-model="selectors.product" title="选择商品" @on-selected-rows="onSelectRows"></select-product>
		<!-- END 选择器 -->
        <card>
			<p slot="title">添加库存</p>
			<div>
				<row>
					<i-col :xs="24" :sm="24" :md="12" :lg="12">
						<span>选择仓库：</span>
						<i-select  class="w200" v-model="warehouseId"  filterable clearable>
							<i-option v-for="item in warehouses" :value="item.id" :key="item.id">{{ item.name }}</i-option>
						</i-select>
						<i-button type="primary" :disabled="!warehouseId" @click="onSelectClick"><i class="fas fa-plus"/>选择商品</i-button>
					</i-col>
					<i-col :xs="24" :sm="24" :md="12" :lg="12" style="text-align: right">
                        <input-number  v-model="quantity" size='small'/>
						<i-button type="primary" @click="batchSetQuantity">批量填充库存</i-button>
					</i-col>
				</row>
			</div>
            <div v-if="selectProduct.content.length >0">
                <set-quantity ref="cart" v-model="selectProduct.content"></set-quantity>
				<div class="btn">
					<i-button type="ghost" @click="onReset">重置</i-button>
					<i-button type="primary" @click="onSubmit">确定</i-button>
				</div>
			</div>
		</card>
    </div>
</template>

<script>
import SelectProduct from '../../../../views/selectors/select-product'
import SetQuantity from './components/set-quantity.vue'
import Warehouse from '../../../../models/ecommerse/warehouse'
import Inventory from '../../../../models/ecommerse/inventory'
import Sku from '../../../../models/ecommerse/sku'
export default {
	components: {
		SelectProduct,
		SetQuantity
	},
	data() {
		return {
			quantity: 0, // 批量填充库存
			warehouseId: null, // 选择仓库ID
			selectors: {
				product: false
			},
			selectProduct: {
				content: []
			},
			warehouses: []

		}
	},
	watch: {},
	created() {
		this.initData()
	},
	methods: {
		async initData() {
			await this.loadWarehouseData()
		},
		// 获取仓库的信息
		async loadWarehouseData() {
			const wareHousePage = await Warehouse.pageNoAuth(1, 100, [{filterType:'EQ',property:'deleted',value:false}], [], true)
			this.warehouses = wareHousePage.content
		},
		async onSelectRows(rows) {
			const skus = await this.transFormData(rows, this.warehouseId)
			this.selectProduct.content = skus
		},
		batchSetQuantity() {
			this.$refs.cart.batchSetQuantity(this.quantity)
		},
		// 将商品视图转化成表格视图 & 并记当前仓库的库存
		async transFormData(rows, warehouseId) {
			// 查找商品对应的库存信息
			const productIds = rows.map(it => { return it.id })
			const filter = [
				{
					filterType: 'IN',
					property: 'product.id',
					value: productIds
				},
				{
					filterType: 'EQ',
					property: 'deleted',
					value: false
				}
			]
			//
			const skuPage = await Sku.page(1, 200, filter, [], true)
			// 查询商品的sku 库存
			const filter2 = [
				{
					filterType: 'IN',
					property: 'productId',
					value: productIds
				},
				{
					filterType: 'EQ',
					property: 'warehouseId',
					value: warehouseId
				},
				{
					filterType: 'EQ',
					property: 'deleted',
					value: false
				}
			]
			const inventoryPage = await Inventory.pageNoAuth(1, 200, filter2, [], true)
			const skus = skuPage.content
			const warehouseMap = _.keyBy(inventoryPage.content, 'skuId')
			skus.forEach(it => {
				if (warehouseMap[it.id]) {
					it.quantity = warehouseMap[it.id].quantity
				} else {
					it.quantity = 0
				}
			})
			return skus
		},

		async onSubmit() {
			console.log('onSubmit:', this.selectProduct.content)
			const inventories = this.selectProduct.content.map(it => {
				const inventory = {
					skuId: it.id,
					warehouseId: this.warehouseId,
					quantity: it.quantity ? it.quantity : 0
				}
				return inventory
			})
			await Inventory.batchCreate({ inventories: inventories })
           	this.$Notice.success({
				title: '设置库存成功!',
				duration: 5
			})
		},
		onReset() {

		},
		onSelectClick() {
			this.selectors.product = true
			this.selectProduct.content = []
		}
	}
}
</script>


