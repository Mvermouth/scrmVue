<style lang="less" scoped>
	.cart-layout {
		font-size: 12px;
		width: 996px;
		margin: 0 auto;
		ul,li {
			list-style: none;
		}
		.item-content{
			&:last-child {
				border-bottom: 1px solid #e7e7e7;
			}
			border: 1px solid #e7e7e7;
			border-bottom: none;
		}
		.cart-table-th {
			overflow: hidden;
			height: 50px;
			color: #3c3c3c;
		}
		.th {
			text-align: left;
			position: relative;
			float: left;
		}	
		.td {
			position: relative;
			float: left;
			min-height: 119px;
		}
		.td-inner {
			padding-top: 20px; 
		}
		.th-chk, .td-chk {
			width: 20px;
		}
		.th-chk {
			font-size: 12px;
			text-align: left;
			position: relative;
			height: 50px;
		}
		.th-item, .td-item {
			width: 302px;
		}
		.th-item {
			.td-inner {
				padding-left: 71px;
			}
		}
		.item-pic {
			width: 80px;
			height: 80px;
			border: 1px solid #eee;
			float: left;
			overflow: hidden;
			img {
				width: 100%;
				height: 100%;
			}
		}
		.item-info {
			margin: 0 0 0 91px;
			padding-right: 25px;
		}
		.th-info, .td-info {
			width: 100px;
			padding-right: 20px;
		}
		.sku-line {
			margin: 0 5px 0 15px;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.th-price, .td-price {
			width: 165px;
		}
		.th-quantity, .td-quantity {
			width: 100px;
		}
		.price-item {
			height: 28px;
			.line-through {
				// text-decoration: line-through;
			}
		}
		.price-txt {
			padding-left: 18px;
		}
		.price-item-radio {
			.ivu-radio-wrapper {
				margin-right: 0px;
				font-size: 12px;
			}
		}
		.th-amount, .td-amount {
			width: 100px;
		}
		.th-sum, .td-sum {
			width: 100px;
		}
		.th-op, .td-op {
			width: 84px;
    		padding: 0 0 0 15px;
		}
		.clearfix {
			&::after {
				content: '\0020';
				display: block;
				height: 0;
				clear: both;
			}
		}
		.float-bar-wrapper {
			margin-top: 20px;
			height: 50px;
			padding-right: 50px;
			overflow: hidden;
			background: #e5e5e5;
		}
		.input-num {
			width: 80px;
		}
		.bottom-select-all {
			float: left;
			width: 60px;
			height: 50px;
			line-height: 50px;
			padding-left: 5px;
			.ivu-checkbox-wrapper {
				font-size: 12px;
			}
		}
		.operations {
			float: left;
			height: 50px;
			line-height: 50px;
			padding-left: 20px;
			a {
				margin-left: 25px;
  				float: left;
			}
		}
		.float-bar-right {
			float: right;
			padding-left: 20px;
			.amount-sum {
				height: 48px;
    			color: #3c3c3c;
				float: left;
				em {
					line-height: 50px;
					padding: 0 5px;
					color: #f40;
					font-weight: 700;
					font-size: 18px;
					font-family: tohoma,arial;
				}
			}
			.pipe {
				float: left;
				margin: 0 10px 0 18px;
				width: 1px;
				height: 12px;
			}
			.price-sum {
				height: 48px;
    			color: #3c3c3c;
				float: left;
				.price {
					color: #f40;
					font-weight: 400;
					font-size: 18px;
					line-height: 48px;
					font-family: Arial;
					vertical-align: middle;
					em {
						font-weight: 700;
						font-size: 22px;
						padding: 0 3px;
						color: #f40;
						font-family: tohoma,arial;
					}
				}
			}
			.txt {
				line-height: 48px;
			}
		}
	}
</style>

<template>
	<div v-if="productLists.length > 0" class="cart-layout">
		<div class="cart-table-th">
			<div class="wp">
				<div class="th th-chk">
					
				</div>
				<div class="th th-item"><div class="td-inner">商品信息</div></div>
				<div class="th th-info"><div class="td-inner">&nbsp;</div></div>
				<div class="th th-price"><div class="td-inner">单价</div></div>
				<div class="th th-quantity"><div class="td-inner">库存</div></div>
				<div class="th th-amount"><div class="td-inner">数量</div></div>
				<div class="th th-sum"><div class="td-inner">金额</div></div>
				<div class="th th-op"><div class="td-inner">操作</div></div>
			</div>
		</div>
		<div>
			<ul class="item-content clearfix" v-for="productList in productLists" :key="productList.skuId">
				<li class="td td-chk">
					
				</li>
				<li class="td td-item">
					<div class="td-inner">
						<div class="item-pic">
							<img :src="productList.image" alt="产品图片">
						</div>
						<div class="item-info">
							<p class="sku-line">{{productList.name}}</p>
						</div>
					</div>
				</li>
				<li class="td td-info">
					<div class="td-inner">
						<p>规格：{{productList.spec}}</p>
						<p>货号：{{productList.code}}</p>
					</div>
				</li>
				<li class="td td-price">
					<div class="td-inner">
						<p class="price-item price-txt">单价：<span class="line-through">￥{{productList.price}}</span></p>
						<div class="price-item price-item-radio"><radio class="radio-item" :value="productList.discountType === 'reduce'" @on-change="changeDiscountType(productList.skuId)" size="small">优惠：</radio><input-number class="input-num" :min="Number.NEGATIVE_INFINITY" :max="parseFloat(productList.price)" v-model="productList.reduceValue" :step="1" :disabled="productList.discountType === 'percent'"  size="small"></input-number></div>
						<div class="price-item price-item-radio"><radio class="radio-item" :value="productList.discountType === 'percent'" @on-change="changeDiscountType(productList.skuId)" size="small">折扣：</radio><input-number class="input-num" :min="0" :max="1" v-model="productList.discountValue" :step="0.05" :disabled="productList.discountType === 'reduce'"  size="small"></input-number></div>
						<div class="price-item price-txt">实价：￥{{productList.discountType === 'reduce' ? (productList.price - productList.reduceValue) : (productList.price * productList.discountValue).toFixed(2)}}</div>
					</div>
				</li>
				<li class="td td-quantity">
					<div class="td-inner">
						<p>{{productList.sku ?productList.sku.quantity:0}}</p>
					</div>
				</li>
				<li class="td td-amount">
					<div class="td-inner">
						<input-number class="input-num" v-model="productList.quantity" :min="1" :max="productList.sku.quantity" :step="1" size="small"></input-number>
					</div>
				</li>
				<li class="td td-sum">
					<div class="td-inner">
						{{productList.discountType === 'reduce' ? ((productList.price - productList.reduceValue) * productList.quantity).toFixed(2) : (productList.price * productList.discountValue * productList.quantity).toFixed(2)}}
					</div>
				</li>
				<li class="td td-op">
					<div class="td-inner">
						<span class="c-primary pointer" @click="deleItem(productList.skuId)">删除</span>
					</div>
				</li> 
			</ul>
		</div>
		<div>
			<div class="float-bar-wrapper">
				<!-- <div class="bottom-select-all">
					<checkbox class="cart-checkbox" v-model="selectAll">全选</checkbox>
				</div> -->
				<div class="operations">
					<span class="c-primary pointer" @click="deleItems">清空购物车</span>
				</div>
				<div class="float-bar-right">
					<div class="amount-sum">
						<span class="txt">已选商品</span>
						<em>{{productLists.length}}</em>
						<span>件</span>
					</div>
					<div class="pipe"></div>
					<div class="price-sum">
						<span class="txt">合计（不含运费）：</span>
						<strong class="price">
							<em><span class="total-symbol">&nbsp;￥</span>{{sum}}</em>
						</strong>
					</div>
				</div>
			</div>
		</div>
	</div>
	<p v-else class="tc c-sub-color">请添加商品</p>
</template>
<script>
export default {
	props: {
		value: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			selectAll: false,
			productLists: this.value
		}
	},
	watch: {
		value: {
			handler(val) {
				this.productLists = val
			},
			deep: true
		},
		productLists: {
			handler(val) {
				this.$emit('input', this.productLists)
			},
			deep: true
		},
		selectAll(val) {
			this.productLists.forEach(it => {
				it.selected = val
			})
		}
	},
	computed: {
		sum() {
			let sum = 0
			this.productLists.forEach(it => {
				if(it.discountType === 'reduce') {
					sum += (it.price - it.reduceValue) * it.quantity
				}else {
					sum += it.price * it.discountValue * it.quantity
				}
			})
			return sum
		}
	},
	methods: {
		deleItem(skuId) {
			App.modal({
				title: '提示',
				width: 320,
				content: '确定要删除这个宝贝？',
				onOk: ()=> {
					this.productLists = _.remove(this.productLists, (it)=> {
						return it.skuId !== skuId
					})
				}
			})
		},
		deleItems() {
			App.modal({
				title: '提示',
				width: 320,
				content: '确定要清除购物车？',
				onOk: () => {
					this.productLists = []
				}
			})
		},
		//change discountType
		changeDiscountType(skuId) {
			this.productLists.forEach( it => {
				if(it.skuId === skuId) {
					if(it.discountType === 'reduce') {
						it.discountType = 'percent'
						it.reduceValue = 0
					} else {
						it.discountType = 'reduce'
						it.discount = 1
					}
				}
			})
		}
	}
}
</script>

