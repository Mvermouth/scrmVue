import RestfulDomainModel from '../base/RestfulDomainModel'

export default new RestfulDomainModel([
	{ id: { name: 'ID', dataOnly: true }},
	{ sn: { name: '工号' }},
	{ name: { name: '姓名' }},
	{ tenantId: { name: '租户', dataOnly: true }},
	{ mobile: { name: '联系电话', dataOnly: true }},
	{ position: { name: '职位' }},
	{ status: { name: '状态' }},
	{ remark: { name: '备注', dataOnly: true }},
	{ gender: { name: '性别', dataOnly: true }}
], '/erp/employee')
