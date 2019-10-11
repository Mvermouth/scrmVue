import RestfulDomainModel from '../base/RestfulDomainModel'

class Model extends RestfulDomainModel {

}

export default new Model([
	{ id: { name: 'ID', dataonly: true }},
	{ orderId: { name: '订单ID', dataonly: true }},
	{ orderSn: { name: '订单编号' }},
	{ operateType: { name: '操作类型' }},
	{ operatorId: { name: '操作人ID' }},
	{ operatorName: { name: '操作人姓名', dataonly: true }},
	{ content: { name: '操作内容' }}
	// { quantity: { name: '数量' }},
	// { discountAmount: { name: '折扣金额' }}
], '/ecommerse/orderAudit')
