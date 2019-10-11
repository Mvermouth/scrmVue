import RestfulDomainModel from '../base/RestfulDomainModel'

export default new RestfulDomainModel([
	{ id: { name: 'ID', dataOnly: true }},
	{ type: { name: '类型' }},
	{ title: { name: '变量名' }},
	{ key: { name: 'key' }},
	{ value: { name: '值', dataOnly: true }},
	{ templateId: { name: 'templateId', dataOnly: true }}
], '/system/config')
