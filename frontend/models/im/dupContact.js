import RestfulDomainModel from '../base/RestfulDomainModel'
import Contact from '../im/contact'
class Model extends RestfulDomainModel {
    async pageDupContacts(platformUid, pageNo, pageSize, direction) {
        return await this.get(`${this.baseUrl}/pageDupContacts`, { platformUid, pageNo, pageSize, direction })
    }
}

export default new Model([
    { count: { name: '重复次数'} },
    { contactId: { name: '好友', dataOnly: true, include: Contact, as: 'contact'} }
], '/im/relation')
