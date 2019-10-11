<style lang="less" scoped>
ul li {
  float: left;
  position: relative;
  margin: 0 20px 20px 0;
  list-style: none;
}
.addImage {
  width: 120px;
  height: 120px;
  border: 1px dashed #d9d9d9;
  text-align: center;
  line-height: 118px;
  cursor: pointer;
  color: #999;
}
.add {
  padding-left: 2px;
  .new {
    width: 48%;
    float: left;
  }
  .select {
    width: 48%;
    float: right;
  }
  .upload {
    color: #999;
    text-align: center;
    line-height: 28px;
    border: 1px dashed #d9d9d9;
    padding: 30px 0;
    height: 120px;
    cursor: pointer;
  }
}
.message-text {
  width: 100%;
  padding: 20px 0 10px;
  textarea {
    width: 100%;
    outline: none;
    height: 120px;
    line-height: 18px;
    resize: none;
    border: none;
  }
  p {
    text-align: right;
    margin-top: 10px;
  }
}
</style>

<template>
    <card>
        <tabs type="card" v-model="type" :animated="false">
            <tab-pane v-for="(item, index) in uploadType" :key="`upload_${index}`" :icon="item.icon" :label="item.label" :name="item.name">
                <div v-show="type==='image'">
                    <ul>
                        <li class="addImage" @click="add(item.label)"><icon type="plus-round" :size="30"></icon></li>
                    </ul>
                    <ul>
                      <li class="addImage" v-for="item in images" :key="item.id"><img style="width:100%; height:100%" :src="item.url"/></li>
                    </ul>
                </div>
                <div v-show="type==='Text'">
                    <div class="add">
                        <!-- <div class="new upload"><icon type="plus-round" :size="30"></icon><br>新建图文</div>
                        <div class="select upload"><icon type="plus-round" :size="30"></icon><br>从图文库选择</div> -->
                    </div> 
                </div>
                <!-- <div v-show="type==='activity'">
                    <div class="add">
                        <div class="new upload"><icon type="plus-round" :size="30"></icon><br>新建图文</div>
                        <div class="select upload"><icon type="plus-round" :size="30"></icon><br>从图文库选择</div>
                    </div>
                </div> -->
                <div v-show="type==='video'">
                     <ul>
                        <li class="addImage" @click="add(item.label)"><icon type="plus-round" :size="30"></icon></li>
                    </ul>
                    <ul>
                      <li class="addImage" v-for="(item,index) in videos" :key="item.id">
                        <video :ref="`video_${index}`" loop=”loop“ @mouseenter="e => e.target.play()" @mouseleave="e => e.target.pause()"  style="width:100%; height:100%" :src="item.url" @click="playVideo($event)">your browser does not support the video tag</video>
                      </li>
                    </ul>
                    <!-- <div class="add">
                        <div class="new upload"><icon type="plus-round" :size="30"></icon><br>新建图文</div>
                        <div class="select upload"><icon type="plus-round" :size="30"></icon><br>从图文库选择</div>
                    </div> -->
                </div>
                <div v-show="type==='article'">
                    <div class="add">
                      <div style="width:400px">
                      <Input v-model="link" type="url" placeholder="请填写链接"></Input>
                      </div>	
                    </div>
                </div>
                <!-- <div v-show="type==='text'">
                    <div class="message-text">
                        <textarea maxlength="600" placeholder="请输入群发内容"></textarea>
                        <p>最多输入600字符</p>
                    </div>
                </div> -->
            </tab-pane>
        </tabs>
        <select-image :title="selectImageTitle" :multiple="true" v-model="selectImage" @on-selected-assets="onSelectImage"></select-image>
        <select-video :title="selectVideoTitle" v-model="selectVideo" @on-selected-assets="onSelectVideo"></select-video>
    </card>
</template>
<script>
import SelectImage from "../../../../../views/asset/selectors/select-image";
import SelectVideo from "../../../../../views/asset/selectors/select-video";
import Constant from "../../../../../configs/constant";

export default {
  components: {
    SelectImage
    ,SelectVideo
  },
  props: {
    uploadType: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selectImage: false,
      selectVideo: false,
      type: this.uploadType[0].name,
      title: [],
      selectImageTitle: "",
      selectVideoTitle: "",
      typeNum:1,
      link:""
      ,images:[]
      ,videos:[]
    };
  },
  watch: {
    type(val) { 
      switch(val){
        case "image":
          this.typeNum = 1;
          break;
        case "Text":
          this.typeNum = 2;
          this.$emit('input', {
            type:2
          });
          break;
         case "video":
          this.typeNum = 15;
          break;   
      }
       
      //if("23".indexOf(this.typeNum) > -1) this.handleFormtext();
    },
    link(val){ 
      var items = null;
      var returnObj = {};
      if(this.link && this.typeNum == 3){
        items = [{
          MIMEType:3
          ,url:this.link
        }];
      }
      returnObj.items = items;
      returnObj.type = this.typeNum;
      this.$emit('input', returnObj);
    }
  },
  computed: {
    // 根据权重排序type
    // sortedUploadType() {
    //     return _.sortBy(this.uploadType, weight)
    // }
  },
  methods: {
    onSelectImage(assets) {
      //处理格式暂时不知道
      if(assets && assets.length > 9){
        this.$Notice.error({title: '最多选择9张请重新选择'});
        return;
      }
      this.handleForm(assets);
    },
    //短视频回调。
    onSelectVideo:function(assets){
      console.log(assets);
      this.videos = assets;
      this.handleVideo(assets);
      //this.$emit('input', returnObj);
    },
    add(title) { 
      switch(title){
        case "图片":
          this.selectImage = true;
          this.selectImageTitle = `${title}素材`;
          break;
        case "视频":
          this.selectVideo = true;
          this.selectVideoTitle = `${title}素材`;
          break;
      }
      
    }
    //视频
    ,handleVideo:function(datas){
      var items = null;
      var returnObj = {};
      if(datas && datas.length > 0){
        items = datas.map(it => {return {MIMEType:Constant.TimelineType.Video.value,url:it.url}});
      } else {

      }
      returnObj.items = items;
      returnObj.type = this.typeNum;
      this.$emit('input', returnObj);
    }
    //图片
    ,handleForm:function(datas){
      this.images = datas;
      var items = null;
      var returnObj = {};
      if(datas && datas.length > 0){
        items = datas.map(it => {return {MIMEType:Constant.TimelineType.ImageText.value,url:it.url}});
      } else {

      }
      returnObj.items = items;
      returnObj.type = this.typeNum;
      this.$emit('input', returnObj);
    }
    ,handleFormtext:function(){
      var items = null;
      var returnObj = {};
      returnObj.type = this.typeNum;
      if(this.typeNum == 3){
        items = [{
          MIMEType:3
          ,url:this.link
        }];
      } else if(this.typeNum == 2){

      }
      returnObj.items = items;
      this.$emit('input', returnObj);
    }
  }
};
</script>

