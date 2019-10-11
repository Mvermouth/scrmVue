import RestfulDomainModel from '../base/RestfulDomainModel'

class Model extends RestfulDomainModel {

    async expand() {
        return await this.get(`${this.baseUrl}/expand`)
    }
}

export default new Model([], '/system/func')