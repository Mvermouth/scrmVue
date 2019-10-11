import '../../../../scripts/common/app'

import Relation from '../../../../models/im/relation'
import formItems from './form/form-items'

import View from '../../../../views/domain/update.vue'

(async() => {
	//platformTags -tags
	const retrieve = async id => {
		const defaults = App.data.domain
		if (defaults.platformTags && defaults.platformTags.length > 0) {
			defaults.platformTags = _.map(defaults.platformTags, it => { return { name: it, show: true } })
		}
		return defaults
	}

	const update = async data => {
		const platformTags = data.platformTags.map(it => { return it.name })
		const updateParams = {
			//id: data.id,
			fromCustomID:App.data.domain.fromId,
			toCustomID:App.data.domain.toId,
			alias:App.data.domain.alias,
			platformTags: platformTags
		}
		const val = await Relation.updatePlatformTags(updateParams)
		return val
	}

	new Vue({
		el: '#app',
		render: h => {
			const v = h(View, {
				props: {
					domain: Relation,
					formItems,
					formProps: {
						labelWidth: 130
					},
					defaults: retrieve,
					update
				}
			})
			return App.target === 'dialog' ? v : <card>{v}</card>
		}
	})
})()

