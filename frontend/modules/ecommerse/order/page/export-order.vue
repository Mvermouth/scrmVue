<style lang="less">
.export-order-modal {
  .ivu-modal-footer {
    border-top: none;
    padding: 0;
  }
}
</style>
<style lang="less" scoped>
.export-order-info {
  padding: 0 0 0 40px;
  font-size: 14px;
  color: #222;

  .info-detail {
    position: relative;
    margin-bottom: 10px;
    .line {
      padding-bottom: 5px;
      .filter-term {
        min-width: 250px;
        .filter-tips {
          display: inline-block;
          min-width: 70px;
        }
        .limit {
          display: inline-block;
          max-width: 120px;
          height: 21px;
          padding-left: 20px;
          padding-right: 20px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .tips {
      height: 36px;
      line-height: 36px;
      font-size: 14px;
      color: #404040;
    }

    .ope {
      padding-left: 11px;
      padding-top: 6px;
      padding-bottom: 17px;
    }
  }

  .problem-tips {
    padding-top: 23px;
    line-height: 20px;
    color: #999;
    border-top: 1px dashed #dcdcdc;
    margin-top: 10px;
  }
}

.fl {
  float: left;
}

.down-table {
  margin-top: 23px;
  padding: 10px 36px;
  height: 52px;
  background: #f5f5f5;
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
}
</style>

<template>
  <Modal title="选择生成订单条件" v-model="model" :width="width" class="export-order-modal">
    <div class="export-order-info">
        <Row type="flex" justify="start" class="info-detail">
          <Col span="12" v-for="item in itemExt" :key="item.property" class="line">
             <div class="filter-term fl">
                <div class="filter-tips fl ng-binding">{{item.label}}:</div>
                <div class="limit fl" >{{item.value}}</div>
             </div>
          </Col>
        </Row>
        <Row type="flex" justify="start" class="info-detail" style="margin-top: 20px;">
          <!-- <Form :model="formItem" :label-width="100">
            <FormItem label="生成类型">
                <RadioGroup v-model="formItem.type">
                    <Radio label="excel">EXCEL 格式文件</Radio>
                    <Radio disabled label="csv">CSV 格式文件(订单条数较多时建议选择 暂未实现)</Radio>
                </RadioGroup>
            </FormItem>
          </Form> -->
          <div class="tips fl">生成类型</div>
          <div class="ope fl">
           <RadioGroup v-model="formItem.type">
                  <Radio label="excel">EXCEL 格式文件</Radio>
                  <Radio label="csv">CSV 格式文件(订单条数较多时建议选择)</Radio>
           </RadioGroup>
           </div>
        </Row>
        <div class="problem-tips">
          <p>普通报表：以订单为维度，包含订单总价，折扣信息，收件人信息等，适合浏览订单概况时使用；</p>
          <p>温馨提示: 一次最多导出10000条的订单,当搜索条件下订单数大于10000时,请尝试优化条件，减少命中的数量!</p>
        </div>
    </div>
    <div slot="footer">
      <Row class="down-table" type="flex" justify="center">
        <Col span="4"><Button type="default" ghost @click="downOrderTable">生成普通报表</Button></Col>
      </Row>
    </div>
  </Modal>
</template>
<script>
import Order from "../../../../models/ecommerse/order";
import { constantText } from "../../../../scripts/utils/page-renders";
import { value2Text } from "../../../../scripts/utils/misc";
import { modalWidth } from "../../../../scripts/utils/ui";
import Constants from "../../../../configs/constant";
import Employee from "../../../../models/erp/employee";
export default {
  props: {
    value: {
      type: Boolean,
      required: true
    },
    criterias: {
      type: Array,
      required: true
    },
    sort: {
      type: Array,
      required: false
    }
  },
  watch: {
    value() {
      this.model = this.value;
    },
    model() {
      this.$emit("input", this.model);
    }
  },
  data() {
    return {
      model: this.value,
      width: modalWidth(document.body.clientWidth, "large"),
      loading: false,
      formItem: {
        type: "excel"
      },
      defaultItems: [
        {
          property: "sn",
          label: "订单编号",
          filter: "EQ",
          value: "-"
        },
        {
          property: "orderExtStr4",
          label: "归属平台账号",
          filter: "EQ",
          value: "-"
        },
        {
          property: "orderExtStr1",
          label: "客户平台账号",
          filter: "EQ",
          value: "-"
        },
        {
          property: "address.mobile",
          label: "收货人手机号",
          filter: "EQ",
          value: "-"
        },
        {
          property: "address.consignee",
          label: "收货人姓名",
          filter: "EQ",
          value: "-"
        },
        {
          property: "orderExtStr5",
          label: "归属员工",
          filter: "EQ",
          value: "-"
        },
        {
          property: "orderExtStrArr1",
          label: "归属部门",
          filter: "EQ",
          value: "-"
        },
        {
          property: "creatorUid",
          label: "下单人",
          filter: "EQ",
          value: "-"
        },
        {
          property: "payStatus",
          label: "支付状态",
          filter: "EQ",
          value: '-'
        },
        {
          property: "refundStatusList",
          label: "退款状态",
          filter: "EQ",
          value: '-'
        },
        {
          property: "productAmount",
          label: "商品总金额",
          filter: "GTE&LT",
          value: "-"
        },
        {
          property: "totalAmount",
          label: "订单总金额",
          filter: "GTE&LT",
          value: "-"
        },
        {
          property: "shipFee",
          label: "运费",
          filter: "GTE&LT",
          value: "-"
        },
        {
          property: "discountAmount",
          label: "优惠金额",
          filter: "GTE&LT",
          value: "-"
        },
        {
          property: "clientRemark",
          label: "客户备注",
          filter: "LIKE",
          value: "-"
        },
        {
          property: "orderItems.productName",
          label: "商品名称",
          filter: "LIKE",
          value: "-"
        },
        {
          property: "ctime",
          label: "下单时间",
          filter: "GTE&LT",
          value: "-"
        },
        {
          property: "orderStatus",
          label: "订单状态",
          filter: "EQ",
          value: "-"
        }
      ]
    };
  },
  computed: {
    itemExt() {
      const items = _.cloneDeep(this.defaultItems)
      const itemMap = _.keyBy(items, "property");
      const criterias = _.cloneDeep(this.criterias);
      criterias.forEach(it => {
        const property = it.property;
        let value = it.value;
        //先组装value
        if (value instanceof Date) {
          value = dateformat(value, "yyyy-mm-dd HH:MM:ss");
        }
        if (!itemMap[property]) {
          return;
        }
        if (!value) {
          return;
        }
        // 根据值确定展示方式
        if (property === "payStatus") {
          value = value2Text(Constants.PayStatus, value);
        }
        if (property === "orderStatus") {
          value = value2Text(Constants.OrderStatus, value);
        }
        if (property === "refundStatusList") {
          value = value2Text(Constants.RefundStatus, value);
        }
        if(property === 'totalAmount' || property === 'productAmount'|| property ==='shipFee' || property ==='discountAmount'){
          console.log("-----------------------------",property)
          value = value /100
        }

        if (it.filterType.toUpperCase() == "EQ") {
          itemMap[property].value = value;
        } else if (it.filterType.toUpperCase() == "LIKE") {
          itemMap[property].value = value;
        } else if (
          it.filterType.toUpperCase() === "GTE" ||
          it.filterType.toUpperCase() === "GT"
        ) {
          console.log(itemMap[property].value)
          itemMap[property].value = value + ' - ';
        } else if (
          it.filterType.toUpperCase() === "LT" ||
          it.filterType.toUpperCase() === "LTE"
        ) {
          itemMap[property].value = itemMap[property].value + value
        }
      })
      return items;
    }
  },
  methods: {
    downOrderTable() {
      const query = {
        filter: this.criterias,
        sort: this.sort || [],
        type: this.formItem.type
      };
      location.href = "/ecommerse/order/export?query=" + JSON.stringify(query);
    }
  }
};
</script>
