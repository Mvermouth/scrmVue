import '../../../../scripts/common/app'

import Group from '../../../../models/im/group'
import Relation from '../../../../models/im/relation'
import formItems from './form/form-items'
import View from '../../../../views/domain/update.vue'
(async() => {
	const retrieve = async id => {
		const defaults = App.data.domain
		if (defaults.tags && defaults.tags.length > 0) {
			defaults.tags = _.map(defaults.tags, it => { return { name: it, show: true } })
		}
		return defaults
	}

	const update = async data => {
		data.tags = data.tags.map(it => { return it.name })
		const extra = {
			uploadMsg: data.uploadMsg
		}
		const updateParams = {
			id: App.data.domain.id,
			extra: extra,
			tags: data.tags
		}
		return Relation.update(updateParams)
	}

	new Vue({
		el: '#app',
		render: h => {
			const v = h(View, {
				props: {
					domain: Group,
					formItems,
					defaults: retrieve,
					update
				}
			})
			return App.target === 'dialog' ? v : <card>{v}</card>
		}
	})
})()

