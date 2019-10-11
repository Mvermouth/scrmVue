<template>
    <div style="min-width: 1028px;">
		<!-- <Card class="mb1f">
			<p slot="title"><span>渠道</span></p>
			<i-form :label-width="80">
				<form-item label="渠道" class="mb0">
					<i-select size="small" class="w10f" v-model="order.channel">
						<i-option v-for="channel in orderChannels" :key="channel.value" :value="channel.value">{{channel.text}}</i-option>
					</i-select>
				</form-item>
			</i-form>
		</Card> -->
		

		<!-- BEGIN 客户信息 -->
		<Card class="mb1f">

			<p slot="title"><span class="required">客户信息</span></p>

			<i-form slot="extra" inline :class="`${clsPrefix}card-extra-form`">
				<form-item>
					<i-button type="primary" size="small" @click="() => { selectors.relation = true }"><i class="fas fa-plus"/>&nbsp;选择客户</i-button>
					<!-- <i-button type="primary" size="small" @click="() => { selectors.addRelation = true }"><i class="fas fa-plus"/>&nbsp;添加客户</i-button> -->
				</form-item>
			</i-form>
			
			<select-relation v-model="selectors.relation" title="选择客户" v-bind="relationSelectorProps" @on-selected-rows="onRelationSelectorResult"></select-relation>
			<modal v-model="selectors.addRelation" title="添加客户"  footer-hide >
				<add-relation :onOk="onAddRelationClick" :onCancel="onAddRelationCancelClick" ></add-relation>
			</modal>

			<relation-info v-if="relation.id" :relation="relation"></relation-info>
			<p v-else class="tc c-sub-color">请选择客户</p>

		</Card>
		<!-- END  客户信息 -->

		<!-- BEGIN 购物车 -->
        <Card class="mb1f" style="min-width: 1028px;">

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

			<select-inventory v-model="selectors.cart" title="选择商品" :width="1000" v-bind="cartSelectorProps" @on-selected-rows="onCartSelectorResult"></select-inventory>

			<cart v-model="orderItems" ></cart>
		</Card>
		<!-- END 购物车 -->

		<!-- BEGIN 收货地址 -->
		<Card class="mb1f">

			<p slot="title"><span class="required">收货地址</span></p>

			<i-form slot="extra" inline :class="`${clsPrefix}card-extra-form`">
				<form-item>
					<i-button type="primary" size="small" :disabled="!customer.id" @click="onAddAddress"><i class="fas fa-plus"/>&nbsp;添加地址</i-button>
				</form-item>
				<form-item v-if="!customer.id">
					<i-button type="primary" size="small"  @click="onAddAddressNoCustomer"><i class="fas fa-plus"/>&nbsp;填写地址</i-button>
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
		<Card class="mb1f">
			<p slot="title"><span>运费</span></p>
			<i-form :label-width="80">
				<form-item label="运费" class="mb0">
					<!-- <b v-if="!editShipFee" class="c-error f-lg">¥ {{order.shipFee}}</b>
					<i-input v-else size="small" v-model="order.shipFee" number class="w200" @on-blur="() => editShipFee = false" @oninput="()=> order.shipFee=order.shipFee.replace(/[^\d]/g,'')"></i-input>
					<i-col span="1" v-if="!editShipFee">
						<i @click.prevent.stop="() => editShipFee = true" class="c-sub-color f-base pointer ml1f far fa-edit" style="line-height: 34px;"></i>
					</i-col> -->
					<i-input size="small" v-model="order.shipFee" number class="w200" @on-blur="() => editShipFee = false" @oninput="()=> order.shipFee=order.shipFee.replace(/[^\d]/g,'')"></i-input>
				</form-item>
			</i-form>
		</Card>
		<!-- END 运费 -->

		<!-- BEGIN 优惠 -->
		<Card class="mb1f">
			<p slot="title"><span>优惠</span></p>
			<i-form :label-width="80">
				<form-item label="优惠" class="mb0">
					<!-- <b v-if="!editDiscountAmount" class="c-error f-lg">-¥ {{order.discountAmount}}</b>
					<i-input v-else size="small" v-model="order.discountAmount" number :max="orderItemsAmount + order.shipFee" class="w200" @on-blur="() => editDiscountAmount = false" @oninput="()=> order.discountAmount =order.discountAmount.replace(/[^\d]/g,'')"></i-input>
					<i-col span="1" v-if="!editDiscountAmount">
						<i @click.prevent.stop="() => editDiscountAmount = true" class="c-sub-color f-base pointer ml1f far fa-edit" style="line-height: 34px;"></i>
					</i-col> -->
					<i-input size="small" v-model="order.discountAmount" number :max="orderItemsAmount + order.shipFee" class="w200" @on-blur="() => editDiscountAmount = false" @oninput="()=> order.discountAmount =order.discountAmount.replace(/[^\d]/g,'')"></i-input>
				</form-item>
			</i-form>
		</Card>
		<!-- END 优惠 -->
		<!-- BEGIN 支付信息 -->
		<Card class="mb1f" v-if="showPayment">

			<p slot="title">支付信息</p>

			<i-form :label-width="60">
				<row v-for="(it, idx) in payments" :gutter="16" :key="`payment-${idx}`">
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
							<!-- <input-money v-if="it._edit" v-model="it.amount" size="small" class="mt4"></input-money> -->
							<i-input v-if="it._edit" v-model="it.amount" size="small" class="mt4"><span slot="prepend">￥</span></i-input>
							<span v-else class="ml0_5f" style="line-height: 34px;">¥ {{it.amount}}</span>	
						</form-item>
					</i-col>
					<!-- <i-col :xs="6" :sm="4" :md="3" :lg="3">
						<form-item label="已支付" class="mb0_5f colon">
							<checkbox v-if="it._edit" v-model="it.paid" size="small" class="mt1"></checkbox>
							<icon v-else :type="it.paid ? 'checkmark-round' : 'close-round'" size="14" :color="it.paid ? '#19be6b' : '#ed3f14'" style="line-height: 34px;"></icon>
						</form-item>
					</i-col> -->
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
				</row>
				<!--row v-if="payments.length > 0">
					<i-col :xs="22" :sm="17" :md="15" :lg="13">
						<alert class="tr">合计: <b class="c-error">¥ {{(paymentAmount/100).toFixed(2)}}</b>，其中已支付: <b class="c-error">¥ {{(paidAmount/100).toFixed(2)}}</b>，未支付: <b class="c-error">¥ {{((paymentAmount - paidAmount)/100).toFixed(2)}}</b></alert>
					</i-col>
				</row-->
				<row>
					<i-col :xs="22" :sm="17" :md="15" :lg="13">
						<i-button type="dashed" long @click="onAddPayment" :disabled="paymentInfoCompleted"><i class="fas fa-plus"/>&nbsp;添加支付</i-button>
					</i-col>
				</row>
			</i-form>

		</Card>
		<!-- END 支付信息 -->
		<Card class="mb1f">
			<p slot="title"><span>订单类型</span></p>
			<i-form :label-width="80">
				<form-item label="订单类型" class="mb0">
					<CheckboxGroup v-model="order.orderTags">
						<Checkbox label="首次购买"></Checkbox>
						<Checkbox label="复购"></Checkbox>
						<Checkbox label="赠送"></Checkbox>
    				</CheckboxGroup>
				</form-item>
			</i-form>
		</Card>
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
								</row>
								<row>
									<i-col span="8" offset="12" class="tr">
										<form-item label="优惠" class="mb0">
											<b  class="c-error f-lg">-¥ {{order.discountAmount}}</b>
											<!-- <input-money v-else size="small" v-model="order.discountAmount" :max="orderItemsAmount + order.shipFee" class="mt4" @on-blur="() => editDiscountAmount = false"></input-money> -->
											<!-- <i-input v-else size="small" v-model="order.discountAmount" :max="orderItemsAmount + order.shipFee" class="mt4" @on-blur="() => editDiscountAmount = false"></i-input> -->
										</form-item>
									</i-col>
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

			<row style="margin-top: 20px;">
				<i-col span="4" offset="10">
					<i-button long size="large" type="success" :disabled="!canSubmit" :loading="loading" @click="onSubmit">创建订单</i-button>
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
import CustomerAccount from '../../../../models/ecommerse/customerAccount'
import Order from '../../../../models/ecommerse/order'
import Relation from '../../../../models/im/relation'
import Warehouse from '../../../../models/ecommerse/warehouse'

import SelectInventory from '../../../../views/selectors/select-inventory'
import SelectRelation from '../../../../views/selectors/select-relation'

import AddRelation from './components/add-relation.vue'
import RelationInfo from './components/relation-info.vue'
import EditAddress from './components/edit-address.vue'
import Cart from './components/cart.vue'

import AppProxy from "../../../../scripts/common/appProxy";
import AppRoutes from "../../../../configs/AppRoutes";

const paymentChannels = _.keys(Constant.PaymentChannel).map(it => Constant.PaymentChannel[it])
const orderChannels = _.keys(Constant.OrderChannel).map(it => Constant.OrderChannel[it])
const paymentChannelMap = paymentChannels.reduce((map, it) => {
	map[it.value] = it.text
	return map
}, {})

const defaultOrder = () => {
	return {
		// 仓库
		warehouseId: 0,
		// 用户信息
		platformId: 'TencentWX',
		channel: 'TencentWX',
		platformUid: '',
		// 收货地址
		addressId: 0,
		// 用户备注
		clientRemark: '',
		orderTags:['首次购买'],
		// 运费
		shipFee: 0,
		// 优惠
		discountAmount: 0
	}
}

export default {

	components: {
		SelectInventory,
		SelectRelation,
		RelationInfo,
		AddRelation,
		EditAddress,
		Cart
	},

	data() {
		return {

			// 选择器打开/关闭
			selectors: {
				cart: false,
				relation: false,
				addRelation: false,
			},

			// 仓库列表
			warehouses: [],

			// 创建订单数据
			order: defaultOrder(),
			orderItems: [],

			// 编辑金额
			editShipFee: false,
			editDiscountAmount: false,

			// 订单关联的支付记录
			payments: [],
			// 支付渠道配置
			paymentChannels,
			paymentChannelMap,
			// 订单渠道
			orderChannels: orderChannels,

			// 选择的平台用户
			relation: Relation.defaults(),

			// 平台用户关联的客户数据
			customer: Customer.defaults(),

			// 客户的地址列表
			addresses: [],

			tmpAddress: null,

			// 提交订单中
			loading: false,

			// 样式前缀
			clsPrefix: App.options.styles.prefix,
			
			//是否展示支付
			showPayment:true
		}
	},

	watch: {

		// 切换仓库
		'order.warehouseId': function() {
			this.orderItems = []
		},

		// 切换平台用户
		'relation.id': async function() {
			// 订单的关联用户
			this.order.platformUid = this.relation.contact.platformUid

			if (this.relation.id) {
				// 平台用户关联的客户信息
				this.fetchCustomer()
			}
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
							value: false
						},
						{
							property: 'onSale',
							filterType: 'EQ',
							value: true
						}
					]
				}
			}
		},

		// 客户选择器配置
		relationSelectorProps() {
			return {
				domainPageProps: {
					selection: 'radio'
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
			if(this.order.shipFee === '') {
				this.order.shipFee = 0
			}
			return parseFloat(this.orderItemsAmount) + parseFloat(this.order.shipFee) - parseFloat(this.order.discountAmount)
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
			if (this.tmpAddress && !this.customer.id) {
				return true
			}

			if (!this.order.platformUid || !this.order.warehouseId || !this.order.addressId) {
				return false
			}
			
			return true
		}
	},

	created() {
		this.initData()
	},

	methods: {

		async initData() {
			// 仓库清单
			await this.initWarehouses()
		},

		async initWarehouses() {
			const filter = [
				{
					property: 'deleted',
					filterType: 'EQ',
					value: false
				}
			]
			const sort = []
			const page = await Warehouse.pageNoAuth(1, 100, filter, sort)
			this.warehouses = page.content
			if(this.warehouses.length === 1 ){
				this.order.warehouseId = this.warehouses[0].id
			}
		},

		// 购物车选择商品结果
		onCartSelectorResult(rows) {
			const items = rows.filter(it => it.quantity > 0).map(it => {
				return {
					skuId: it.skuId,
					name: it.productName,
					image: it.productImage,
					spec: it.specDesc,
					code: it.code,
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
					item.quantity = Math.max(item.quantity + 1, it.quantity)
				} else {
					// 新添加
					this.orderItems.push(it)
				}
			})
		},
		//禁止输入框输入
		// 客户选择结果
		onRelationSelectorResult(rows) {
			if (rows.length > 0) {
				this.relation = rows[0]
			}
		},

		// 获取平台用户关联的客户信息
		async fetchCustomer() {
			const contact = this.relation.contact
			const platformId = this.order.platformId
			const platformUid = contact.platformUid

			const customer = await CustomerAccount.retrieveByPlatformUidAndId(platformUid,platformId)
		
			if (!customer) {
				// 客户不存在，新创建
				const customer = {
					serviceID:this.relation.serviceID, 
					platformUid,
					nickname: contact.nickname,
					avatar: contact.avatar,
					sex: contact.gender
				}
				this.customer = await Customer.create(customer)
				this.addresses = []
			} else {
				this.customer = customer
				await this.fetchAddresses()
			}
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

		onAddAddressNoCustomer() {
			App.modal({
				title: '填写地址',
				loading: true,
				render: h => {
					h = this.$createElement
					return <edit-address customerId={''} ></edit-address>
				},
				onOk: async(comp, modal) => {
					try {
						this.tmpAddress = await comp.getAddress();
						console.log(this.tmpAddress);
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

		reset() {
			const warehouseId = this.order.warehouseId
			this.order = defaultOrder()
			this.order.warehouseId = warehouseId
			this.orderItems = []
			this.relation = Relation.defaults()
			this.customer = Customer.defaults()
			this.addresses = []
			this.payments = []
		},

		// 提交订单
		async onSubmit() {
			if (this.paidAmount > this.totalAmount) {
				this.$Notice.error({ title: '已支付金额超过订单总额' })
				return
			}

			this.loading = true
			try {
				const body = _.cloneDeep(this.order)

				const append = {
					totalAmount: this.totalAmount,
					productsAmount: this.orderItemsAmount,
					relationId: this.relation.id, 
				}
				Object.assign(body, append)

				body.orderItems = this.orderItems.map(it => {
					return {
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

				await Order.create(body)
				this.$Notice.success({title: '创建订单成功'})
				this.reset()
				this.loading = false

				AppProxy.do_push(AppRoutes.Order.page());
				setTimeout(()=>{
					App.event.$emit(Order.events.Update)
				},500);

			} catch (e) {
				console.error(e)
				this.loading = false
			}
		},

		onAddRelationClick(infos){
			console.log(infos)
			this.selectors.addRelation = false;
		},

		onAddRelationCancelClick(){
			this.selectors.addRelation = false;
		}

	}
}
</script>


