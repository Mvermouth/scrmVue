<style lang="less" scoped>
.itemRow{
    width:100%;
    height:auto;
}
</style>

<template>
    <div>
       <div class="itemRow">
         <label>文字信息:</label>
         <Input v-model="writing" type="textarea"/>
         <!-- <limit-word-num-textarea v-model="failReson"></limit-word-num-textarea> -->
      </div>
    </div>
</template>
<script>

import Constant from "../../../../../configs/constant";

export default {
  components: {

  },
	computed: {

	},
  data() {
    return {
        writing:""
    };
  },
  methods: {
      getData:function(){
        if(this.writing)
        return this.writing;
        else return null;
      }
  }
};
</script>

