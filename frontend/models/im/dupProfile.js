import RestfulDomainModel from '../base/RestfulDomainModel'
import Profile from './profile'

class Model extends RestfulDomainModel {
    async pageDupFans(platformUid, pageNo, pageSize, direction) {
        return await this.get(`${this.baseUrl}/pageDupFans`, { platformUid, pageNo, pageSize, direction })
    }
}
export default new Model([
    { count: { name: '重复好友数'} },
    { profileId: { name: '运营号', dataOnly: true, include: Profile, as: 'profile'} }
], '/im/profile')
