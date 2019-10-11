<style lang="less" scoped>
.messageList{
    width: 100% ;
    height: auto;
    display: flex;
    flex-wrap: wrap;
    .messageWrap{
        background: #ffffff;
        width: 120px;
        min-height: 120px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 13px;
        padding: 5px;
        border-radius: 10px;
        height: auto;
        margin-right: 22px;
        box-shadow: 0px 0px 4px 4px rgba(101, 165, 245,.26);
        .addWriting{
            width: 120px;
            min-height: 120px;
            .writingContent{
              width: 110px;
              height: 110px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 4;
              -webkit-box-orient: vertical;
              margin-bottom: 11px;
              background: rgba(240, 245, 230, 0.45098039215686275);
              border-radius: 6px;
            }
        }
        .addImageHB {
            width: 120px;
            min-height: 120px;
            cursor: pointer;
            height:auto;
        }
    }
    .btn-margin-left{
        margin-left:26px;
    }
}
</style>

<template>
    <div>
       <div class="messageList">
           <div class="messageWrap" v-for="(item,index) in messages" :key="index">
               <div class="addImageHB" v-if="item.type == 'image'">
                   <img style="width:110px; height:110px" :src="item.url"/>
                   <button @click="deleteMessageByIndex(index)" class="ivu-btn ivu-btn-primary btn-margin-left" type="button">删除</button>
               </div>
                <div class="addImageHB" v-else-if="item.type == 'video'">
                   <video :ref="`video_${index}`" loop=”loop“ @mouseenter="e => e.target.play()" @mouseleave="e => e.target.pause()"  style="width:110px; height:110px" :src="item.url" @click="playVideo($event)">your browser does not support the video tag</video>
                   <button @click="deleteMessageByIndex(index)" class="ivu-btn ivu-btn-primary btn-margin-left" type="button">删除</button>
               </div>
                <div class="addWriting" v-else-if="item.type == 'writing'">
                   <div class="writingContent" :title="item.content" >{{item.content}}</div> 
                   <button @click="deleteMessageByIndex(index)" class="ivu-btn ivu-btn-primary btn-margin-left" type="button">删除</button>
               </div>
           </div>
       </div>
       <div class="addBtn">
           <button @click="addMessageType('0')" class="ivu-btn ivu-btn-primary" type="button">添加文字</button>
           <button @click="addMessageType('1')" class="ivu-btn ivu-btn-primary" type="button">选择图片</button>
           <button @click="addMessageType('2')" class="ivu-btn ivu-btn-primary" type="button">选择视频</button>
       </div>
       <select-image :title="selectImageTitle" v-model="selectImage" @on-selected-assets="onSelectImage"></select-image>
       <select-video :title="selectVideoTitle" v-model="selectVideo" @on-selected-assets="onSelectVideo"></select-video>
    </div>
</template>
<script>
import SelectImage from "../../../../../views/asset/selectors/select-image";
import SelectVideo from "../../../../../views/asset/selectors/select-video";
import writing from './writing.vue'
import Constant from "../../../../../configs/constant";

export default {
    components: {
        SelectImage
        ,SelectVideo
        ,writing
    },
	computed: {

	},
  data() {
    return {
        messages:[]
        ,selectImageTitle:""
        ,selectVideoTitle:""
        ,selectVideo:false
        ,selectImage:false
    };
  },
  watch:{
      messages(){
          this.toFromKey();
          //this.$emit('input', JSON.stringify(this.messages));
      }
  }
  ,methods: {
      //选择类型
      addMessageType:function(type){
          switch(type){
              case "0":{
                  this.alertTextModel();
                  break;
              }
              case "1":{
                  this.alertChoosePic();
                  break;
              }
              case "2":{
                  this.alertChooseVideo();
                  break;
              }
          }
      }
      //提交到表单
      ,toFromKey:function(){
        var returnArray = [];
        var hash = {
            image:3
            ,writing:1
            ,video:4
        };
        var temp;
        if(this.messages && this.messages.length > 0){
          for(var i = 0;i < this.messages.length;i++){
            temp = {};
            temp.type = hash[this.messages[i].type];
            switch(temp.type){
              case 1:
                temp.content = this.messages[i].content;
                break;
              case 3:
                temp.content = this.messages[i].url;
                break;
              case 4:
                temp.content = `{"url":"${this.messages[i].url}","thumburl":"https://xxinc-media.oss-cn-shenzhen.aliyuncs.com/img/1561366021316"}`;
                // temp.content = '{"thumburl":"http://xxinc-media.oss-cn-shenzhen.aliyuncs.com/af589c475e4d5a726634ed39a7421f99","url":"http://xxinc-media.oss-cn-shenzhen.aliyuncs.com/4a0aca0e87804c5f9b29c0a2c60d1610"}';
                break;
            }
            returnArray.push(temp);
          }
          this.$emit('input', JSON.stringify(returnArray));
        } else {
          this.$emit('input',"");
        }
      }
      //图片选择回调
      ,onSelectImage:function(assets){
        console.log(assets);
        if(assets && assets.length > 0);
        this.messages = this.messages.concat(assets);
        //this.messages.push(assets[0]);
      }
      //视频选择回调
      ,onSelectVideo:function(assets){
        console.log(assets);
        if(assets && assets.length > 0);
        this.messages = this.messages.concat(assets);
      }
      //文字填充回调
      ,onWriting:function(assets){
          if(!assets || assets == "") return;
          var obj = {
              content:assets,
              type:"writing"
          };
          this.messages.push(obj);
      }
      //填写文字
      ,alertTextModel(){
        var that = this;
        App.modal({
            title: '群发文字',
            loading: true,
            width: 'small',
            render: (h) => {
                h = this.$root.$createElement
                const v = h(writing);
                return v
            },
            onOk: async(comp, modal) => {
                modal.cancelLoading();
                const d = comp.getData();
                that.onWriting(d);
                App.removeModal();  
            }
        })
      }
      //选择图片
      ,alertChoosePic:function(){
        this.selectImage = true;
        this.selectImageTitle = `图片素材`;
      }
      //选择视频
      ,alertChooseVideo:function(){
        this.selectVideo = true;
        this.selectVideoTitle = `视频素材`;
      }
      //删除信息
      ,deleteMessageByIndex:function(index){
        this.messages.splice(index,1);
      }
      //清空
      ,refresh:function(){
        this.messages = [];
      }
  }
};
</script>

