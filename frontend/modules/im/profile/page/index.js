import '../../../../scripts/common/app'
import Profile from '../../../../models/im/profile'

import formItems from './table/form-items'
import columns from './table/columnsv2'
import View from '../../../../views/domain/page.vue'
const fillData = async(page) => {
	// 查询部门
	const contactIds = page.content.map(it => it.contactID)
	// 查询重复好友数
	const dupProfiles = contactIds.length > 0 ? (await Profile.batchRetrieveDuplicatedContactsCount(contactIds)) : { content: {}}
	const profile2CountMap = dupProfiles
	page.content.forEach(it => {
		it.dupCount = profile2CountMap[it.contactID] || 0
	})
}
(async() => {
	const defaultSort = [
		{
			'ignoreCase': false,
			'property': 'ctime',
			'type': 'DSC'
		}
	]
	const forms = await formItems()
	new Vue({
		el: '#app',
		render: h => {
			const v = h(View, { props: {
				loadPage: async(pageNo, pageSize, filter, sort) => {
					const page = await Profile.page(pageNo, pageSize, filter, sort)
					try {
						await fillData(page)
					} catch (error) {
						console.log('error:', error)
					}
					return page
				},
				formItems: forms,
				formProps: {
					labelWidth: 120
				},
				columns,
				domain: Profile,
				defaultCriterias: [
					{
						filterType: 'EQ',
						property: 'deleted',
						value: false
					}
				],
				defaultSort,
				actions: ['view']
			}})
			return <card>{v}</card>
		}
	})
})()

