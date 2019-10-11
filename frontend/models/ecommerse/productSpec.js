import RestfulDomainModel from '../base/RestfulDomainModel'
/**
  * product => spec 关系表
 **/
class Model extends RestfulDomainModel {

}

export default new Model([
	{ id: { name: 'ID', dataOnly: true }},
	{ productId: { name: '商品ID', dataOnly: true }},
	{ specId: { name: '规格ID', dataOnly: true }},
	{ value: { name: '规格值' }},
	{ deleted: { name: '是否删除', dataOnly: true }},
	{ ctime: { name: '创建时间' }},
	{ mtime: { name: '更新时间', dataOnly: true }}
], '/ecommerse/product')
