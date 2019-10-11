import RestfulDomainModel from '../base/RestfulDomainModel'

import Role from './role'

export default new RestfulDomainModel([
    { id: { name: 'ID', dataOnly: true } },
    { name: { name: '名称', dataOnly: true } },
    { pid: { name: '父级组', dataOnly: true } },
    { tenantId: { name: '租户', dataOnly: true } },
    { children: { name: '下级组', dataOnly: true } },
    { roleIds: { name: '所有成员', dataOnly: true, include: [Role], as: 'roles', retrieve: true, deep: true } },
    { currentRoleIds: { name: '自己成员', dataOnly: true, include: [Role], as: 'currentRoles', retrieve: true, deep: true } }
], '/auth/group')