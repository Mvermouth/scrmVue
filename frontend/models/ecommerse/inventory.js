import RestfulDomainModel from '../base/RestfulDomainModel'

class Model extends RestfulDomainModel {
	// async page(pageNo, pageSize, filter, sort) {
	// 	return await this.post(`${this.baseUrl}/page`, { pageNo, pageSize, filter, sort })
	// }
	transformResult(data) {
		// 规格描述
		data.specDesc = [...Array(6).keys()].map(it => data[`exStr${it}`]).filter(it => !!it).join(',')
	}
	async pageNoAuth(pageNo, pageSize, filter, sort) {
		const result = await this.post(`${this.baseUrl}/pageNoAuth`, { pageNo, pageSize, filter, sort })
		result.content.forEach(this.transformResult)
		return result
	}
}

export default new Model([
	{ id: { name: 'ID', dataOnly: true }},
	{ productImage: { name: '图片' }},
	{ productName: { name: '名称' }},
	{ code: { name: '货号' }},
	{ productId: { name: '商品ID', dataOnly: true }},
	{ skuId: { name: 'skuID', dataOnly: true }},
	{ specDesc: { name: '规格' }},
	{ quantity: { name: '库存' }},
	{ frozen: { name: '锁库存阀值', dataOnly: true }},
	{ warehouseId: { name: '仓库ID', dataOnly: true }},
	{ price: { name: '销售价' }},
	{ marketPrice: { name: '市场价', dataOnly: true }},
	{ warehouseName: { name: '仓库' }},
	{ onSale: { name: '上架' }},
	{ deleted: { name: '是否删除', dataOnly: true }},
	{ ctime: { name: '创建时间', dataOnly: true }},
	{ mtime: { name: '更新时间', dataOnly: true }}
], '/ecommerse/inventory')
