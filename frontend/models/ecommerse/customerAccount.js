import RestfulDomainModel from '../base/RestfulDomainModel'

class Model extends RestfulDomainModel {
	async retrieveByPlatformUidAndId(platformUid, platformId) {
		return await this.get(`${this.baseUrl}/retrieveByPlatformUidAndId`, { platformId, platformUid })
	}
}

export default new Model([
], '/ecommerse/customerAccount')
