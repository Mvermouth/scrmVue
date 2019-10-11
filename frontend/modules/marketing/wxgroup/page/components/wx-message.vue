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
               </div>
                <div class="addImageHB" v-else-if="item.type == 'video'">
                   <video :ref="`video_${index}`" loop=”loop“ @mouseenter="e => e.target.play()" @mouseleave="e => e.target.pause()"  style="width:110px; height:110px" :src="item.url" @click="playVideo($event)">your browser does not support the video tag</video>
               </div>
                <div class="addWriting" v-else-if="item.type == 'writing'">
                   <div class="writingContent" :title="item.content" >{{item.content}}</div> 
               </div>
           </div>
       </div>
    </div>
</template>
<script>

export default {
  props:{
    mess:{
      type:Array
    }
  }
  ,data() {
    return {
        messages:[{type:"writing",content:"ddd"},{type:"writing",content:"ddd"}]
    };
  }
  ,watch:{
    mess(d){
      this.handleTheData();
    }
  }
  ,methods:{
    handleTheData:function(){
      var messages = [];
      var hash = {
        3:"image"
        ,1:"writing"
        ,4:"video"
      };
      if(this.mess && this.mess.length > 0){
        for(var i = 0;i < this.mess.length;i++){
          var temp = {};
          temp.type = hash[this.mess[i].type];
          switch(this.mess[i].type){
            case 1:
              temp.content = this.mess[i].content;
              break;
            case 3:
              temp.url = this.mess[i].content;
              break;
            case 4:
              temp.url = JSON.parse(this.mess[i].content).url;
              break;
          }
          messages.push(temp);
        }
      }
      this.messages = messages;
    }
  }
  ,mounted(){
    this.handleTheData();
  }
};
</script>

