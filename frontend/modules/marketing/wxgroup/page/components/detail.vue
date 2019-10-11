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
                <div :title="item.platformUid">微信账号:{{item.platformUid}}</div>
                <div :title="item.nickname">微信昵称:{{item.nickname}}</div>
              </div>
            </div>
          </div>
          <label>标签组:</label>
          <div class="itemRowWrap">
            <Tag color="blue" v-for="item in tags">{{item}}</Tag>
          </div>
          <label>群发信息:</label>
          <div class="itemRowWrap">
            <wxmessage :mess = "mess"></wxmessage>
          </div>
          <label>历史次数:{{conunt}}</label>
          <label>历史发送时间:</label>
          <div class="itemRowWrap">
            <Tag color="blue" v-for="item in times">{{item}}</Tag>
          </div>
       </div>
    </div>
</template>
<script>

import wxmessage from './wx-message.vue'
import Profile from '../../../../../models/im/profile'
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
        ,tags:[]
        ,times:[]
        ,name:""
        ,conunt:0
        ,mess:[]
    };
  },
  methods: {
    handleTheData:function(){
      this.conunt = this.detailData && this.detailData.total;
      this.name = this.detailData && this.detailData.content && this.detailData.content[0] && this.detailData.content[0].name;
      var params = this.detailData && this.detailData.content && this.detailData.content[0] && this.detailData.content[0].params;
      this.getWXMessage(params);
      this.getTags(params);
      this.getTimes(this.detailData.content);
    }
    ,getWXMessage(params){
      var platformUids = JSON.parse(JSON.parse(params).profilePlatformUids);
      var filter = {};
      var that = this;
      var res = Profile.page(1,1000,filter,[]);
      res.then(function(r){
        console.log(r);
        that.wxHead = r.content.filter(item => {
          return platformUids.indexOf(item.platformUid) > -1;
        });
      });
    }
    ,getTags(params){
      this.tags = JSON.parse(JSON.parse(params).platformTags);
      this.mess = JSON.parse(JSON.parse(params).messages);
    }
    ,getTimes(params){
      var d = [];
      if(params && params.length > 0){
        for(var i = 0;i < params.length;i++){
          d.push(moment(params[i].ctime).format('YYYY-MM-DD HH:mm:ss'));
        }
      }
      this.times = d;
    }
  }
  ,mounted(){
    this.handleTheData();
  }
};
</script>

