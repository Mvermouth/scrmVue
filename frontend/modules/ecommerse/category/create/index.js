import '../../../../scripts/common/app'

import Category from '../../../../models/ecommerse/category'
import formItems from './form/form-items'

import View from '../../../../views/domain/create.vue'
import { parseUrl } from '../../../../scripts/utils/url'

const { query } = parseUrl(location.href, true)
const parentId = query.parentId || 0;
(async() => {
	let parentCategory
	if (parentId) {
		parentCategory = await Category.retrieve(parentId)
	}
	const create = async data => {
		data.parentId = parentId
		await Category.create(data)
	}
	new Vue({
		el: '#app',
		data: {
			parentCategory: parentCategory
		},
		render: h => {
			const v = h(View, { props: {
				domain: Category,
				formItems,
				formProps: {
					labelWidth: 120
				},
				create
			}})
			return App.target === 'dialog' ? v : <card>{v}</card>
		}
	})
})()
