<template>
    <card>
        <tabs type="card" value="newTask">
            <tab-pane label="新建群发" name="newTask">
				<card>
                	<domain-create :formItems="fromItems" :domain="Wxgroup" v-on:on-submit="onsubmitcallback"></domain-create>
				</card>
            </tab-pane>
            <tab-pane label="群发记录" name="taskList">
				<card>
					<domain-page v-bind="wxHistoryProps"></domain-page>
				</card>
            </tab-pane>
        </tabs>
    </card>
</template>
<script>

import DomainCreate from '../../../../views/domain/create.vue'
import DomainPage from '../../../../views/domain/page.vue'
import fromItems from './form/form-items'
import Columns from './form/columns'
import fromItems2 from './table/form-items'
import Wxgroup from '../../../../models/marketing/wxgroup'
import resend from './components/resend.vue'
const defaultSort = [
    {
        "ignoreCase": false,
        "property": "ctime",
        "type": "DSC"
    }
]
export default {
	props:{
		resetwidgetarray:{
			type:Function
		}
	},
	components: {
		DomainCreate
		,DomainPage
	},
	data() {
		var btn = {
			title: '批量重发',
			type: 'primary',
			unauthorize: true,
			onAction: ($list, rows) => {
				//重新组装数据再次发送
				console.log($list.selections);
				if(!$list.selections || $list.selections.length == 0){
					this.$Notice.error({title: '请选择'})	;
					return;
				}
				App.modal({
					title: '选择重发时间',
					loading: true,
					width: 'small',
					render: (h) => {
						var v = h(resend,{
							props:{
								selections:$list.selections
							}
						});
						return v;
					},
					onOk: async(comp, modal) => {
						var res = comp.getData();
						if(res){
							var result = await Wxgroup.resend(res);
							if(result && result == true){
								this.$Notice.success({title: '添加成功'});
								modal.cancelLoading();
								App.removeModal();
							} else {
								this.$Notice.error({title: '添加失败'});
								modal.cancelLoading();
								App.removeModal();
							}
						} else {
							this.$Notice.error({title: '请选择时间'});
							modal.cancelLoading();
						}
					}
				})
			}
		}
		return {
            type: 'newTask'
            ,fromItems: fromItems
			,Wxgroup
			,wxHistoryProps:{
				domain:Wxgroup
				,formItems:fromItems2
				,columns: Columns
				,selection: true
				,defaultSort
				,formProps: {
	                labelWidth: 100
	            }
	            ,actions: [{'view':{
	            	unauthorize: true
	            }},{
	            	btn
	            }]
			}
		}
	},
	methods: {
		onsubmitcallback:function(fn){
			if(fn && typeof fn == "function"){
				fn();
				this.resetwidgetarray();
			}
		}
	}
}
</script>

