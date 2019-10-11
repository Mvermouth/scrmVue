
import AppRoutes from '../../../../../configs/AppRoutes'
import AppProxy from '../../../../../scripts/common/appProxy'
import Timeline from '../../../../../models/marketing/timeline'
import { tableColumnsByDomain, filterTableRowActions } from '../../../../../scripts/utils/table-utils'
import { labelActions} from '../../../../../scripts/utils/table-renders'

const width = App.options.styles.table.width

const permittedActions = ["delete","detail"]
const rowActions = [
	// { 'pass': {
	// 	title: '重发',
	// 	color: '#2d8cf0',
	// 	onAction($list, { row, column, index }, domain) {

	// 	}
	// }}
	{ 'detail': {
		title: '详情',
		color: '#2d8cf0',
		async onAction($list, { row, column, index }, domain) {
			console.log(row);
			App.push(AppRoutes.Timeline.detailTimeline(row.id));
		}
	}},
	{ 'delete': {
		title: '删除',
		color: 'red',
		async onAction($list, { row, column, index }, domain) {
			console.log(row);
			console.log(domain);
			console.log($list);
			if(row.scheduledTime < Date.parse(new Date())){
				this.$Notice.error({title: '已经发送，不能删除'});
				return;
			}
			//删除借口 row.id
			App.modal({
				title: '确认删除?',
				loading: true,
				width: 'small',
				onOk: async(comp, modal) => {
					var res = await Timeline.deleteConfigs([row.id]);
					if(res){
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
	}}
]
//const filteredActions = _.concat(chatActions, filterTableRowActions(rowActions, permittedActions));
const filteredActions = filterTableRowActions(rowActions, permittedActions)
const options = {
	history:false
	,name: {
		width: width.w_12,
		title: '任务名称',
		fixed: 'left',
		align: 'center',
		render(h, context) {
			return <div>{context.row.name}</div>
		}
	}
	,lastTime: {
		width: width.w_12,
		title: '发送时间',
		align: 'center',
		render(h, context) {
			return <div>{context.row.sendTime}</div>
		}
	}
	,isSend: {
		width: width.w_5,
		title: '发送状态',
		align: 'center',
		render(h, context) {
			return <div>{context.row.isSend}</div>
		}
	}
	,_actions: filteredActions.length > 0 ? {
		title: '操作',
		width: width.w_8,
		render(h, context) {
			if(context.row.isSend == "待发送"){
				return labelActions.call(this, h, context, Timeline, filteredActions)
			} else{
				var filteredActionsTemp = filteredActions.slice(0,1);
				return labelActions.call(this, h, context, Timeline, filteredActionsTemp)
			}
		}
	} : false
}

export default tableColumnsByDomain(Timeline, options)
