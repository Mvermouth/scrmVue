<template>
  <div class="order">
    <div class="order-header">
      <div class="fl">
        <!-- ngIf: param.statusList[0] == 'all' || param.statusList[0] == 'unpaid' || param.statusList[0] == 'unpaid' || param.statusList[0] == 'success' || param.statusList[0] == 'close' -->
        <span
          ng-if="param.statusList[0] == 'all' || param.statusList[0] == 'unpaid' || param.statusList[0] == 'unpaid' || param.statusList[0] == 'success' || param.statusList[0] == 'close'"
          class="divide"
        >下单时间：{{dateformat(order.ctime)}}</span>
        <!-- end ngIf: param.statusList[0] == 'all' || param.statusList[0] == 'unpaid' || param.statusList[0] == 'unpaid' || param.statusList[0] == 'success' || param.statusList[0] == 'close' -->
        <!-- ngIf: param.statusList[0] == 'paid' -->
        <!-- ngIf: param.statusList[0] == 'shipped' -->
        <span class="divide">订单号：{{order.sn}}</span>
        <span class="divide search-status">{{displayOrderStatus}}</span>
      </div>
      <div class="fr">
        <span class="divide">共{{totalItemQuantity}}件商品</span>
        <span class="divide">
          合计：¥{{order.totalAmount}}
          (
          <!-- template v-if="order.discountAmount>0">优惠：¥{{order.discountAmount}}</template-->
          <template v-if="order.shipFee>0">含运费：¥{{order.shipFee}}</template>
          <template v-else>免运费</template>)
        </span>
        <span class="divide">已支付：¥{{order.payAmount}}</span>
        <span>待支付：¥{{order.totalAmount - order.payAmount}}</span>
      </div>
    </div>
    <table class="order-info-detail">
      <tbody>
        <tr>
          <td class="order-goods-info">
            <div class="goods-wrapper">
              <div v-for="orderItem in displayOrderItems" :key="orderItem.id" class="goods-detail">
                <div class="goods-img fl">
                  <!-- 这里需要封装个组件展示默认图片 -->
                  <img :src="order_item_image(orderItem.image)">
                </div>
                <div class="goods-info fl">
                  <div class="goods-info-one fl">
                    <p class="goods-news">{{orderItem.productName}}</p>
                    <p
                      class="goods-model"
                      ng-if="orderItem.skuTitle"
                    >型号：{{skuTitle(orderItem.skuTitle)}}</p>
                    <div v-for="(item, i) in orderItem.skuRefunds" :key='i' class="goods-refund">
                      <a @click="onClickRefund(item)">
                        <span style="color:#fd4337">{{item.text}}</span>
                      </a>
                    </div>
                    <div>
                      <div class="clear"></div>
                    </div>
                  </div>
                  <div class="goods-info-two fr">
                    <p class="goods-price">单价：¥{{orderItem.price}}</p>
                    <p>数量：{{orderItem.quantity}}</p>
                    <!-- <p v-if="orderItem.refundQuantity">{{orderItem.refundQuantity}}</p> -->
                  </div>
                  <div class="clear"></div>
                </div>
                <div class="clear"></div>
                <!-- ngIf: good.priceDesc -->
              </div>
              <!-- end ngRepeat: good in order.itemList -->
            </div>
            <!-- ngIf: order.itemList.length > 3 -->
          </td>
          <td class="order-address-info">
            <p
              class="order-address-buyer ng-binding"
            >{{order.address.consignee}} {{order.address.mobile}}</p>
            <p
              class="order-address-detail ng-binding"
            >{{order.address.state}} {{order.address.city}} {{order.address.district}} {{order.address.address}}</p>
            <!-- ngIf: order.receiver.orderNum > 1 -->
            <!-- ngIf: order.receiver.idCardNo -->
            <!-- ngIf: order.receiver.buyerNote -->
            <!-- ngRepeat: info in order.customInfo -->
            <p class="express-note-tips">
              买家备注：
              <span>
                <span class="express-note-tips">
                  <span
                    class="customer-note-color"
                    v-show="order.clientRemark"
                  >{{order.clientRemark}}</span>
                </span>
              </span>
            </p>
            <!-- <p class="express-note-tips">
              支付方式：
              <span>{{order.payText}}</span>
            </p> -->
            <p class="express-note-tips">
              物流单号：
              <span>{{(order.shipNos||[]).join(',')}}</span>
            </p>
            <p class="express-note-tips">
              订单类型：
              <span>{{(order.orderTags||[]).join(',')}}</span>
            </p>
          </td>
          <td class="order-platform-info">
            <!-- 展示平台信息 -->
            <div v-if="order.platformId == 'TencentWX'">
              <p>
                <span>员工: {{employeeName}}</span>
              </p>
              <p>
                <span>部门: {{departmentName}}</span>
              </p>
              <p>
                <span>客户来源: 微信</span>
              </p>

              <template v-if="order.metadata.contact">
                <p>
                  <span>归属微信号: {{order.orderExtStr3}}</span>
                </p>
                <p>
                  <span>昵称: {{order.metadata.contact.nickname}}</span>
                </p>
                <p>
                  <span>
                    微信号:
                    <a
                      @click="handleClickContact(order.metadata.profile.contactID, order.metadata.contact.id, order.metadata.profile.nickname)"
                    >{{order.metadata.contact.customID}}</a>
                  </span>
                </p>
              </template>
              <template v-else>
                <h1>数据需要修复</h1>
              </template>
            </div>
            <div v-else-if="order.platformId == 'youzan'">
              <p>
                <span>平台: 有赞</span>
              </p>
              <p>
                <span>店铺: {{order.shopId}}</span>
              </p>
            </div>
            <div v-else>
              <p>
                <span>没有客户信息</span>
              </p>
              
            </div>
          </td>
          <td class="order-creator">
            <span class="creator">{{order.creator.name}}({{order.creator.sn}})</span>
          </td>
          <td class="order-opt-info">
            <div ng-repeat="btn in order.buttons" class="ng-scope">
              <!-- ngIf: btn.type == 1 && btn.url -->
              <!-- ngIf: btn.url == 'contactBuyer' -->
              <div v-for="action in filterOrderActions" :key="order.id + '-' + action">
                <a @click="handleOrderAction(action)" :style="getDisplayOrderActionStyle(action)" >{{displayOrderAction(action)}}</a>
              </div>

              <!--
                            <div ng-if="btn.url == 'contactBuyer'" data-for-gaq="订单管理-联系买家" class="ng-scope">
                                <a judge-im="" im-flag="imState.imFlag" buyer-id="order.receiver.buyerId" target="_blank" data-spider-mode="none" class="ng-binding ng-isolate-scope">联系买家</a>
                            </div>
              -->
              <!-- end ngIf: btn.url == 'contactBuyer' -->
              <!-- ngIf: btn.url == 'changePrice' -->
              <!-- ngIf: btn.url == 'closeTransaction' -->
              <!-- ngIf: btn.url == 'delayTime' -->
              <!-- ngIf: btn.url == 'deliverGoods' -->
              <!-- ngIf: btn.url == 'verify' -->
            </div>
            <div v-if="isExceptionOrder" >
              <a @click="handleOrderExceptionClick()" style="color:red;" >问题描述</a>
            </div>
            <!-- end ngRepeat: btn in order.buttons -->
          </td>
        </tr>
      </tbody>
    </table>
    <!-- ngIf: order.preSell -->
    <!-- ngRepeat: info in order.contactInfo -->
  </div>
</template>

<script>
import _ from "lodash";
import AppRoutes from "../../../../configs/AppRoutes";
import AppProxy from "../../../../scripts/common/appProxy";
import Constant from "../../../../configs/constant.js";
import Payment from "../../../../models/ecommerse/payment";
import orderActions from "./actions";
import defaultAvatar from "../../../../images/default-avatar.png";
import {
  value2Text,
  hightlightSensitiveWord,
  value2Url,
  stringLength
} from "../../../../scripts/utils/misc";

const paymentChannels = _.keys(Constant.PaymentChannel).map(it => Constant.PaymentChannel[it])
const orderChannels = _.keys(Constant.OrderChannel).map(it => Constant.OrderChannel[it])
const paymentChannelMap = paymentChannels.reduce((map, it) => {
	map[it.value] = it.text
	return map
}, {})
export default {
  props: {
    list: {
      type: Object
    },
    order: {
      type: Object
    }
  },
  data() {
    return {
      AppProxy: AppProxy,
      AppRoutes: AppRoutes,
      Constant: Constant,
      paymentChannels:paymentChannels,
      paymentChannelMap:paymentChannelMap,
      orderChannels:orderChannels,
      defaultAvatar: defaultAvatar
    };
  },
  computed: {
    displayOrderItems() {
      let item = this.order.orderItems ? this.order.orderItems[0] : null;
      return item ? [item] : [];
    },
    isExceptionOrder() {
      // return (this.order.allowedActions || []).concat('view','update','refund', 'delivery');
      return this.order.orderStatus === Constant.LibOrderStatus.exception.value;
    },
    filterOrderActions() {
      // return (this.order.allowedActions || []).concat('view','update','refund', 'delivery');
      return this.order.allowedActions || [];
    },
    displayOrderStatus() {
      const OrderTabs = Constant.OrderTabs;
      if(this.order.refundOrders && this.order.refundOrders.length > 0) {
        // todo... 特殊情况特殊处理下
        return OrderTabs['refund'].text;
      }
      else {
        let item = null;
        for(let k in OrderTabs){
          let val = OrderTabs[k];
          let matched = true;
          val.filter.forEach(element => {
            let filterType = element.filterType;
            let value = element.value;
            let property = element.property;
            let ev = this.order[property];
            if(filterType === 'IN'){
              if(Array.isArray(value)){
                matched = value.indexOf(ev) !== -1;
              }
              else {
                if(ev !== value){
                  matched = false;
                }
              }
            }
            else if(filterType === 'EQ'){
              
              if(ev !== value){
                matched = false;
              }
            }
            else if(filterType === 'NE'){
              
              if(Array.isArray(value)){
                matched = value.indexOf(ev) === -1;
              }
              else if(ev === value){
                matched = false;
              }
            }
            
          });
          if(matched){
              item = val;
          }
        }
        return item && item.text;
      }

      return '';
      
      // return value2Text(Constant.OrderStatus, this.order.orderStatus);
    },
    totalItemQuantity() {
      return _.sumBy(this.order.orderItems, "quantity");
    },
    employeeName() {
      if (this.order.metadata.employee) {
        const employee = this.order.metadata.employee;
        return employee.name + "(" + employee.sn + ")";
      }
      return "";
    },
    departmentName() {
      if (
        this.order.metadata.employee &&
        this.order.metadata.employee.departments
      ) {
        const departments = this.order.metadata.employee.departments;
        return departments.map(it => it.name).join(",");
      }
      return "";
    }
  },
  methods: {
    skuTitle(skuTitle) {
      try {
        const skus = JSON.parse(skuTitle);
        skuTitle = skus.map(it => it["v"]).join(",");
      } catch (e) {}
      return skuTitle;
    },
    order_item_image(image) {
      if (!image) return defaultAvatar;
      return image;
    },
    dateformat(timestamp) {
      return dateformat(new Date(timestamp), "yyyy年mm月dd日 HH:MM:ss");
    },
    displayOrderAction(action) {
      let actionObj = orderActions[action];
      if (actionObj) {
        return actionObj.title;
      } else {
        return "未知";
      }
    },
    getDisplayOrderActionStyle(action){
      let actionObj = orderActions[action];
      if (actionObj) {
        return {color: actionObj.color};
      } else {
        return {color: '#00a0e9'};
      }
    },
    onClickRefund(item) {
      // const refundOrder = this.order.refundOrders.find(it=>{return it.id === item.refundId})
      // App.modal({
      // 		width: 900,
      // 		render: h => {
      // 			h = this.$root.$createElement
      // 			return <view-refund-details refundOrder={refundOrder}></view-refund-details>
      // 		}
      // 	}, 'info')
      const url = AppRoutes.OrderRefund.retrieve(item.refundId);
      AppProxy.do_push(url);
    },
    handleClickContact(fromId, toId, title) {
      const url = AppRoutes.ChatSession.findByFromIdAndToIdAndTimeGTE(
        fromId,
        toId,
        new Date(this.order.ctime),
        title
      );
      AppProxy.do_push(url);
    },
    load() {
      alert("要刷新table");
    },
    handleOrderExceptionClick() {
      App.modal({
        width: 400,
        // title: '问题描述',
        render: h => {
          h = this.$createElement
          const str = this.order.orderExtStr6;
          return <div class="exception-info" style="color:red;" >{ str }</div>
        },
        onOk: async () => {
        }
      }, 'info')
    },
    handleOrderAction(action) {
      let actionObj = orderActions[action];
      if (actionObj) {
        actionObj.onAction.call(this, this, this.order);
      }
    }
  }
};
</script>

<style lang="less">
.clear {
  clear: both;
}
.fl {
  float: left;
}
.fr {
  float: right;
}

.customer-note-color {
  color: #fd4337;
}

.order {
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 2px;

  .order-header {
    padding: 0 20px;
    height: 40px;
    line-height: 40px;
    background: #f4f5f9;
    font-size: 14px;
    color: #404040;
    position: relative;

    .search-status {
      color: #fd4337;
      text-align: center;
    }

    span.divide {
      padding-right: 28px;
    }
  }

  .order-info-detail {
    width: 100%;
    font-size: 14px;
    border-spacing: 0;

    .order-goods-info {
      width: 40%;
      min-height: 116px;
      padding: 0;
      border-right: 1px solid #e6e6e6;
      vertical-align: top;
      color: #404040;

      .goods-wrapper {
        max-height: 500px;
        overflow: hidden;
        position: relative;
        overflow-y: auto;
      }

      .goods-detail {
        min-height: 120px;
        padding: 16px 0 0 0;
        margin: 0 auto;
        padding-left: 20px;
        border-bottom: 1px solid #f6f6f6;

        .goods-img {
          width: 64px;
          height: 64px;
          img {
            width: 100%;
            height: 100%;
          }
        }

        .goods-info {
          padding-left: 114px;
          padding-top: 4px;
          width: 100%;
          position: absolute;
          box-sizing: border-box;
          padding-right: 40px;

          .goods-info-one {
            width: 70%;
          }

          .goods-news {
            height: 22px;
            line-height: 18px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .goods-model {
            padding: 3px 0;
            line-height: 18px;
            color: #737373;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .goods-refund {
            padding: 3px 0;
            line-height: 18px;
            color: #fd4337;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .goods-price {
            color: #111;
            font-size: 14px;
            padding-bottom: 5px;
          }
        }
      }
    }

    .order-address-info {
      width: 25%;
      padding: 15px 20px;
      border-right: 1px solid #e6e6e6;
      color: #404040;
      vertical-align: top;
    }

    .order-platform-info {
      width: 15%;
      padding: 15px 20px;
      border-right: 1px solid #e6e6e6;
      color: #404040;
      vertical-align: top;
    }

    .order-creator {
      width: 10%;
      padding: 15px 0;
      border-right: 1px solid #e6e6e6;
      color: #404040;
      vertical-align: top;
      text-align: center;
      color: rgb(253, 67, 55);
    }

    .order-opt-info {
      width: 10%;
      vertical-align: top;
      padding: 15px 0;

      div {
        text-align: center;

        a {
          height: 20px;
          line-height: 20px;
          font-size: 14px;
          color: #00a0e9;
          margin-top: 4px;
        }
      }
    }
  }
}
</style>
