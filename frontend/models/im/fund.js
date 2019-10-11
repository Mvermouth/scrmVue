import RestfulDomainModel from '../base/RestfulDomainModel'
import Profile from './profile'
import Contact from './contact'
class Model extends RestfulDomainModel {
    async statistics(pageNo, pageSize, filter, sort) {
        return await this.post(`${this.baseUrl}/statistics`, {pageNo, pageSize, filter, sort})
    }
}
export default new Model([
    { id: { name: 'ID' ,dataOnly: true} },
    { profileId: { name: '运营号', dataOnly: true, include: Profile, as: 'profile'} },
    { contactId: { name: '接收者', dataOnly: true, include: Contact, as: 'contact'} },
    { type: { name: '交易类型' } },
    { direction: { name: '方向' } },
    { amount: { name: '转账金额' } },
    { sendTime: { name: '发送时间' } },
    { receiveTime: { name: '接收时间',dataOnly: true } },
    { ctime: { name: '创建时间' } }
], '/im/fund')
