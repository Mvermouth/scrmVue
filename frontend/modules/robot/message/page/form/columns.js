
import AppRoutes from '../../../../../configs/AppRoutes'
import AppProxy from '../../../../../scripts/common/appProxy'
import Message from '../../../../../models/robot/message'
import resetMessData from "../components/resetMessData.vue"
import { tableColumnsByDomain, filterTableRowActions } from '../../../../../scripts/utils/table-utils'
import { labelActions} from '../../../../../scripts/utils/table-renders'

const width = App.options.styles.table.width

//const permittedActions = ["detail","delete"]
const permittedActions = App.data.actions || []
const rowActions = [
	{ 'view': {
		title: '详情',
		color: '#2d8cf0',
		async onAction($list, { row, column, index }, domain) {
			console.log(row);
		}
	}}
	,{ 'delete': {
		title: '删除',
		color: 'red',
		async onAction($list, { row, column, index }, domain) {
			$list.$Modal.confirm({
                title: '确认删除',
                content: '是否删除选择的数据？',
                loading: true,
                onOk: async () => {
                    try {
                        $list.$Modal.remove();
                        $list.$Notice.success({ title: '删除成功' });
                        App.event.$emit(domain.events.Delete);

                    } catch (e) {
                        $list.$Modal.remove();
                    }
                }
            })
		}
	}}
	,{ 'update': {
		title: '修改',
		color: '#2d8cf0',
		async onAction($list, { row, column, index }, domain) {
			App.modal({
				title: '修改信息',
				loading: true,
				width: 'small',
				render: (h) => {
					var v = h(resetMessData,{
						props:{
							group_name:row.group_name
						}
					});
					return v;
				},
				onOk: async(comp, modal) => {
					try {
						App.removeModal();
					} catch (e) {
						modal.cancelLoading();
					}
				}
			})
		}
	}}
]
const filteredActions = filterTableRowActions(rowActions, permittedActions)
const options = {
	history:false
	,platform_gid: {
		width: width.w_12,
		title: '群id',
		fixed: 'left',
		align: 'center',
		render(h, context) {
			return <div>{context.row.platform_gid}</div>
		}
	}
	,group_name: {
		width: width.w_12,
		title: '群名',
		align: 'center',
		render(h, context) {
			return <div>{context.row.group_name}</div>
		}
	}
	,_create_time: {
		width: width.w_12,
		title: '绑定时间',
		align: 'center',
		render(h, context) {
			return <div>{context.row._create_time}</div>
		}
	}
	,platform_uid: {
		width: width.w_12,
		title: '用户wxid',
		align: 'center',
		render(h, context) {
			return <div>{context.row.platform_uid}</div>
		}
	}
	,custom_id: {
		width: width.w_12,
		title: '用户微信号',
		align: 'center',
		render(h, context) {
			return <div>{context.row.custom_id}</div>
		}
	}
	,pid: {
		width: width.w_12,
		title: '掌上喵pid',
		align: 'center',
		render(h, context) {
			return <div>{context.row.pid}</div>
		}
	}
	,uid: {
		width: width.w_5,
		title: '掌上喵uid',
		align: 'center',
		render(h, context) {
			return <div>{context.row.uid}</div>
		}
	}
	,_actions: filteredActions.length > 0 ? {
		title: '操作',
		width: width.w_8,
		fixed: 'left',
		render(h, context) {
			return labelActions.call(this, h, context, Message, filteredActions)
		}
	} : false
}

export default tableColumnsByDomain(Message, options)
