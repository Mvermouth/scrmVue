<style lang="less">
.list-content-item {
  position: relative;
  padding-bottom: 8px;
  padding-top: 8px;
  border-bottom: 1px solid #ededed;
}
.cpc-item-main-con {
  overflow: visible;
}

.cpc-item-main-con:after {
  content: " ";
  float: none;
  clear: both;
  display: block;
}

.cpc-item-checkbox {
  float: left;
  width: 10%;
  position: relative;
  min-height: 1px;
}

.cpc-item-cell {
  float: left;
  width: 10%;
  position: relative;
  min-height: 1px;

  a:first-child,
  span:first-child {
    padding-top: 15px;
  }

  .cpc-item-image-desc:first-child {
    min-height: 80px;
    display: block;
    padding-left: 130px;
    padding-top: 0;
  }

  .cpc-item-image-desc {
    .img {
      position: absolute;
      left: 30px;
      width: 80px;
      height: 80px;
    }
  }

  a {
    color: #3e3e3e;
    text-decoration: none;
  }

  a,
  span {
    font-size: 14px;
    text-align: center;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cpc-item-desc {
    padding: 15px;
    font-size: 14px;
    line-height: 20px;
    display: block;
    text-align: left;

    .top {
      color: #b83126;
      margin-right: 5px;
    }

    div {
      display: inline-block;
    }
  }
}

.cpc-item-cell.cpc-item-opt {
  a {
    color: #00a0e9;
    margin-bottom: 4px;
  }
}

.cpc-item-sku-con {
  overflow: hidden;
  position: relative;
  margin-top: 4px;
}

.cpc-item-sku-con:after {
  position: absolute;
  top: 0;
  left: 18%;
  right: 30%;
  height: 1px;
  content: " ";
  background: #ededed;
}

.sku-show-toggle {
  padding: 0.375rem 1rem;
  display: block;
  width: 40%;
  text-align: center;
  color: #00a0e9;
  font-size: 14px;
}
</style>
<template>
	<div ng-repeat="item in ctrl.items track by $index" class="list-content-item ng-scope">
    	<div class="cpc-item-main-con">
        	<div class="cpc-item-checkbox" style="width:3%;padding-left:8px">
            	<Checkbox v-model="product['_checked']" @on-change="(val) => {this.$emit('change', val)}"></Checkbox>
			  </div>
          	<div class="cpc-item-cell" style="width:37%;">
        		<div class="cpc-item-image-desc" href="javascript:void(0)">
					<div class="img" ng-class="{private : item.is_private_item,certification_invalid:item.is_certification_invalid_item &amp;&amp; item.status != 1}">
                		<img width="80" height="80" :src="productImage">

						<!-- 后面再重构 -->
						<div v-show="false" class="qrcode-con" click="ctrl.handleClickQR( $event )">
							<div class="qrcode-inner">
								<!-- qrcode :text="productImage" :size="100"/-->
								<div class="tip1">手机扫描二维码<br>预览商品</div>
							</div>
						</div>
					</div>

              <div class="cpc-item-desc">
                		<div v-if="product.isTop" class="top">[店长推荐]</div>
						        <div class="item-name">{{product.name}}</div>
              </div>
            	</div>
          	</div>
          
		  	<div class="cpc-item-cell">
				<span>&nbsp;</span>
        </div>
        <div class="cpc-item-cell">
            	<span class="ng-binding">{{totalSold}}</span>
        </div>
          <div class="cpc-item-cell">
          <!-- <span>
            <template v-if="product.stock">{{product.stock}}</template>
            <template v-else>分仓展示</template>
          </span> -->
                <span class="ng-binding">{{totalStock}}</span>
          	</div>
          	<div class="cpc-item-cell">
            	<span v-for="(category, index) in product.categories" :key="product.id + '-c' + index">{{category.name}}</span>
          	</div>
          	<div class="cpc-item-cell">
        		<span>{{dateformat(product.ctime)}}</span>
          	</div>

			<div class="cpc-item-cell cpc-item-opt">
            	<a @click="$emit('action', 'update', product)">编辑</a>
				<a v-if="!product.onSale" @click="$emit('action', 'up_shelf', product)">上架</a>
				<a v-else @click="$emit('action', 'down_shelf', product)">下架</a>

            	<a @click="() => $emit('action', 'delete', product)">删除</a>
          	</div>
		</div>

		<div v-if="product.skus && product.skus.length" class="cpc-item-sku-con">
			<div v-for="(sku, index) in product.skus" :key="product.id + '-sku-' + index" v-show="index < 0 || showAllSku">
            	<div class="cpc-item-cell" style="width:37%;margin-left:3%;">
              		<span>{{skuTitle(sku.specs)}}</span>
            	</div>
            	<div class="cpc-item-cell">
              		<span>¥{{sku.price}}</span>
            	</div>
            	<div class="cpc-item-cell">
              		<span>{{sku.soldCount||0}}</span>
            	</div>
            	<div class="cpc-item-cell">
              		<span>{{sku.stock||0}}</span>
            	</div>
            	<div style="clear: both;"></div>
          	</div>
        </div>
        
		<a v-if="product.skus && product.skus.length > 0" @click="() => { this.showAllSku = !this.showAllSku }" class="sku-show-toggle">
        	<span v-show="!showAllSku">共<span>{{product.skus.length}}</span>个型号，点击展开</span>
        	<span v-show="showAllSku">点击收回</span>
        </a>
    </div>
</template>

<script>
import _ from "lodash";

import defaultAvatar from "../../../../images/default-avatar.png";

// import qrcode from 'vue-qrcode.js'

export default {
  components: {
    // qrcode
  },
  props: {
    product: {
      type: Object
    }
  },
  data() {
    return {
      showAllSku: false,
      defaultAvatar: defaultAvatar
    };
  },
  computed: {
    totalSold() {
      if (this.product.skus && this.product.skus.length > 0) {
        const soldResult = _.sumBy(this.product.skus, "soldCount")
        return soldResult
      }
      return this.product.sold;
    },
    totalStock(){
      if (this.product.skus && this.product.skus.length > 0) {
        const stockResult = _.sumBy(this.product.skus, "stock")
        return stockResult
      }
      return this.product.stock;
    },
    productImage() {
      return this.product.image|| defaultAvatar;
    },
    filterOrderActions() {
      return [];
    }
  },
  methods: {
    skuTitle(specs) {
      return specs.join(";");
    },
    dateformat(timestamp) {
      return dateformat(new Date(timestamp), "yyyy-mm-dd HH:MM:ss");
    }
  }
};
</script>