import RestfulDomainModel from '../base/RestfulDomainModel'

class Model extends RestfulDomainModel {

}

export default new Model([
	{ id: { name: '收件人姓名', dataonly: true }},
	{ orderId: { name: '订单ID' }},
	{ productSku: { name: '商品SKU', dataonly: true }},
	{ productName: { name: '商品名称' }},
	{ totalAmount: { name: '商品总金额' }},
	{ warehouseId: { name: '商品仓库', dataonly: true }},
	{ price: { name: '单价' }},
	{ quantity: { name: '数量' }},
	{ discountAmount: { name: '折扣金额' }}
], '/ecommerse/orderItem')
