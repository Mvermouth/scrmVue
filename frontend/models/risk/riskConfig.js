import RestfulDomainModel from '../base/RestfulDomainModel'
class Model extends RestfulDomainModel {
	async retrieveByRefId(refId) {
		return await this.get(`${this.baseUrl}/retrieveByRefId`, { refId: refId })
	}
}

export default new Model([], '/risk/riskConfig')
