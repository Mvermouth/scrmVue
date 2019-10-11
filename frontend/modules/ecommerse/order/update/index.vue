<style lang='less' scoped >
.ivu-card[disabled] {
	  color: #bbbec4;
    background-color: #f7f7f7;
		border-color: #dddee1;
		cursor: not-allowed;
		pointer-events: none;
}
</style>

<template>
    <div>
		<!-- <Card class="mb1f">
			<p slot="title"><span>订单详情</span></p>

		</Card> -->
		<!-- BEGIN 客户信息 -->
		<Card class="mb1f" v-if="order.customer">
			<p slot="title"><span>客户信息</span></p>
			<relation-info v-if="relation.id" :relation="relation"></relation-info>
		</Card>
		<!-- END  客户信息 -->
		<!-- BEGIN 购物车 -->
        <Card class="mb1f" :disabled='!canEditOrder' >

			<p slot="title"><span class="required">购物车</span></p>

			<i-form slot="extra" :label-width="80" inline :class="`${clsPrefix}card-extra-form`">
				<form-item label="仓库">
					<i-select v-model="order.warehouseId" clearable size="small" class="w10f">
						<i-option v-for="it in warehouses" :value="it.id" :key="it.id">{{ it.name }}</i-option>
					</i-select>
				</form-item>
				<form-item :label-width=".01">
					<i-button type="primary" size="small" :disabled="!order.warehouseId" @click="() => { selectors.cart = true }"><i class="fas fa-plus"/>&nbsp;添加商品</i-button>
				</form-item>
			</i-form>

			<select-inventory v-model="selectors.cart" title="选择商品" v-bind="cartSelectorProps" @on-selected-rows="onCartSelectorResult"></select-inventory>

			<cart ref="cart" v-model="orderItems"></cart>

		</Card>
		<!-- END 购物车 -->
		<!-- BEGIN 收货地址 -->
		<Card class="mb1f" :disabled='!canEditAddress' >

			<p slot="title"><span class="required">收货地址</span></p>

			<i-form slot="extra" inline :class="`${clsPrefix}card-extra-form`">
				<form-item>
					<i-button type="primary" size="small" :disabled="!customer.id" @click="onAddAddress"><i class="fas fa-plus"/>&nbsp;添加地址</i-button>
				</form-item>
			</i-form>

			<radio v-if="tmpAddress" :label="tmpAddress.id">
				<p :class="`dpib pr0_5f pl0_5f ${tmpAddress.id === order.addressId ? 'c-bg-info br-sm' : ''}`">
					<span class="dpib w5f ellipsis vb">{{tmpAddress.consignee}}</span>
					<span class="dpib w8f">{{tmpAddress.mobile}}</span>
					<span class="dpib w25f ellipsis vb">{{[tmpAddress.country, tmpAddress.state, tmpAddress.city, tmpAddress.district, tmpAddress.address].filter(it => !!it).join(', ')}}</span>
					<span>
						<span class="dpib tc w1f"><i @click.prevent.stop="() => { onEditTmpAddress(tmpAddress) }" class="c-sub-color f-base pointer far fa-edit"></i></span>
						<span class="dpib tc w1f ml0_5f"><i @click.prevent.stop="() => { onDeleteTmpAddress(tmpAddress) } " class="c-sub-color f-base pointer far fa-trash-alt"></i></span>
					</span>
				</p>
			</radio>
			<radio-group class="ml1f" v-if="addresses.length > 0" v-model="order.addressId" vertical>
				<radio v-for="it in addresses" :key="it.id" :label="it.id">
					<p :class="`dpib pr0_5f pl0_5f ${it.id === order.addressId ? 'c-bg-info br-sm' : ''}`">
						<span class="dpib w5f ellipsis vb">{{it.consignee}}</span>
						<span class="dpib w8f">{{it.mobile}}</span>
						<span class="dpib w25f ellipsis vb">{{[it.country, it.state, it.city, it.district, it.address].filter(it => !!it).join(', ')}}</span>
						<span>
							<span class="dpib tc w1f"><i @click.prevent.stop="() => { onEditAddress(it) }" class="c-sub-color f-base pointer far fa-edit"></i></span>
							<span class="dpib tc w1f ml0_5f"><i @click.prevent.stop="() => { onDeleteAddress(it) } " class="c-sub-color f-base pointer far fa-trash-alt"></i></span>
						</span>
					</p>
				</radio>
			</radio-group>
			<p v-if="addresses.length == 0 && !(tmpAddress)" class="tc c-sub-color">{{ relation.id ? '暂无地址' : '请选择客户'}}</p>

		</Card>	
		<!-- END 收货地址 -->
		<!-- BEGIN 运费 -->
		<Card class="mb1f" :disabled='!canEditAddress' >
			<p slot="title"><span>运费</span></p>
			<i-form :label-width="80">
				<form-item label="运费" class="mb0">
					<!-- <b v-if="!editShipFee" class="c-error f-lg">¥ {{order.shipFee}}</b> -->
					<i-input  size="small" v-model="order.shipFee" number class="w200" @on-blur="() => editShipFee = false" @oninput="()=> order.shipFee=order.shipFee.replace(/[^\d]/g,'')"></i-input>
					<!-- <i-col span="1" v-if="!editShipFee">
						<i @click.prevent.stop="() => editShipFee = true" class="c-sub-color f-base pointer ml1f far fa-edit" style="line-height: 34px;"></i>
					</i-col> -->
				</form-item>
			</i-form>
		</Card>
		<!-- END 运费 -->
		<!-- BEGIN 优惠 -->
		<Card class="mb1f"  :disabled='!canEditAddress' >
			<p slot="title"><span>优惠</span></p>
			<i-form :label-width="80">
				<form-item label="优惠" class="mb0">
					<!-- <b v-if="!editDiscountAmount" class="c-error f-lg">-¥ {{order.discountAmount}}</b> -->
					<i-input size="small" v-model="order.discountAmount" number :max="orderItemsAmount + order.shipFee" class="w200" @on-blur="() => editDiscountAmount = false" @oninput="()=> order.discountAmount =order.discountAmount.replace(/[^\d]/g,'')"></i-input>
					<!-- <i-col span="1" v-if="!editDiscountAmount">
						<i @click.prevent.stop="() => editDiscountAmount = true" class="c-sub-color f-base pointer ml1f far fa-edit" style="line-height: 34px;"></i>
					</i-col> -->
				</form-item>
			</i-form>
		</Card>
		<!-- END 优惠 -->
		<!-- BEGIN 支付信息 -->
		<Card class="mb1f"  :disabled='!canEditPayment' >

			<p slot="title">支付信息</p>

			<i-form :label-width="60">
				<!-- <row v-for="(it, idx) in payments" :gutter="16" :key="`payment-${idx}`">
					<i-col :xs="6" :sm="5" :md="5" :lg="4">
						<form-item label="渠道" required class="mb0_5f colon">
							<i-select v-if="it._edit" v-model="it.channel" size="small">
								<i-option v-for="channel in paymentChannels" :key="channel.value" :value="channel.value">{{channel.text}}</i-option>
							</i-select>
							<span v-else style="line-height: 34px; margin-left: 9px;">{{paymentChannelMap[it.channel]}}</span>
						</form-item>
					</i-col>
					<i-col :xs="6" :sm="5" :md="5" :lg="4">
						<form-item label="金额" required class="mb0_5f colon">
							<input-money v-if="it._edit" v-model="it.amount" size="small" class="mt4"></input-money>
							<i-input v-if="it._edit" v-model="it.amount" size="small" class="mt4"><span slot="prepend">￥</span></i-input>
							<span v-else class="ml0_5f" style="line-height: 34px;">¥ {{it.amount}}</span>	
						</form-item>
					</i-col>
					<i-col :xs="6" :sm="4" :md="3" :lg="3">
						<form-item label="已支付" class="mb0_5f colon">
							<checkbox v-if="it._edit" v-model="it.paid" size="small" class="mt1"></checkbox>
							<icon v-else :type="it.paid ? 'checkmark-round' : 'close-round'" size="14" :color="it.paid ? '#19be6b' : '#ed3f14'" style="line-height: 34px;"></icon>
						</form-item>
					</i-col>
					<i-col :xs="8" :sm="6" :md="5" :lg="3" >
						<form-item :label-width=".01" class="mb0_5f colon">
							<i-button v-if="it._edit" @click="() => it._edit = false" type="primary" size="small" :disabled="!parseInt(it.amount) > 0">确定</i-button>
							<i-button v-if="it._edit" @click.prevent.stop="() => payments.splice(idx, 1)" size="small">取消</i-button>
							<span v-else>
								<i @click.prevent.stop="() => it._edit = true" class="c-sub-color f-base pointer far fa-edit"></i>
								<i @click.prevent.stop="deletePaymentInfo(idx)" class="c-sub-color f-base ml0_5f pointer far fa-trash-alt"></i>
							</span>
						</form-item>
					</i-col>
				</row> -->
				<!--row v-if="payments.length > 0">
					<i-col :xs="22" :sm="17" :md="15" :lg="13">
						<alert class="tr">合计: <b class="c-error">¥ {{(paymentAmount/100).toFixed(2)}}</b>，其中已支付: <b class="c-error">¥ {{(paidAmount/100).toFixed(2)}}</b>，未支付: <b class="c-error">¥ {{((paymentAmount - paidAmount)/100).toFixed(2)}}</b></alert>
					</i-col>
				</row-->
				<!-- <row>
					<i-col :xs="22" :sm="17" :md="15" :lg="13">
						<i-button type="dashed" long @click="onAddPayment" :disabled="paymentInfoCompleted"><i class="fas fa-plus"/>&nbsp;添加支付</i-button>
					</i-col>
				</row> -->
				<row v-for="(it, idx) in payments" :gutter="16" :key="`payment-${idx}`">
					<i-col :xs="6" :sm="5" :md="5" :lg="4">
						<form-item label="渠道" required class="mb0_5f colon">
								<span>{{paymentChannelMap[it.channel]}}</span>
						</form-item>
					</i-col>
					<i-col :xs="6" :sm="5" :md="5" :lg="4">
						<form-item label="金额" required class="mb0_5f colon">
							<span class="ml0_5f" style="line-height: 34px;">¥ {{it.amount}}</span>	
						</form-item>
					</i-col>
				</row>
				<row v-if="payments.length == 0">
					<i-col :xs="22" :sm="17" :md="15" :lg="13">
						<span>暂无支付信息</span>
					</i-col>
				</row>
			</i-form>


		</Card>
		<!-- END 支付信息 -->

		<!-- BEGIN 订单信息 -->
		<Card class="mb1f">

			<p slot="title">订单信息</p>

			<div>
				<div :class="`${clsPrefix}retrieve-body`">
	
					<i-form :label-width="70">
						<row>
							<i-col :xs="12" :sm="12" :md="10" :lg="10">
								<div class="info-list">
									<i-input v-model='order.clientRemark' type="textarea" :autosize="{minRows: 3,maxRows: 4}" placeholder="请输入用户备注"></i-input>
								</div>
								<!-- <div v-if="selectedAddress">
									<alert>
										<template slot="desc">
											<b>寄送至</b>: {{[selectedAddress.country, selectedAddress.state, selectedAddress.city, selectedAddress.district, selectedAddress.address].filter(it => !!it).join(', ')}}
											<br/>
											<b>收货人</b>: {{selectedAddress.consignee}}, {{selectedAddress.mobile}}
										</template>
									</alert>
								</div> -->
							</i-col>
							<i-col :xs="12" :sm="12" :md="14" :lg="14">
								<row>
									<i-col span="8" offset="12" class="tr">
										<form-item label="商品总额" class="mb0">
											<b class="c-error f-lg">¥ {{orderItemsAmount}}</b>
										</form-item>
									</i-col>
								</row>
								<row>
									<i-col span="8" offset="12" class="tr">
										<form-item label="运费" class="mb0">
											<b class="c-error f-lg">¥ {{order.shipFee}}</b>
											<!-- <input-money v-else size="small" v-model="order.shipFee" class="mt4" @on-blur="() => editShipFee = false"></input-money> -->
											<!-- <i-input v-else size="small" v-model="order.shipFee" class="mt4" @on-blur="() => editShipFee = false"></i-input> -->
										</form-item>
									</i-col>
									<!-- <i-col span="1" v-if="!editShipFee">
										<i @click.prevent.stop="() => editShipFee = true" class="c-sub-color f-base pointer ml1f far fa-edit" style="line-height: 34px;"></i>
									</i-col> -->
								</row>
								<row>
									<i-col span="8" offset="12" class="tr">
										<form-item label="优惠" class="mb0">
											<b  class="c-error f-lg">-¥ {{order.discountAmount}}</b>
											<!-- <input-money v-else size="small" v-model="order.discountAmount" :max="orderItemsAmount + order.shipFee" class="mt4" @on-blur="() => editDiscountAmount = false"></input-money> -->
											<!-- <i-input v-else size="small" v-model="order.discountAmount" :max="orderItemsAmount + order.shipFee" class="mt4" @on-blur="() => editDiscountAmount = false"></i-input> -->
										</form-item>
									</i-col>
									<!-- <i-col span="1" v-if="!editDiscountAmount">
										<i @click.prevent.stop="() => editDiscountAmount = true" class="c-sub-color f-base pointer ml1f far fa-edit" style="line-height: 34px;"></i>
									</i-col> -->
								</row>
								<row>
									<i-col span="8" offset="12" class="tr">
										<form-item label="合计" class="mb0">
											<b class="c-error f-lg">¥ {{totalAmount}}</b>
										</form-item>
									</i-col>
								</row>
								<row>
									<i-col span="8" offset="12" class="tr">
										<form-item label="已支付" class="mb0">
											<b class="c-success f-lg">¥ {{paidAmount}}</b>
										</form-item>
									</i-col>
								</row>
								<row>
									<i-col span="8" offset="12" class="tr">
										<form-item label="待支付" class="mb0">
											<b class="c-warning f-lg">¥ {{totalAmount - paidAmount}}</b>
										</form-item>
									</i-col>
								</row>
							</i-col>
						</row>
					</i-form>	
				</div>
			</div>

			<row>
				<i-col span="4" offset="10">
					<i-button long size="large" type="success" :disabled="!canSubmit" :loading="loading" @click="beforeSubmit">保存订单</i-button>
				</i-col>
			</row>
			
		</Card>
		<!-- END 订单信息 -->
    </div>
</template>

<script>
import _ from 'lodash'

import Constant from '../../../../configs/constant'

import Address from '../../../../models/ecommerse/address'
import Customer from '../../../../models/ecommerse/customer'
import Order from '../../../../models/ecommerse/order'
import Relation from '../../../../models/im/relation'
import Warehouse from '../../../../models/ecommerse/warehouse'
import Inventory from '../../../../models/ecommerse/inventory'

import SelectInventory from '../../../../views/selectors/select-inventory'
import SelectRelation from '../../../../views/selectors/select-relation'

import Cart from '../create/components/cart.vue'
import RelationInfo from '../create/components/relation-info.vue'
import EditAddress from '../create/components/edit-address.vue'
import defaultAvatar from '../../../../images/default-avatar.png'
import CustomerAccount from '../../../../models/ecommerse/customerAccount';


const paymentChannels = _.keys(Constant.PaymentChannel).map(it => Constant.PaymentChannel[it])
const paymentChannelMap = paymentChannels.reduce((map, it) => {
	map[it.value] = it.text
	return map
}, {})

const defaultOrder = App.data.domain
defaultOrder.addressId = defaultOrder.metadata.addressId
export default {

	components: {
		SelectInventory,
		SelectRelation,
		Cart,
		RelationInfo,
		EditAddress
	},

	data() {
		const payments = defaultOrder.payments.map(it=>{
			it._edit = false
			return it
		})
		return {

			// 选择器打开/关闭
			selectors: {
				cart: false,
				relation: false
			},

			// 仓库列表
			warehouses: [],

			// 创建订单数据
			order: _.cloneDeep(defaultOrder),
			orderItems: [],

			// 编辑金额
			editShipFee: false,
			editDiscountAmount: false,

			// 订单关联的支付记录
			payments: payments||[],
			// 支付渠道配置
			paymentChannels,
			paymentChannelMap,

			// 选择的平台用户
			relation: {},

			// 平台用户关联的客户数据
			customer: Customer.defaults(),

			// 客户的地址列表
			addresses: [],

			tmpAddress: null,

			// 提交订单中
			loading: false,

			// 样式前缀
			clsPrefix: App.options.styles.prefix
		}
	},

	watch: {

		// 切换仓库
		'order.warehouseId': function() {
			// 清空购物车重新选择
			this.$refs.cart.clear()
		},


		// 地址变化
		addresses() {
			if (_.isEmpty(this.addresses)) {
				// 没有地址，重置
				this.order.addressId = 0
				return
			}

			if (!this.order.addressId) {
				// 没有选择地址，直接选择默认
				this.order.addressId = this.addresses[0].id
				return
			}

			if (this.addresses.findIndex(it => it.id === this.order.addressId) < 0) {
				// 选择的地址不存在，重置为默认
				this.order.addressId = this.addresses[0].id
				return
			}
		}
	},

	computed: {

		canEditOrder(){
			return this.order.orderStatus === Constant.LibOrderStatus.unconfirmed.value 
			|| this.order.orderStatus === Constant.LibOrderStatus.pending.value;
		},

		canEditAddress(){
			return this.order.shipStatus === Constant.LibShipStatus.not_shipped.value;
		},

		canEditPayment(){
			return this.order.payStatus !== Constant.LibPayStatus.payed.value;
		},

		//是否继续添加支付信息
		paymentInfoCompleted() {
			return _.some(this.payments, it =>{return it._edit} )
		},
		// 购物车选择器配置
		cartSelectorProps() {
			return {
				domainPageProps: {
					defaultCriterias: [
						{
							property: 'warehouseId',
							filterType: 'EQ',
							value: this.order.warehouseId
						},
						{
							property: 'deleted',
							filterType: 'EQ',
							value: false,
						},
						{
							property: 'onSale',
							filterType: 'EQ',
							value: true,
						}
					]
				}
			}
		},

		// 支付总额
		paymentAmount() {
			return this.payments.reduce((sum, it) => {
				if(it.amount === ''){
					it.amount = 0
				} 
				sum += parseFloat(it.amount)
				return sum
			}, 0)
		},

		// 已支付总额
		paidAmount() {
			return this.payments.reduce((sum, it) => {
				if(it.amount === ''){
					it.amount = 0
				} 
				if (it.paid) sum += parseFloat(it.amount)
				return sum
			}, 0)
		},

		// 商品合计
		// 商品合计
		orderItemsAmount() {
			let sum = 0
			this.orderItems.forEach(it => {
				if(it.discountType === 'reduce') {
					sum += (it.price - it.reduceValue) * it.quantity
				}else {
					sum += it.price * it.discountValue * it.quantity
				}
			})
			return sum
		},

		// 订单总额
		totalAmount() {
			return this.orderItemsAmount + this.order.shipFee - this.order.discountAmount
		},

		// 选择的地址
		selectedAddress() {
			if (!this.order.addressId || !this.addresses) {
				return null
			}
			return this.addresses.find(it => it.id === this.order.addressId)
		},

		// 是否能够提交订单
		canSubmit() {
			if (_.isEmpty(this.orderItems)) {
				return false
			}
			if (this.tmpAddress) {
				return true
			}
			if (!this.order.platformUid || !this.order.warehouseId || !this.order.addressId) {
				return false
			}
			return true
		}
	},

	async mounted() {
		if (this.order.customer && this.order.customer.id) {
			await this.fetchRelation()
		}
		// 仓库清单
		await this.fetchWarehouses()

		// 获取购物车Skus
		await this.fetchSkus()

		//获取用户以及用户地址
		if (this.order.customer && this.order.customer.id) {
			await this.fetchCustomer()
		}
		if (this.order.address && this.order.address.id) {
			await this.fetchAddresses()
		} else {
			this.tmpAddress = this.order.address;
		}
	},

	methods: {

		async fetchWarehouses() {
			const filter = [
				{
					property: 'deleted',
					filterType: 'EQ',
					value: false
				}
			]
			const sort = []
			const page = await Warehouse.pageNoAuth(1, 100, filter, sort, true)
			this.warehouses = page.content
		},
		//获取好友信息
		async fetchRelation() {
			const filter = [
				{ property: 'id', filterType: 'EQ', value: this.order.metadata.relationId }
			]
			const page = await Relation.page(1, 1, filter, [])
			this.relation = page.content[0]
		},
		// 购物车选择商品结果
		onCartSelectorResult(rows) {
			const items = rows.filter(it => it.quantity > 0).map(it => {
				return {
					skuId: it.skuId,
					name: it.productName,
					image: it.productImage|| defaultAvatar,
					spec: it.exStr1,
					price: it.price,
					quantity: 1,
					discountType: 'reduce',
					reduceValue: 0,
					discountValue: 1,
					sku: it
				}
			})
			items.forEach(it => {
				const idx = this.orderItems.findIndex(it2 => it2.skuId === it.skuId)
				if (idx >= 0) {
					// 已存在，增加数量
					const item = this.orderItems[idx]
					item.quantity = Math.min(item.quantity + 1, it.quantity)
				} else {
					// 新添加
					this.orderItems.push(it)
				}
			})
		},

		// 获取平台用户关联的客户信息
		async fetchCustomer() { 
			const filter = [
				// { property: 'platformId', filterType: 'EQ', value: platformId },
				{ property: 'platformUid', filterType: 'EQ', value: App.data.domain.platformUid }
			]
			const customer = await CustomerAccount.retrieveByPlatformUidAndId(App.data.domain.platformUid,App.data.domain.platformId)
			this.customer = customer
		},

		// 获取客户的地址列表
		async fetchAddresses() {
			const filter = [
				{ property: 'customerId', filterType: 'EQ', value: this.customer.id },
				{ property: 'deleted', filterType: 'EQ', value: false }
			]
			const page = await Address.page(1, 100, filter, [], true)
			this.addresses = _.orderBy(page.content, ['default'], ['desc'])
		},

		//批量获取Skus
		async fetchSkus() {
			const filter = [
				{ property: 'skuId', filterType: 'IN', value: this.order.orderItems.map(it => it.skuId) },
			]
			const page = await Inventory.pageNoAuth(1, 100, filter, [])
			const skuMap = _.keyBy(page.content, 'skuId')

			this.orderItems = this.order.orderItems.map(it => {
				const sku = skuMap[it.skuId]
				return {
					skuId: it.skuId,
					name: it.productName,
					image: it.image||defaultAvatar,
					spec: it.skuTitle,
					price: it.price,
					quantity: it.quantity,
					discountType: it.discountType,
					reduceValue: it.discountType === 'reduce' ? it.discountValue : 0,
					discountValue: it.discountType === 'percent' ? it.discountValue : 1,
					sku:sku?sku:{skuId:it.skuId,quantity:0}
				}
			})
		},

		// 打开添加地址对话框
		onAddAddress() {
			App.modal({
				title: '添加地址',
				loading: true,
				render: h => {
					h = this.$createElement
					return <edit-address customerId={this.customer.id}></edit-address>
				},
				onOk: async(comp, modal) => {
					try {
						const result = await comp.submit()
						if (!result) {
							// 校验失败，取消loading
							modal.cancelLoading()
							return
						}
						// 成功刷新地址
						await this.fetchAddresses()
						App.removeModal()
					} catch (e) {
						modal.cancelLoading()
					}
				}
			})
		},

		// 编辑地址
		onEditAddress(address) {
			App.modal({
				title: '修改地址',
				loading: true,
				render: h => {
					h = this.$createElement
					return <edit-address customerId={this.customer.id} address={address}></edit-address>
				},
				onOk: async(comp, modal) => {
					try {
						const result = await comp.submit()
						if (!result) {
							// 校验失败，取消loading
							modal.cancelLoading()
							return
						}
						// 成功刷新地址
						await this.fetchAddresses()
						App.removeModal()
					} catch (e) {
						modal.cancelLoading()
					}
				}
			})
		},

		// 编辑地址
		onEditTmpAddress(address) {
			App.modal({
				title: '修改地址',
				loading: true,
				render: h => {
					h = this.$createElement
					return <edit-address customerId={''} address={address}></edit-address>
				},
				onOk: async(comp, modal) => {
					try {
						this.tmpAddress = await comp.getAddress();
						App.removeModal()
					} catch (e) {
						modal.cancelLoading()
					}
				}
			})
		},
		//删除支付信息
		deletePaymentInfo(idx) {
			this.$Modal.confirm({
				title: '确认删除',
				content: '是否删除该条支付信息',
				loading: true,
				onOk: () => {
					this.payments.splice(idx, 1)
					this.$Modal.remove()
				}
			})
		},
		// 删除地址
		onDeleteAddress(address) {
			this.$Modal.confirm({
				title: '确认删除',
				content: '是否删除地址？',
				loading: true,
				onOk: async() => {
					await Address.delete(address.id)
					await this.fetchAddresses()
					this.$Modal.remove()
				}
			})
		},

		onDeleteTmpAddress(address) {
			this.$Modal.confirm({
				title: '确认删除',
				content: '是否删除地址？',
				loading: true,
				onOk: async() => {
					this.tmpAddress = null;
					this.$Modal.remove()
				}
			})
		},

		// 添加一条新的支付记录
		onAddPayment() {
			this.payments.push({
				_edit: true,
				amount: 0,
				channel: this.paymentChannels[0].value,
				paid: true
			})
		},

		beforeSubmit() {
			if (this.order.orderStatus === "unconfirmed") {
				this.$Modal.confirm({
					title: '确认保存',
					content: '审核不通过订单保存更新会改变状态至待审核</br>您确定要保存？',
					loading: true,
					onOk: async() => {
						this.onSubmit();
						this.$Modal.remove()
					}
				})
			} else {
				this.onSubmit()
			}
		},

		// 提交订单
		async onSubmit() {
			if (this.paidAmount > this.totalAmount) {
				this.$Notice.error({ title: '已支付金额超过订单总额' })
				return
			}

			this.loading = true
			try {
				const body = {
					orderId: this.order.id,
					addressId: this.order.addressId,
					discountAmount: this.order.discountAmount,
					totalAmount: this.totalAmount,
					shipFee:this.order.shipFee,
					productsAmount: this.orderItemsAmount,
					clientRemark: this.order.clientRemark
				}

				body.orderItems = this.orderItems.map(it => {
					return {
						id: it.id,
						skuId: it.skuId,
						discountType: it.discountType,
						discountValue: it.discountType === 'reduce' ? it.reduceValue : it.discountValue, 
						quantity: it.quantity
					}
				})
				body.payments = this.payments
				if(this.tmpAddress && !this.customer.id) {
					body.address = this.tmpAddress;
					body.platformId = Constant.OrderChannel.Telemarketing.value;
					body.platformUid = this.tmpAddress.mobile;
				}

				await Order.update(body)
				this.loading = false
				this.$Notice.success({title: '更新订单成功'})
			} catch (e) {
				console.error(e)
				this.loading = false
			}
		}

	}
}
</script>


