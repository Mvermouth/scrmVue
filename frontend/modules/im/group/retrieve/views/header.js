/**
 * 构建 PageHeader 模版参数
 */
import AppRoutes from '../../../../../configs/AppRoutes'
import Profile from '../../../../../models/im/profile'
import Group from '../../../../../models/im/group'
import defaultAvatar from '../../../../../images/default-avatar.png'
export default relationGroup => {
	const group = relationGroup.group
	const profile = relationGroup.profile
	const profileName = profile.nickname || profile.platformUid || ''

	const profileUrl = AppRoutes.Profile.id(profile[Profile.primaryKey], profileName)
	const editUrl = AppRoutes.Group.update(relationGroup[Group.primaryKey], group.name)

	return {
		title: `群：${group.name || group.platformGid || '未知'}`,
		logo: group.avatar || defaultAvatar,
		content: [
			{ '群ID': group.platformGid || '' },
			{ '昵称': group.name || '' },
			{
				'归属微信': h => {
					return <a onClick={() => { App.push(profileUrl) }}>{(profile && (profile.nickname || profile.customID)) || ''}</a>
				}
			},

			{ '群主微信号': group.ownerCustomID || group.ownerPlatformUid || '' },
			{ '归属员工': (profile && profile.employee && (profile.employee.name + ' ' + profile.employee.sn)) || '' },
			{ '群成员数': group.memberCount || 0 },
			{ '群签名': { content: group.signature, long: true } }
		],
		extra: [
		],
		actions: [
			{ '编辑': () => { App.push(editUrl) } }
		],
		tabs: [
			{ '群成员': 'groupMember' }
		]
	}
}
