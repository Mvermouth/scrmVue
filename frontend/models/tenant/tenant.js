import RestfulDomainModel from '../base/RestfulDomainModel'
class Model extends RestfulDomainModel {
	async syncTenant() {
		return await this.post(`${this.baseUrl}/syncTenant`, {})
	}
	async syncVirtualDevice() {
		return await this.post(`${this.baseUrl}/syncVirtualDevice`, {})
	}
}

export default new Model([], '/tenant/tenant')
