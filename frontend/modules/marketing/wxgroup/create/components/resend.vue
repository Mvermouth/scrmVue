<style lang="less" scoped>
.itemRow{
    width:100%;
    height:auto;
}
</style>

<template>
    <div>
       <div class="itemRow">
         <label>重新发送时间:</label>
         <date-picker v-model="restime" format='yyyy-MM-dd HH:mm:ss' type='datetime' placeholder='设置发送时间' style='width: 100%'></date-picker>
         <!-- <limit-word-num-textarea v-model="failReson"></limit-word-num-textarea> -->
      </div>
    </div>
</template>
<script>

import Constant from "../../../../../configs/constant";

export default {
  props:{
    selections:{
      type:Array
    }
  }
  ,data() {
    return {
        restime:""
    };
  },
  methods: {
      getData:function(){
        if(this.restime)
        return this.handleSelections();
        else return null;
      }
      //处理重新选择的重发数据
      ,handleSelections:function(){
        console.log(this.selections);
        var returnData = {};
        var ids = [];
        if(this.selections && this.selections.length > 0){
          for(var i = 0;i < this.selections.length;i++){
            ids.push(this.selections[i].configId);
          }
        }
        returnData.scheduleTime = Date.parse(new Date(this.restime));
        returnData.configIds = ids;
        return returnData;
      }
  }
};
</script>

