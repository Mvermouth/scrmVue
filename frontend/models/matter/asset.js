import RestfulDomainModel from '../base/RestfulDomainModel'
class Model extends RestfulDomainModel {
}
export default new Model([
	{ id: { name: 'ID', dataOnly: true }},
	{ name: { name: '名称' }},
	{ type: { name: '类型', dataOnly: true }},
	{ url: { name: '链接地址' }},
	{ tags: { name: '标签' }}
], '/matter/asset')
