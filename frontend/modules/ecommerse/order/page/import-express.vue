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
  .padding-5 {
      padding:10px 10px 10px 10px;
  }
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
    padding-bottom: 15px;
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
  <Modal title="批量导入物流单" v-model="model" @on-cancel="closeModal" :width="width" class="export-order-modal">
    <div class="export-order-info">
      <Row class="padding-5">
            <Alert type="info" class="alert-font" show-icon>批量导入快递单,只对待发货的订单有效！</Alert>
            <Col span="2"><span>导入方式:</span></Col>
            <Col span="8">
                <RadioGroup v-model="form.type">
                    <Radio label="import">批量上传</Radio>
                    <Radio label="manual">手动输入</Radio>
                </RadioGroup>
          </Col>
      </Row>
          <div v-if="form.type=='manual'" class="padding-5">
              <Alert type="info" show-icon class="alert-font">每行对应一个订单;订单号,物流单号,物流公司之间用“,”隔开，每行结尾用“;”</Alert>
              <Input v-model="form.inputData" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder="201812250086,456789,中国邮政;"></Input>
          </div>
          <div v-if="form.type=='import'" class="padding-5">
              <Alert type="info" v-if="form.fileData.length===0" class="alert-font" show-icon>请选择 xls,xlsx 文件类型</Alert>
              <Alert v-if="form.fileData.length>0" type="info" show-icon>已上传{{form.fileData.length}}条</Alert>
              <Row :gutter="10">
                <Col span="3">
                  <Upload
                      ref="upload"
                      name="order"
                      :show-upload-list="false"
                      :on-success="handleSuccess"
                      :format="['xls','xlsx']"
                      :max-size="2048"
                      :on-format-error="handleFormatError"
                      :on-exceeded-size="handleMaxSize"
                      action="/ecommerse/order/parseXlsFile">
                      <Button>上传文件</Button>
                  </Upload>
                </Col>
                <Col span ="3">
                  <Button @click="downloadTemplate">下载模板</Button>
                </Col>
              </Row>
          </div>
          <div class="padding-5">
            <Alert type="info" show-icon class="alert-font">勾选！我们将根据客户平台通知客户！</Alert>
            <Row>
              <Col span="3"><span>是否通知客户:</span></Col>
              <Col span="2">
                  <Checkbox v-model="form.isSendMsg">是</Checkbox>
              </Col>
            </Row>
          </div>
          <Row v-if="form.isSendMsg" class="padding-5">
              <Col span="3"><span>通知内容模板:</span></Col>
              <Col span="20">
                  <Input v-model="form.message" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="通知内容格式!"></Input>
              </Col>
          </Row>
          <Row type="flex" justify="end">
            <Col span="4" class="padding-5"><Button type="primary" :loading="loading" ghost @click="submit">确认</Button></Col>
          </Row>  
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
const getDefaultData = ()=> {
        return {
          type: "import",
          isSendMsg: false,
          message:'亲，您购买的 {0} 已发货，请注意查收！物流单号：{1}。',
          inputData:'',
          fileData:[]
        }
}
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
      width: modalWidth(document.body.clientWidth, "large"),
      loading: false,
      ruleImportExpress:{},
      form:getDefaultData(),
      
    };
  },
  computed: {
  },
  methods: {
    handleFormatError(){
      this.$Notice.error({title: '文件格式不正确!'})
    },
    handleMaxSize(){
      this.$Notice.error({title: '文件超过大小限制!'})
    },
    handleSuccess(result){
      if(result.code === 0) {
        this.form.fileData = result.data.splice(1,result.data.length)
        console.log("this.form.fileData:",this.form.fileData)
			}else {
				this.$Notice.error({title: '文件上传失败!'})
			}
    },
    downloadTemplate(){
      location.href=`${Order.baseUrl}/importExpressTemplate`
    },
    closeModal(){
      this.model =false
      this.form = getDefaultData()
    },
    async submit(){
      const params = {
            isSendMsg: this.form.isSendMsg,
            message: this.form.message
      }
      if(this.form.type === 'manual'){
         // 手动创建
         if(!this.form.inputData){
            this.$Notice.error({ title: "输入的内容为空" })
            return 
         }
         let text = this.form.inputData.replace('，',',').replace('；',';')
         const arr = text.split(';').filter(it=> !!it)
         const content = arr.map(it => { return it.split(',').map(it => {return it.trim()}) })
         let isCorrect= true
         content.forEach(it =>{
           if(it.length!==3){
             isCorrect = false
           }
         })
         if(!isCorrect){
           this.$Notice.error({title: "手动输入的内容不正确!请检查输入！"})
           return 
         } 
         params.content = content
      }
      else {
        params.content = this.form.fileData.map(it => {
            return it.filter(it => !!it).map(it => {
                return it.toString().trim()
            })
        })
        let isCorrect = true
        this.form.fileData.forEach(it=>{
            if(it.length!== 3){
              isCorrect = false
            }
        })
        if(!isCorrect){
           this.$Notice.error({title: "上传的内容不符合规范!请检查文件内容再重新上传！"})
           return 
         }
      }
      if(params.isSendMsg && !params.message){
          this.$Notice.error({title: "发送的消息内容不能为空!"})
      }
      try {
          this.loading = true
          const result = await Order.importExpress(params)
          this.loading = false
          this.$Notice.info({title:result.title, desc : result.desc||'',duration:0})
          this.closeModal()
      } catch (error) {
          this.loading = false
      }
    }
  }
};
</script>
