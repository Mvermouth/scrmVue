import '../../../../scripts/common/app'
import Relation from '../../../../models/im/relation'

import formItems from './table/form-items'
import columns from './table/columns'
import requestColumns from './table/request/columns'
import View from '../../../../views/domain/tabs-page.vue'
import ModalUim from '../../../../views/modals/uim/index.vue'
import Constant from '../../../../configs/constant'
(async () => {
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
		components: {
			ModalUim
		},
		render: h => {
			const v = h(View, {
				props: {
					formItems: forms,
					formProps: {
						labelWidth: 120
					},
					domain: Relation,
					tabs: [
						{
							name: 'contact',
							label: '微信好友',
							columns,
							defaultCriterias: [
								{
									filterType: 'EQ',
									property: 'contact.type',
									value: Constant.IMContactType.Person.value
								},
								{
									filterType: 'EQ',
									property: 'status',
									value: Constant.ImRelationStatus.Contact.value
								},
								{
									filterType: 'NE',
									property: 'blacklistByContact',
									value: 1
								},
								{
									filterType: 'NE',
									property: 'blacklistByAccount',
									value: 1
								}
							],
							defaultSort,
							actions: ['view']
						},

						{
							name: 'deleted_contact',
							label: '已删除好友',
							columns,
							loadPage: Relation.pageDelete.bind(Relation),
							defaultCriterias: [
								{
									filterType: 'EQ',
									property: 'contact.type',
									value: 0
								}
							],
							defaultSort,
							actions: ['view']
						},
						{
							name: 'request_contact',
							label: '好友请求',
							columns: requestColumns,
							defaultCriterias: [
								{
									filterType: 'EQ',
									property: 'contact.type',
									value: 0
								},
								{
									filterType: 'EQ',
									property: 'status',
									value: Constant.ImRelationStatus.RequestAccount.value
								}
							],
							defaultSort: [
								{
									'ignoreCase': false,
									'property': 'requestTime',
									'type': 'DSC'
								}
							],
							actions: ['view']
						}
					]
				}
			})
			return <div><card>{v}</card><modal-uim/></div>
		}
	})
})()
