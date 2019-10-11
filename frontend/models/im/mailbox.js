import RestfulDomainModel from '../base/RestfulDomainModel'
export default new RestfulDomainModel([
    { id: { name: 'ID',dataOnly: true } },
    { title: { name: '标题' } },
    { senderType: { name: '发送者类型',dataOnly: true } },
    { senderId: { name: '发送者ID' ,dataOnly: true} },
    { receiverType: { name: '接收者类型',dataOnly:true } },
    { receiverId: { name: '接收者ID',dataOnly:true } },
    { resourceType: { name: '资源类型',dataOnly: true } },
    { resourceId: { name: '资源ID' } },
    { ctime: { name: '创建时间' } }
], '/im/mailbox')
