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
  padding: 0 0 0 0;
  font-size: 14px;
  color: #222;
  .alert-font {
    font-size:12px;
    padding-right:8px;
  }
  .col-md-4 {
    width: 33.33333333%;
    position: relative;
    min-height: 1px;
    padding-right: 15px;
    padding-left: 15px;
  }
  .m-b-15 {
    margin-bottom: 15px;
  }
  ul{
    display: block;
    list-style: none;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
  }
  .border-e1 {
    border: 1px solid #e1e3e3;
  }
  .text-center {
    text-align: center !important;
  }
  .p-10 {
    padding: 10px;
  }
  .block {
    display: block;
  }
  li{
    float: left;
    list-style: none;
  }
  a {
    color: #333;
    text-decoration: none
  }
  .m-t-15 {
    margin-top: 15px;
  }
  .padding-5 {
      padding:10px 10px 10px 10px;
  }
  .text-warning {
    color: #8a6d3b;
} 
 .p-l-15 {
    padding-left: 15px;
 }
 .m-t-20 {
    margin-top: 20px !important;
  }

element.style {
}
.btn-fff {
    background-color: #fff;
    border: 1px solid #e1e3e3;
}
.w-85 {
    width: 85px;
}
.border-radius-0 {
    border-radius: 0 !important;
}
.m-l-10 {
    margin-left: 10px;
}
}
</style>

<template>
  <Modal v-model="model" title="绑定店铺" @on-cancel="closeModal" :width="width">
    <div class="export-order-info">
          <Alert class="alert-font">
              店铺初次绑定只同步三个月内的数据，三个月前数据需要下载历史订单上传。
          </Alert>
          <!-- <Row type="flex" justify=“center”>
             <Col span="8" offset="8"> -->
                <i-form class="form" ref="form" :model="form" :label-width="120">
                    <form-item label="选择平台">  
                        <!-- <Select v-model="form.platformId">
                            <Option v-for="item in constant2Array(Constant.ShopMap)" :value="item.value" :key="item.value">{{ item.text }}</Option>
                        </Select> -->
                          <RadioGroup v-model="form.platformId" type="button">
                              <Radio v-for="item in constant2Array(Constant.ShopMap)" :label="item.value" :disabled="item.disabled">{{item.text}}</Radio>
                          </RadioGroup>
                    </form-item>
                    <form-item label="店铺名称">
                        <Input v-model="form.title" placeholder="请输入店铺名称"></Input>
                    </form-item>
                    <form-item label="店铺ID">
                        <Input v-model="form.outerShopId" placeholder="请输入店铺ID"></Input>
                    </form-item>
                </i-form>
                <div class="m-t-20 p-10 text-center">
                  <Button type="primary" :loading="loading" @click="bindShop">店铺授权</Button>
                  <Button @click="cancel">取消</Button>
			          </div>
            <!-- </Col>
          </Row> -->
    </div>
    <div slot="footer">
    </div>
  </Modal>
</template>
<script>
import Shop from "../../../../models/ecommerse/shop";
import { constantText } from "../../../../scripts/utils/page-renders";
import { value2Text,constant2Array } from "../../../../scripts/utils/misc";
import { modalWidth } from "../../../../scripts/utils/ui";
import Constant from "../../../../configs/constant";
import Employee from "../../../../models/erp/employee";
export default {
  props: {
    value: {
      type: Boolean,
      required: true
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
      constant2Array: constant2Array,
      Constant: Constant,
      model: this.value,
      width: modalWidth(document.body.clientWidth, "small"),
      loading:false,
      form:{
        platformId: 'youzan',
        title:'',
        outerShopId:''
      }
    };
  },
  computed: {
  },
  methods: {
    closeModal(){
      console.log("close:")
      this.model =false
    },
    async bindShop(){
      console.log("bindShop")
      if(!this.form.title){
        this.$Message.error("请填写店铺名称")
        return
      }
      if(!this.form.outerShopId){
        this.$Message.error("请填写店铺的ID")
        return
      }
      this.loading = true
      let shop 
      const shopPage = await Shop.page(1,1,[{filterType:'EQ',property:"outerShopId",value:this.form.outerShopId}],[])
      if(_.isEmpty(shopPage.content)){
          shop = await Shop.create(this.form)
      }else {
          shop = shopPage.content[0]
      }
      this.loading = false
      App.push(`${Shop.baseUrl}/bind/${shop.id}`)
      this.model =false
    },
    cancel(){
      this.model = false
      this.form.title = '',
      this.form.outerShopId = ''
    }
  }
};
</script>
