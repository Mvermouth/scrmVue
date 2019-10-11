<style lang="less" scoped>

</style>

<template>
    <div>
        <button @click="testmodel" class="ivu-btn ivu-btn-primary" type="button">选择</button>

        <form-item label="已选择账号" v-if="selections.length>0">
            <Tag v-for="profile in selections" :key="profile.id" :name="profile.platformUid" color="orange" type="border" closable @on-close="remove(profile.id)">{{ profile.customID||profile.platformUid}}</Tag>
        </form-item>

        <div v-if="isChoose">          
            <button @click="canceCloose(true)" class="ivu-btn ivu-btn-primary" type="button">确认</button>
            <button @click="canceCloose(false)" class="ivu-btn ivu-btn-primary" type="button">取消</button>
        </div>
       
        <selector-t v-model="selectors.profile" title="选择运营号"  :width="1000" v-bind="profileSelectorProps" @on-selected-rows="onselectedrowsdad"></selector-t>
    </div>

</template>
<script>

import Constant from "../../../../../configs/constant";
import selectorT from '../selecter/selecter'

export default {
    components: {
        selectorT
    },
	computed: {
		profileSelectorProps() {
			return {
				domainPageProps: {
					defaultCriterias: [
						{
							property: 'deleted',
							filterType: 'EQ',
							value: false
						},
						{
							property: 'online',
							filterType: 'EQ',
							value: Constant.UserOnlineStatus.Online.value
						}
					]
				}
			}
		}
	},
  data() {
    return {
        isChoose: false,
        selections:[],
        type:"heiheihei",
        default:"heiheihsssei"
        ,selectors:{
            profile:false
        }
    };
  },
  methods: {
    onChoose(e) {
        this.isChoose = !this.isChoose;
    },
    canceCloose:function(bool,e){
        this.isChoose = false;
        if(!bool) this.selections= [];
        this.toFromKey();
    },
    onselectedrowsdad:function(selections){
        this.selections = selections;
        this.toFromKey();
        
    },
    //提交给表单字段
    toFromKey:function(){
        var returnArray = [];
        if(this.selections && this.selections.length){
            //这里要处理数据暂时不知道格式
            for(var i = 0;i < this.selections.length;i++){
                returnArray.push(this.selections[i].customID);
            } 
        }
        returnArray = JSON.stringify(returnArray);
        this.$emit('input', returnArray);     
    }
    //ceshi
    ,testmodel:function(){
        this.selectors.profile = true;
    }
    ,remove(id){
        this.selections = this.selections.filter(it=> it.id!==id);
        this.toFromKey();
    }
  }
};
</script>

