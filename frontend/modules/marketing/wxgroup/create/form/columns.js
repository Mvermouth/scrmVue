
import AppRoutes from '../../../../../configs/AppRoutes'
import AppProxy from '../../../../../scripts/common/appProxy'
import Wxgroup from '../../../../../models/marketing/wxgroup'
import { tableColumnsByDomain, filterTableRowActions } from '../../../../../scripts/utils/table-utils'
import { labelActions} from '../../../../../scripts/utils/table-renders'
import resend from '../components/resend.vue'

const width = App.options.styles.table.width

const permittedActions = ["detail","pass"]
const rowActions = [
	{ 'pass': {
		title: '重发',
		color: '#2d8cf0',
		onAction($list, { row, column, index }, domain) {
			App.modal({
				title: '选择重发时间',
				loading: true,
				width: 'small',
				render: (h,r) => {
					var v = h(resend,{
						props:{
							selections:[row]
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
	}}
	,{ 'detail': {
		title: '详情',
		color: '#2d8cf0',
		onAction($list, { row, column, index }, domain) {
			AppProxy.do_push(AppRoutes.Timeline.detail(row.configId));
		}
	}}
]
//const filteredActions = _.concat(chatActions, filterTableRowActions(rowActions, permittedActions));
const filteredActions = filterTableRowActions(rowActions, permittedActions)
//次數 内容，，如果是url直接显示图片？ 所属群组标签 发送状态 发送微信号
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
	,count: {
		width: width.w_5,
		title: '历史发送次数',
		align: 'center',
		render(h, context) {
			return <div>{context.row.count}</div>
		}
	}
	,lastTime: {
		width: width.w_12,
		title: '上次发送时间',
		align: 'center',
		render(h, context) {
			return <div>{context.row.lastTime}</div>
		}
	}
	,status: {
		width: width.w_5,
		title: '发送状态',
		align: 'center',
		render(h, context) {
			return <div>{context.row.status == 5 ? "成功" :"失败"}</div>
		}
	}
	,_actions: filteredActions.length > 0 ? {
		title: '操作',
		width: width.w_8,
		render(h, context) {
			return labelActions.call(this, h, context, Wxgroup, filteredActions)
		}
	} : false
}

export default tableColumnsByDomain(Wxgroup, options)
