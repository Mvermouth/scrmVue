import RestfulDomainModel from '../base/RestfulDomainModel'
import Contact from './contact'
export default new RestfulDomainModel([
	{ id: { name: 'ID', dataOnly: true }},
	{ platformGid: { name: '归属群ID' }},
	{ alias: { name: '群成员备注' }},
	{ contactId: { name: '群成员', dataOnly: true, include: Contact, as: 'contact' }},
	{ ctime: { name: '录入系统时间' }}
], '/im/groupMember')
