import createSelector from '../../../../../views/selectors/create-selector'

// import Profile from '../../../models/im/profile'
// import columns from './columns'
// import formItems from './form-items'

import formItems from '../../../../im/profile/page/table/form-items'
import columns from './columnsv'
//import columns from '../../../../im/profile/page/table/columnsv2'
import Profile from '../../../../../models/im/profile'

const defaultSort = [
	{
		'ignoreCase': false,
		'property': 'ctime',
		'type': 'DSC'
	}
]
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
const selector = createSelector({
    // loadPage: async(pageNo, pageSize, filter, sort) => {
    //     const page = await Profile.page(pageNo, pageSize, filter, sort)
    //     try {
    //         await fillData(page)
    //     } catch (error) {
    //         console.log('error:', error)
    //     }
    //     return page
    // },
	domain: Profile,
	formItems:formItems(),
	formProps: {
		labelWidth: 85,
		expandRow: 1
	},
	columns,
	defaultPageSize: 10,
	size: 'small',
	defaultCriterias: [
		{
			filterType: 'EQ',
			property: 'deleted',
			value: false
		}
	],
	defaultSort,
	selection: true
})

export default selector
