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
    font-size:12px
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
  <Modal v-model="model" :closable="false" @on-cancel="closeModal" :width="width" class="export-order-modal">
    <div class="export-order-info">
      <tabs :value="addMethod">
        <tab-pane label="选择平台" name="selectPlatform">
          <Alert class="alert-font">
              店铺初次绑定只同步三个月内的数据，三个月前数据需要下载历史订单上传。
          </Alert>
          <p class="text-warning p-l-15">温馨提示：添加淘宝店铺；相关ERP请至官网联系客服。</p>
          <ul class="m-t-15">
          <li class="col-md-4 m-b-15 ng-scope">
	          <a class="block p-10 border-e1 text-center ng-scope" >
						  <img ng-src="/images/jingdong.png" alt="" width="135px" height="55px" src="/img/jingdong.png">
					  </a>
					<p class="text-center m-t-5 ng-binding">
                        京东店铺
					</p>
				  </li>
          <li class="col-md-4 m-b-15 ng-scope">
            <a class="block p-10 border-e1 text-center ng-scope">
              <img ng-src="/images/youzan.png" alt="" width="135px" height="55px" src="/img/youzan.png">
            </a>
            <p class="text-center m-t-5 ng-binding">
                          有赞店铺
            </p>
          </li>
        </ul>
        </tab-pane>
        <tab-pane label="授权到期提醒" name="license">
            <div class="f-s-14 m-t-20">
            <Row type="flex" justify=“center”>
             <Col span="8" offset="8">
                <i-form class="form" ref="form" :model="form" :label-width="120">
                    <form-item label="授权到期前">
                        <Select v-model="form.beforeExpireDay">
                            <Option v-for="item in beforeExpire" :value="item" :key="item">{{ item }}</Option>
                        </Select>
                    </form-item>
                    <form-item label="提醒方式">
                        <Select v-model="form.notifyType">
                            <Option value="sms">短信提醒</Option>
                        </Select>
                    </form-item>
                    <form-item label="接受手机号">
                        <Input v-model="form.mobile" placeholder="请输入手机号"></Input>
                    </form-item>
                </i-form>
                <div class="m-t-20 p-10 text-center">
                  <Button type="primary">保存</Button>
                  <Button>取消</Button>
			          </div>
            </Col>
            </Row>
            </div>
        </tab-pane>
      </tabs>
    </div>
    <div slot="footer">
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
      addMethod:'selectPlatform',
      beforeExpire:[7,6,5,4,3,2,1],
      width: modalWidth(document.body.clientWidth, "large"),
      form:{
        beforeExpireDay:7,
        notifyType:'sms',
        mobile:''
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
  }
};
</script>
