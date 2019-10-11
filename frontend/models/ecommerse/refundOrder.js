import RestfulDomainModel from '../base/RestfulDomainModel'
import Address from './address'
import OrderItem from './orderItem'
class Model extends RestfulDomainModel {
	async operateOrder(model) {
		return this.post(`${this.baseUrl}/operateOrder`, model)
	}
}

export default new Model([
	{ id: { name: 'ID', dataOnly: true }},
	{ sn: { name: '退货编号' }},
	{ orderSn: { name: '订单编号' }},
	{ platformUId: { name: '退款用户', dataOnly: true }},
	{ refundAmount: { name: '退款金额', dataOnly: true }},
	{ refundStatus: { name: '退款状态', dataOnly: true }},
	{ status: { name: '退货状态', dataOnly: true }},
	{ internalRemark: { name: '备注' }},
	{ addressId: { name: '地址', dataOnly: true, include: Address, as: 'address' }},
	{ orderItemIds: { name: '订单商品', dataOnly: true, include: [OrderItem], as: 'orderItems' }}
], '/ecommerse/refundOrder')
