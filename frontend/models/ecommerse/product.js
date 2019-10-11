import RestfulDomainModel from '../base/RestfulDomainModel'
import Brand from './brand'
import Category from './category'
/**
  * 商品
 **/
class Model extends RestfulDomainModel {
	async batchChangePrice(params) {
		return await this.post(`${this.baseUrl}/batchChangePrice`, params)
	}
	async batchUnSale(params) {
		return await this.post(`${this.baseUrl}/batchUnSale`, params)
	}
}

export default new Model([
	{ id: { name: 'ID', dataOnly: true }},
	{ image: { name: '商品图片' }},
	{ name: { name: '商品名称' }},
	{ sn: { name: '商品编码' }},
	{ shortName: { name: '简称', dataOnly: true }},
	{ brief: { name: '商品简介' }},
	{ brandId: { name: '品牌', dataOnly: true, include: Brand, as: 'brand' }},
	{ categories: { name: '分类', dataOnly: true, include: [Category], as: 'categories' }},
	{ manufacturer: { name: '生产厂商', dataOnly: true }},
	{ productArea: { name: '商品产地', dataOnly: true }},
	{ supplierId: { name: '供应商', dataOnly: true }},

	{ description: { name: '商品描述' }},
	{ price: { name: '售价' }},
	{ costPrice: { name: '成本价', dataOnly: true }},
	{ marketPrice: { name: '市场价' }},
	{ note: { name: '备注', dataOnly: true }},
	{ unit: { name: '单位', dataOnly: true }},
	{ isVirtual: { name: '虚拟物品', dataOnly: true }},
	{ onSale: { name: '是否上架', dataOnly: true }},
	{ isPrivate: { name: '私有商品', dataOnly: true }},
	{ tags: { name: '商品标签' }},
	{ ctime: { name: '创建时间' }}
], '/ecommerse/product')
