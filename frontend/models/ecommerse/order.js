import RestfulDomainModel from '../base/RestfulDomainModel'
import Address from './address'
import OrderItem from './orderItem'
class Model extends RestfulDomainModel {
	async operateOrder(model) {
		return this.post(`${this.baseUrl}/operateOrder`, model)
	}
	async operations(id) {
		return this.post(`${this.baseUrl}/operations/${id}`)
	}
	async orderRemarks(id) {
		return this.post(`${this.baseUrl}/orderRemarks/${id}`)
	}
	async addOrderRemark(data) {
		return this.post(`${this.baseUrl}/addRemark`, data)
	}
	async pageNoAuth(pageNo, pageSize, filter, sort) {
		return this.post(`${this.baseUrl}/pageNoAuth`, { pageNo, pageSize, filter, sort })
	}
	async importExpress(data) {
		return this.post(`${this.baseUrl}/importExpress`, data)
	}
	async orderAction(data) {
		return this.post(`${this.baseUrl}/orderAction`, data)
	}
}

export default new Model([
	{ id: { name: 'ID', dataOnly: true }},
	{ sn: { name: '订单编号' }},
	{ tenantId: { name: '租户', dataOnly: true }},
	{ parentId: { name: '父订单', dataOnly: true }},
	{ orderStatus: { name: '订单状态' }},
	{ orderType: { name: '订单类型' }},
	{ shipStatus: { name: '物流状态' }},
	{ payStatus: { name: '支付状态' }},
	{ addressId: { name: '地址', dataOnly: true, include: Address, as: 'address' }},
	{ invoicePayee: { name: '发票抬头', dataOnly: true }},
	{ invoiceContent: { name: '发票内容', dataOnly: true }},
	{ platformId: { name: '订单平台' }},
	{ orderItemIds: { name: '订单子项', dataOnly: true, include: [OrderItem], as: 'orderItems' }},
	{ platformUid: { name: '订单所属用户ID', dataOnly: true }},
	{ creatorUid: { name: '下单人ID', dataOnly: true }},
	{ clientRemark: { name: '客户备注' }},
	{ deleted: { name: '是否删除', dataOnly: true }},
	{ mtime: { name: '更新时间', dataOnly: true }}
], '/ecommerse/order')
