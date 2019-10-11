<template>
    <div>{{aaa}}
      <tchild></tchild>
      <div @click="testajax">anniu按钮</div>
    </div>
</template>
<script>
import tchild from './tchild.vue'

export default {
  components:{
    tchild
  },
  props: {
    bbb: {
      type: Object
    }
  },
  data() {
    return {
      aaa:"123444"
    };
  },
  computed: {

  },

  mounted() {

  },

  methods: {
    testajax:function(){ 
     axios.post(window.location.href)
    .then(result => {
       
    })
    .catch(e => {
         
     })
    }
  }
};
</script>
