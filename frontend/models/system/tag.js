import RestfulDomainModel from '../base/RestfulDomainModel'
class Model extends RestfulDomainModel {

}
export default new Model([
	{ id: { name: 'ID', dataOnly: true }},
	{ name: { name: '名称' }},
	{ type: { name: '类型' }}
], '/system/tag')
