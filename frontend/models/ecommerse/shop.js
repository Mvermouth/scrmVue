import RestfulDomainModel from '../base/RestfulDomainModel'
/**
  *  店铺
 **/
class Model extends RestfulDomainModel {

}

export default new Model([
	{ id: { name: 'ID', dataOnly: true }},
	{ title: { name: '店铺名称' }},
	{ platformId: { name: '平台' }},
	{ tenantId: { name: '租户', dataOnly: true }},
	{ url: { name: '店铺链接' }},
	{ ctime: { name: '创建时间' }},
	{ mtime: { name: '更新时间', dataOnly: true }}
], '/ecommerse/shop')
