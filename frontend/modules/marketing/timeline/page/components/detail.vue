<style lang="less">
  .itemRow{
    width:100%;
    height:auto;
    label{
      width: 100%;
      margin-bottom: 5px;
      display: block;
      font-weight: bold;
    }
    .itemRowWrap{
      width:100%;
      height:auto;
      margin-bottom:5px;
      .headCard{
        height: 60px;
        width: 220px;
        display: flex;
        margin-bottom:10px;
        .ava{
          // background: url("http://wx.qlogo.cn/mmhead/ver_1/4meQwobtP3WjiaXPxf0iaULicb7jYcJtGkOP5H6WPG8B1jPfbE6It1nEb611icboSnia47yXRmGE9ibLLLVpOvYccbYNAd5chRE8LvRcpHpGfray4/132");
          height: 60px;
          width: 60px;
          background-position: center !important;
          box-shadow: 0px 0px 10px 0px rgba(103,179,221,0.65);
        }
        .headContent{
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          background: rgba(241, 237, 237, 0.36078431);
          width: 140px;
          height: 60px;
          padding-left: 5px;
          font-size:12px;
          div{
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
  .flex{
    display: flex;
    flex-wrap: wrap;
  }
</style>
<template>
    <div>
       <div class="itemRow">       
          <label>任务名称:{{name}}</label>
          <label>执行账号:</label>  
          <div class="itemRowWrap flex">
            <div class="headCard" v-for="item in wxHead">
              <div class="ava" :style="'background:url(' + item.avatar + ')'"></div>
              <div class="headContent">
                <div :title="item.platformUid">微信账号:{{item.customID}}</div>
                <div :title="item.nickname">微信昵称:{{item.nickname}}</div>
              </div>
            </div>
          </div>
          <label>群发信息:</label>
          <div class="itemRowWrap">
            <wxmessage :mess = "mess"></wxmessage>
          </div>
          <label>发送时间:</label>
          <div class="itemRowWrap">
            <Tag color="blue">{{time}}</Tag>
          </div>
       </div>
    </div>
</template>
<script>
import Profile from '../../../../../models/im/profile'
import wxmessage from './wx-message.vue'
var moment = require('moment');
export default {
    components: {
      wxmessage
    },
  props:{
    detailData:{
      type:Object
    }
  }
  ,data() {
    return {
        wxHead:[]
        ,time:""
        ,name:""
        ,mess:[]
    };
  },
  methods: {
    handleTheData:function(){
      this.name = this.detailData.name;
      var params = JSON.parse(this.detailData.params);     
      console.log(params); 
      this.time = moment(params.actionTime).format('YYYY-MM-DD HH:mm:ss');
      this.getWXMessage(params);
      this.getMess(params);
    }
    ,getWXMessage(params){
      var platformUids = params.platformUids;
      console.log(typeof platformUids);
      var filter = {};
      var that = this;
      var res = Profile.page(1,1000,filter,[]);
      console.log(res);
      res.then(function(r){
        console.log(r);
        that.wxHead = r.content.filter(item => {
          return platformUids.indexOf(item.customID) > -1;
        });
      });
    }
    ,getMess(params){
      this.mess = [];
      var temp = {};
      if(params.content) {
        temp.content = params.content;
        temp.type = 1;
        this.mess.push(temp);
      }

      temp = {};
      switch(params.type){
        case 2:
          
          break;
        case 15:
          if(params.items && params.items.length > 0){
            for(var i = 0;i < params.items.length;i++){
              temp.type = 4;
              temp.content = JSON.stringify({url:params.items[i].url});
              this.mess.push(temp);
            }
          }
          break;
        case 1:
          if(params.items && params.items.length > 0){
            for(var i = 0;i < params.items.length;i++){
              temp.type = 3;
              temp.content = params.items[i].url;
              this.mess.push(temp);
            }
          }
          break;
      }
      //if(temp) this.mess.push(temp);
    }
  }
  ,mounted(){
    this.handleTheData();
  }
};
</script>

