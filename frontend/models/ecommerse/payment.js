import RestfulDomainModel from '../base/RestfulDomainModel'

class Model extends RestfulDomainModel {
	async createQrcode(data) {
		return await this.post(`${this.baseUrl}/createQrcode`, data)
	}
}

export default new Model([
	{ id: { name: 'ID', dataOnly: true }},
	{ tenantId: { name: '租户', dataOnly: true }},
	{ channel: { name: '支付渠道' }},
	{ amount: { name: '金额' }},
	{ deleted: { name: '是否删除', dataOnly: true }},
	{ ctime: { name: '创建时间' }},
	{ mtime: { name: '更新时间', dataOnly: true }}
], '/ecommerse/payment')
