import RestfulDomainModel from '../base/RestfulDomainModel'
class Model extends RestfulDomainModel {
	async importContact(data) {
		return await this.post(`${this.baseUrl}/importContact`, data)
	}
}

export default new Model([
], '/dms/contact')
