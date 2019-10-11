import RestfulDomainModel from '../base/RestfulDomainModel'
import Contact from '../im/contact'
import Profile from '../im/profile'

export default new RestfulDomainModel([
    { id: { name: 'ID',dataOnly: true } },
    { tenantId: { name: '租户ID',dataOnly: true } },
    { profileId: { name: '运营号', dataOnly: true, include: Profile, as: 'profile'} },
    { contactId: { name: '好友', dataOnly: true, include: Contact, as: 'contact'} },
    { msgID: { name: '消息ID', dataOnly: true } },
    { recommendUid: { name: '推荐好友UID', dataOnly: true } },
    { recommendCustomID: { name: '推荐好友微信号' } },
    { recommendNick: { name: '推荐好友昵称' } },
    { isAdd: { name: '是否添加' } },
    { ctime: { name: '录入系统时间' } },
], '/im/recommendCard')
