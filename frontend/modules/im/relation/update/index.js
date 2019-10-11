import '../../../../scripts/common/app'

import Relation from '../../../../models/im/relation'
import formItems from './form/form-items'

import View from '../../../../views/domain/update.vue'

const retrieve = async id => {
	const defaults = App.data.domain
	if (defaults.tags && defaults.tags.length > 0) {
		defaults.tags = _.map(defaults.tags, it => { return { name: it, show: true } })
	}
	defaults.remark = _.result(defaults.extra, 'remark')
	return defaults
}

const update = async data => {
	const tags = data.tags.map(it => { return it.name })
	const updateParams = {
		id: data.id,
		tags: tags
	}
	if (data.remark) {
		const extra = { remark: data.remark }
		updateParams.extra = extra
	}
	return Relation.update(updateParams)
}

new Vue({
	el: '#app',
	render: h => {
		const v = h(View, {
			props: {
				domain: Relation,
				formItems,
				defaults: retrieve,
				update
			}
		})
		return App.target === 'dialog' ? v : <card>{v}</card>
	}
})
