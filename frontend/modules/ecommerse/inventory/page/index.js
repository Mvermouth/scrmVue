import '../../../../scripts/common/app'
import Inventory from '../../../../models/ecommerse/inventory'
import WareHouse from '../../../../models/ecommerse/warehouse'

import formItems from './table/form-items'
import columns from './table/columns'
import View from '../../../../views/domain/page.vue'
(async() => {
	const defaultSort = [
		{
			'ignoreCase': false,
			'property': 'ctime',
			'type': 'DSC'
		}
	]
	const wareHouseFilter = [
		{
			filterType: 'EQ',
			property: 'deleted',
			value: false
		}
	]
	const skuInventoryFilter = [
		{
			filterType: 'EQ',
			property: 'deleted',
			value: false
		},
		{
			filterType: 'EQ',
			property: 'onSale',
			value: true
		}
	]
	const warehouses = await WareHouse.pageNoAuth(1, 100, wareHouseFilter, [], true)
	new Vue({
		el: '#app',
		data: {
			warehouses: warehouses.content
		},
		render: h => {
			const v = h(View, { props: {
				formItems,
				columns,
				defaultCriterias: skuInventoryFilter,
				domain: Inventory,
				defaultSort,
				actions: ['view', 'create']
			}})
			return <card>{v}</card>
		}
	})
})()
