import RestfulDomainModel from '../base/RestfulDomainModel'
/**
  * 产品SKU
 **/
class Model extends RestfulDomainModel {

}

export default new Model([
	{ id: { name: 'ID', dataOnly: true }},
	{ code: { name: '货号   ' }},
	{ price: { name: '销售价' }},
	{ costPrice: { name: '成本价' }},
	{ marketPrice: { name: '市场价' }},
	{ onSale: { name: '上下架' }},
	{ product: { name: '商品信息', dataOnly: true }},
	{ skuInventory: { name: '仓库库存信息', dataOnly: true }}
], '/ecommerse/sku')
