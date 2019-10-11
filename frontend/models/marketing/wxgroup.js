import RestfulDomainModel from '../base/RestfulDomainModel'
//这里方法触发去对应的controler
class Model extends RestfulDomainModel {
    async create(params){
        return await this.post(`${this.baseUrl}/create`, params);
    }

    async resend(params){
        return await this.post(`${this.baseUrl}/resend`, params);
    }
}

export default new Model([
    { id: { name: 'ID', dataOnly: true }},
    { history: { name: '历史信息' }}
], '/marketing/wxgroup') //请求地址
