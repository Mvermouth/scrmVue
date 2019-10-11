import '../../../../scripts/common/app'

import Profile from '../../../../models/im/profile'
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
		const tags = data.tags.map(it => { return it.name })
		const updateParams = {
			id: data.id,
			tags: tags
		}
		const val = await Profile.update(updateParams)
		return val
	}

	new Vue({
		el: '#app',
		render: h => {
			const v = h(View, {
				props: {
					domain: Profile,
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

