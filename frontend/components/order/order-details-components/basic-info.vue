

<template>
	<div>
		<div class="user-info">
			<description-info :descriptionInfos="userInfos" :layout="{xs:24,sm:12,md:8,lg:8}"></description-info>
		</div>
		<div class="product-info">
			<tabs value="product_info">
				<tab-pane label="商品信息" name="product_info"></tab-pane>
    		</tabs>
			<no-paginator-page  v-bind="domainPageProps"></no-paginator-page>
		</div>
		<div class="basic-info">
			<tabs value="basic_info">
				<tab-pane label="订单信息" name="basic_info"></tab-pane>
    		</tabs>	
			<description-info :descriptionInfos="createrOrderInfos" :layout="{xs:24,sm:12,md:12,lg:12}"></description-info>
    </div>
    <div v-if="!!exceptionDes" >
      <span style="color:red;">{{ exceptionDes }}</span>
    </div>
	</div>
</template>
<script>
import DescriptionInfo from "../description-info.vue";
import Inventory from "../../../models/ecommerse/inventory.js";
import NoPaginatorPage from "../../../views/domain/no-paginator-page.vue";
import Constant from "../../../configs/constant.js";
import defaultAvatar from '../../../images/default-avatar.png'
import { constantText } from '../../../scripts/utils/page-renders';
import { value2Text } from '../../../scripts/utils/misc';
const width = App.options.styles.table.width;
export default {
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  components: {
    NoPaginatorPage,
    DescriptionInfo
  },
  data() {
    return {
      domainPageProps: {
        loadPage: async () => {
          return {
            pageNo: 1,
            pageSize: 20,
            total: this.order.orderItems.length,
            content: this.order.orderItems
          };
        },
        columns: [
          {
            key: "productName",
            title: "商品名称",
            align: "left",
            width: width.w_18,
            render(h, context) {
              const image = context.row.image||defaultAvatar;
              return (
                <div style="margin: 10px 0">
                  <div style="width: 80px; height: 80px; display: inline-block; vertical-align: top;">
                    <img style="width: 100%; height: 100%" src={image || ""} />
                  </div>
                  <div style="margin-left: 20px;display: inline-block; vertical-align: top;">
                    {context.row.productName}
                  </div>
                </div>
              );
            }
          },
          {
            key: "skuTitle",
            title: "规格",
            align: "left",
            width: width.w_10
          },
          {
            key: "price",
            title: "价格",
            align: "left",
            width: width.w_10,
            render(h, context) {
              const row = context.row;
              return (
                <div>
                  <p>
                    原价：<span style="text-decoration: line-through;">{`￥${
                      row.price
                    }`}</span>
                  </p>
                  <p>
                    {row.discountType === "reduce"
                      ? `优惠：${row.discountValue}`
                      : `折后：${row.discountValue}`}
                  </p>
                  <p>
                    实价：{row.discountType === "reduce"
                      ? row.price - row.discountValue
                      : row.price * row.discountValue}
                  </p>
                </div>
              );
            }
          },
          {
            key: "totalAmount",
            title: "数量/总额",
            align: "left",
            width: width.w_10,
            render(h, context) {
              const row = context.row;
              let totalAmount = row.price * row.quantity
              if(row.discountType === "reduce"){
                totalAmount = (row.price - row.discountValue)* row.quantity
              }else if(row.discountType === "percent"){
                totalAmount = row.price * row.discountValue * row.quantity
              }
              return (
                <div>
                  <p>数量：{`x${row.quantity}`}</p>
                  <p>总金额：{totalAmount}</p>
                </div>
              );
            }
          }
        ]
      }
    };
  },
  computed: {
    createrOrderInfos() {
      //商品总金额
      const productsAmount = this.order.orderItems.reduce((sum, it) => {
        sum += it.totalAmount;
        return sum;
      }, 0);
      const platform = value2Text(Constant.PlatformMap,this.order.platformId)
      return [
        { 创建者: this.order.metadata.createName || "" },
        { 商品金额: productsAmount },
        { 订单编号: this.order.sn },
        { 优惠金额: this.order.discountAmount },
        { 下单时间: dateformat(this.order.ctime, "yyyy-mm-dd HH:MM:ss") },
        { 运费: this.order.shipFee || 0 },
        { 订单来源: platform||"" },
        { 订单总金额: this.order.totalAmount }
      ];
    },
    userInfos() {
      return [
        { 收货人: this.order.address.consignee || "" },
        { 联系方式: this.order.address.mobile || "" },
        { 发货时间: dateformat("yyyy-mm-dd HH:MM:ss") },
        {
          地区: `${this.order.address.state}、${this.order.address.city}、${
            this.order.address.district
          }`
        },
        { 地址: this.order.address.address || "" },
        { 邮编: this.order.address.zipCode || "" },
        { 买家备注: this.order.clientRemark || "" }
      ];
    },
    exceptionDes(){
      if(this.order.orderExtStr6){
        return this.order.orderExtStr6;
      }
      else {
        return false;
      }
    }
  }
};
</script>

