<style lang="less" scoped>
ul {
  margin: 0;
  padding: 0;
  font-weight: 400;
  list-style: none;
  font-style: normal;
}
li {
  display: list-item;
  text-align: -webkit-match-parent;
}

.order-list {
  margin-top: 10px;
  .order-list-header {
    margin-bottom: 11px;
    height: 40px;
    line-height: 40px;
    background: #f7f7f7;
    border-radius: 2px;
    font-size: 14px;
    color: #404040;

    ul li {
      text-align: center;
      float: left;
    }

    ul li.order-info {
      width: 30%;
    }
    ul li.address-info {
      width: 30%;
    }
    ul li.platform-info {
      width: 25%;
    }
    ul li.opt {
      width: 15%;
    }
  }
}
</style>
<template>
    <div class="order-list">
        <div class="order-list-header">
            <ul>
                <li class="order-info">订单信息</li>
                <li class="address-info">收货信息</li>
                <li class="platform-info">平台信息</li>
                <li class="opt">操作</li>
            </ul>
        </div>
        <OrderListItem v-for="item in itemExs" :key="item[idKey]" :order="item"/>
    </div>
</template>

<script>
import OrderListItem from "./order-list-item.vue";
import Constants from '../../../../configs/constant';
import { value2Text } from '../../../../scripts/utils/misc';

export default {
  components: {
    OrderListItem
  },
  props: {
    idKey: {
      type: [String, Number]
    },
    items: {
      type: Array
    }
  },
  computed: {
    itemExs() {
      // TODO 这里可以扩展获取其它的数据进行组装
      this.items.forEach(it => {
          if(!_.isEmpty(it.refundOrders)){
            const refundOrders = it.refundOrders
            let refundOrderItemMap = {}
            refundOrders.forEach(it1 => {
                const rOrderItems = it1.orderItems
                const status = it1.status
                const refundId = it1.id
                const type = it1.type
                rOrderItems.forEach(it2 => {
                    const refundSku = {
                          quantity:it2.quantity,
                          refundStatus: status,
                          refundId:refundId
                    }
                    refundSku.text = this.getRefundText(type,status,refundSku.quantity)
                    if(refundOrderItemMap[it2.skuId]){
                        refundOrderItemMap[it2.skuId].push(refundSku)
                    }else {
                        refundOrderItemMap[it2.skuId] = [refundSku]                  
                    }              
                })
            })
            it.orderItems.forEach(it1 => {
                const skuId = it1.skuId
                if(refundOrderItemMap[skuId]){
                  it1.skuRefunds = refundOrderItemMap[skuId]
                }
            })
            // console.log("it.orderItems:",it.orderItems)
          }
      })
      return this.items
    }
  },
  data() {
    return {}
  },
  methods: {
    getRefundText(refundType,refundStatus,quantity){
        if(refundType ==='refund'&& refundStatus ==='pending'){
          return `退款中 x${quantity}`
        }
        if(refundType ==='refund'&& refundStatus ==='refunding'){
          return `退款中 x${quantity}`
        }
        if(refundType ==='refund'&& refundStatus ==='unconfirmed'){
          return `退款审核不通过 x${quantity}`
        }
        if(refundType ==='refund'&& refundStatus ==='completed'){
          return `退款完成 x${quantity}`
        }
        if(refundType ==='return'&& refundStatus ==='pending'){
          return `退货中 x${quantity}`
        }
        if(refundType ==='return'&& refundStatus ==='refunding'){
          return `退货中 x${quantity}`
        }
        if(refundType ==='return'&& refundStatus ==='unconfirmed'){
          return `退货审核不通过 x${quantity}`
        }
        if(refundType ==='return'&& refundStatus ==='completed'){
          return `退货完成 x${quantity}`
        }
    }
  }
};
</script>
