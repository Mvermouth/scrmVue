<template>
    <card>
    	<tabs type="card" value="newTask">
            <tab-pane label="新建发送" name="newTask">
				<card>
		            <domain-create :formItems="fromItems" :domain="Timeline" ref="domainwidget" v-on:on-submit="onsubmitcallback"></domain-create>
				</card>
            </tab-pane>
            <tab-pane label="发送记录" name="taskList">
				<card>
					<domain-page v-bind="TimelineDomain"></domain-page>
				</card>
            </tab-pane>
        </tabs>
    </card>
</template>
<script>
import fromItems from './form/form-items'
import Task from '../../../../models/marketing/task'
import DomainCreate from '../../../../views/domain/create.vue'
import Timeline from '../../../../models/marketing/timeline'
import Columns from './form/columns'
import DomainPage from '../../../../views/domain/page.vue'
const defaultSort = [
    {
        "ignoreCase": false,
        "property": "ctime",
        "type": "DSC"
    }
]

export default {
	components: {
		DomainCreate
		,DomainPage
	},
	props:{
		resetwidgetarray:{
			type:Function
		}
	},
	data() {
		var btn = {
			title: '批量删除',
			type: 'primary',
			unauthorize: true,
			onAction: async ($list, rows) => {
				//重新组装数据再次发送
				console.log($list.selections);
				if(!$list.selections || $list.selections.length == 0){
					this.$Notice.error({title: '请选择'});
					return;
				}
				App.modal({
					title: '确认删除?',
					loading: true,
					width: 'small',
					onOk: async(comp, modal) => {
						var ids = [];
						$list.selections.forEach(item =>{
							ids.push(item.id);
						});
						var res = await Timeline.deleteConfigs(ids);
						if(res){
							$list.selections = [];
							$list.load();
							this.$Notice.success({title: '删除成功'});
							modal.cancelLoading();
							App.removeModal();
							return;
						}
						modal.cancelLoading();
					}
				})
			}
		}
		return {
			type: 'newTask',
			fromItems: fromItems,
			Timeline,
			type: 'newTask'
			,TimelineDomain:{
				domain:Timeline
				,columns: Columns
				,defaultSort
				,formProps: {
	                labelWidth: 100
	            }
	            ,selection: true
	            ,actions: [{'view':{
	            	unauthorize: true
	            }},{
	            	btn
	            }]
			}
		}
	},
	methods: {
		onForm() {},
		onsubmitcallback:function(fn){
			if(fn && typeof fn == "function"){
				fn();
				this.resetwidgetarray();
			}
		}
	}
}
</script>

