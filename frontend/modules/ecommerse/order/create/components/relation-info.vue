<template>
    <page-info :logo="relation.contact.avatar" :content="content" :layout="{xs:12, sm:12, dm: 8, lg: 6, xl: 4}"></page-info>
</template>
<script>
import Relation from '../../../../../models/im/relation'
import Profile from '../../../../../models/im/profile'
import Constant from '../../../../../configs/constant'
import PageInfo from '../../../../../views/domain/retrieve/info.vue'
import { constantText, tags } from '../../../../../scripts/utils/page-renders'

import AppProxy from '../../../../../scripts/common/appProxy'
import AppRoutes from '../../../../../configs/AppRoutes'

export default {

	components: {
		PageInfo
	},

	props: {

		relation: {
			type: Object,
			required: true
		}
	},

	computed: {

		content() {
			const contact = this.relation.contact
			const profile = this.relation.profile
			const employee = profile.employee
			const contactId = contact.customerID || contact.platformUid
			const profileId = profile.customerID || profile.platformUid
			return [
				{
					title: contact.nickname,
					content: [
						{ '微信号': h => {
							const name = contactId
							return <a onClick={() => AppProxy.do_push(AppRoutes.Relation._(this.relation.profile.contactID, this.relation.contact.id, contact.nickname))}><div style = 'display: inline-block;overflow: hidden; white-space: nowrap; text-overflow: ellipsis; vertical-align: middle;'>{contactId}</div></a>
						} },
						{ '性别': h => {
							return constantText(h, contact.gender, Constant.Gender)
						} },
						{ '地区': [contact.country, contact.state, contact.city].filter(it => !!it).join('/') },
						// { '标签': h => {
						// 	return tags(h, this.relation.tags, 'blue')
						// } },
						{ '个性签名': { content: contact.signature, long: true }}
					]
				}
			]
		}
	}
}
</script>

