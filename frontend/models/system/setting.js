import RestfulDomainModel from '../base/RestfulDomainModel'

class Model extends RestfulDomainModel {
	async updateControl(model) {
		return await this.post(`${this.baseUrl}/updateControl`, model)
	}

	async updateAction(model) {
		return await this.post(`${this.baseUrl}/updateAction`, model)
	}
}

export default new Model([], '/system/setting')
