import RestfulDomainModel from '../base/RestfulDomainModel'

class Model extends RestfulDomainModel {
	async expressList() {
		return this.get(`${this.baseUrl}/expressList`)
	}
	async refreshShipInfo(id) {
		return this.get(`${this.baseUrl}/refreshShipInfo/${id}`)
	}
}

export default new Model([

], '/ecommerse/shipInfo')
