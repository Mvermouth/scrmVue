<style lang="less" scoped>

</style>

<template>
    <div>
        <button @click="testmodel" class="ivu-btn ivu-btn-primary" type="button">选择</button>

        <form-item label="已选标签" v-if="selections.length>0">
            <Tag v-for="profile in selections" :key="profile.id" :name="profile.platformTags" color="orange" type="border" closable @on-close="remove(profile.id)">{{ profile.platformTags}}</Tag>
        </form-item>

        <div v-if="isChoose">          
            <button @click="canceCloose(true)" class="ivu-btn ivu-btn-primary" type="button">确认</button>
            <button @click="canceCloose(false)" class="ivu-btn ivu-btn-primary" type="button">取消</button>
        </div>
       
 <!--        <selector-t v-model="selectors.profile" title="选择标签"  :width="1000" v-bind="profileSelectorProps" @on-selected-rows="onselectedrowsdad"></selector-t> -->
    </div>

</template>
<script>

import Constant from "../../../../../configs/constant";
import selectorT from '../selecter_tags/selecter'
import DomainPage from '../../../../../views/domain/page.vue'
import columns from '../selecter_tags/c2'
export default {
    components: {
        selectorT
    },
	computed: {
		// profileSelectorProps() {
		// 	return {
		// 		domainPageProps: {
		// 			defaultCriterias: [
		// 				{
		// 					property: 'deleted',
		// 					filterType: 'EQ',
		// 					value: false
		// 				}
		// 				,{
		// 					property: 'online',
		// 					filterType: 'EQ',
		// 					value: Constant.UserOnlineStatus.Online.value
		// 				}
		// 			]
		// 		}
		// 	}
		// }
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
        ,args:[]
        ,profileSelectorProps:{
            domainPageProps: {
                defaultCriterias: [
                    {
                        property: 'deleted',
                        filterType: 'EQ',
                        value: false
                    }
                    ,{
                        property: 'online',
                        filterType: 'EQ',
                        value: Constant.UserOnlineStatus.Online.value
                    }
                ]
            }
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
                returnArray.push(this.selections[i].platformTags);
            } 
        }
        if(returnArray && returnArray.length > 0){
            returnArray = JSON.stringify(returnArray);
            this.$emit('input', returnArray);  
        } else this.$emit('input', "");    
    }
    //ceshi
    ,testmodel:function(){
        //数据 根据 choosepeople那里来
        // if(this.$store.state.idArgs && this.$store.state.idArgs != ""){
        //     this.args = JSON.parse(this.$store.state.idArgs);
        //     this.profileSelectorProps.domainPageProps.defaultCriterias[1].value = 3;
        // }
        // this.selectors.profile = true;
        var that = this;
        var platformTags = this.handlePlatformTags(this.$store.state.idArgs);
        App.modal({
            title: '选择标签',
            loading: true,
            width: 'large',
            render: (h) => {
                var v = h(DomainPage,{
                    props:{
                        columns
                        ,selection: true
                        ,defaultSort:[
                            {
                                "ignoreCase": false,
                                "property": "ctime",
                                "type": "DSC"
                            }
                        ]
                        ,loadPage: async(pageNo, pageSize, filter, sort) => {
                            return platformTags;
                        }
                    }
                    ,on:{
                        "on-selected-rows":function(data){
                            console.log(data);
                            that.onselectedrowsdad(data);
                        }
                    }
                });
                return v;
            },
            onOk: async(comp, modal) => {
                console.log(comp);
                modal.cancelLoading();
                App.removeModal();
            }
            ,onCancel:function(){
                that.onselectedrowsdad([]);
            }
            ,onClose:function(){
                that.onselectedrowsdad([]);
            }
        })
    }
    ,handlePlatformTags(platformTags){
        //"total":4,"pageNo":1,"pageSize":20
        var returnPlatformTags = {};
        var platformTagsArray = [];
        if(platformTags && platformTags.length > 0){
            for(var i = 0;i < platformTags.length;i++){
                platformTagsArray.push({platformTags:platformTags[i],id:i});
            }
        }
        returnPlatformTags.content = platformTagsArray;
        returnPlatformTags.total = platformTagsArray.length;
        returnPlatformTags.pageNo = 1;
        returnPlatformTags.pageSize = 20;
        return returnPlatformTags;
    }
    ,remove(id){
        this.selections = this.selections.filter(it=> it.id!==id);
        this.toFromKey();
    }
  }
};
</script>

