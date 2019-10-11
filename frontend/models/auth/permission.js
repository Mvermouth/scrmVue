import RestfulDomainModel from '../base/RestfulDomainModel'
class Model extends RestfulDomainModel {

    async list() {
        return await this.get(`${this.baseUrl}/list`)
    }
}

export default new Model([], '/auth/permission')
