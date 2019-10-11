import RestfulDomainModel from '../base/RestfulDomainModel'
class Model extends RestfulDomainModel {
}
export default new Model([
	{ id: { name: 'ID', dataOnly: true }},
	{ content: { name: '白名单' }},
	{ whiteListType: { name: '类型' }}
], '/system/whiteList')
