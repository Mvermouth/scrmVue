import '../../../../scripts/common/app'

import Relation from '../../../../models/im/relation'
import formItems from './form/form-items'

import View from '../../../../views/domain/update.vue'

(async() => {
	const retrieve = async id => {
		const defaults = App.data.domain
		defaults.remark = _.result(defaults.extra, 'remark')
		return defaults
	}

	const update = async data => {
		const extra = {}
		extra.remark = _.result(data, 'remark')
		const updateParams = {
			id: data.id,
			extra: extra
		}
		const val = await Relation.update(updateParams)
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
						labelWidth: 60
					},
					defaults: retrieve,
					update
				}
			})
			return App.target === 'dialog' ? v : <card>{v}</card>
		}
	})
})()

