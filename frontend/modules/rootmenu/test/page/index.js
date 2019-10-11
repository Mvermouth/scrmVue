import '../../../../scripts/common/app'
import testmenu from './components/testmenu.vue'
import columns from './table/columnsv'
import rootmenu from '../../../../models/rootmenu/test'
import Profile from '../../../../models/im/profile'
import View from '../../../../views/domain/page.vue'
import formItems from './table/form-items'


// var b = rootmenu.page(1,"");
// console.log(b);
// b.then(function(reslove,reject){
// 	console.log(reslove);
// });
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
new Vue({
	el: '#app',
	render: h => {		
		const v = h(View,{props:{
			formItems
			,domain: rootmenu
			,columns
			// ,loadPage: async(pageNo, pageSize, filter, sort) => {
			// 	const page = await Profile.page(pageNo, pageSize, filter, sort)
			// 	try {
			// 		await fillData(page)
			// 	} catch (error) {
			// 		console.log('error:', error)
			// 	}
			// 	return page
			// }
		}})
		return <card>{v}</card>
	}
})

