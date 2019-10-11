<style lang="less" scoped>
   .m-t-20 {
    margin-top: 20px !important;
  }
  .p-10 {
    padding: 10px;
  }
  .text-center {
    text-align: center !important;
  }
</style>

<template>
    <div>
        <div>
            <i-form class="form" ref="form" :model="shop" :label-width="120">
                <form-item label="店铺平台">  
                    <P>{{shopMap[shop.platformId]}}</p>
                </form-item>
                <form-item label="店铺名称">
                    <p>{{shop.title}}</p>
                </form-item>
                <form-item label="店铺ID">
                    <p>{{shop.outerShopId}}</p>
                </form-item>
                <form-item label="店铺简介">
                    <p>暂无简介</p>
                </form-item>
                <form-item label="创建时间">
                    <p>{{ctime}}</p>
                </form-item>
            </i-form>
            <div class="m-t-20 p-10 text-center">
                  <Button type="primary" @click="syncOrder">同步订单</Button>
                  <Button>取消</Button>
			      </div>
        </div>
    </div>
</template>

<script>
import Constant from "../../../../configs/constant"
import Shop from "../../../../models/ecommerse/shop"
const ShopPlatforms = _.keys(Constant.ShopMap).map(it=> Constant.ShopMap[it])
const shopMap = ShopPlatforms.reduce((map, it) => {
	map[it.value] = it.text
	return map
}, {})
const shop = App.data.domain
export default {
  data() {
    return {
      shop:shop,
      shopMap:shopMap,
      ctime: dateformat(shop.ctime,'yyyy-mm-dd HH:MM:ss'),
      constant:Constant
    };
  },
  methods: {
      async syncOrder(){
        console.log("syncOrder start")
      }
  }
};
</script>
