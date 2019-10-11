import RestfulDomainModel from '../base/RestfulDomainModel'
class Model extends RestfulDomainModel {
}
export default new Model([
	{ id: { name: 'ID', dataOnly: true }},
	{ tenantId: { name: '租户ID', dataOnly: true }},
	{ type: { name: '类型', dataOnly: true }}, // 黑名单:black / 白名单:white
	{ category: { name: '分类', dataOnly: true }}, // website
	{ content: { name: '内容' }}
], '/risk/filterItem')
