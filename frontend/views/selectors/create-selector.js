import _ from 'lodash'

import DomainPage from '../domain/page.vue'

/**
 * 创建一个基于 DomainPage 的选择器
 *
 * @param {*} defaultDomainPageProps    透传给 domain-page 的参数
 */
export default function(defaultDomainPageProps) {
	return {

		components: {
			DomainPage
		},

		props: {

			// v-model 控制选择器打开/关闭
			value: {
				type: Boolean,
				required: true
			},

			// 选择器标题
			title: {
				type: String,
				required: true
			},

			// 选择器标题
			width: {
				type: Number,
				required: false
			},

			// 覆盖默认的 domain-page 参数
			domainPageProps: {
				type: Object,
				required: false,
				default() {
					return {}
				}
			}
		},

		data() {
			return {
				model: this.value,
				selectedRows: [],
				defaultDomainPageProps,

				// 对话框确定/取消会自动关闭，这样v-model触发关闭时，导致重复关闭，通过该标志保护
				autoClosed: false
			}
		},

		watch: {

			value() {
				this.model = this.value
			},

			model() {
				this.$emit('input', this.model)
				this.model ? this.openSelector() : this.closeSelector()
			}
		},

		computed: {

			selectorProps() {
				return _.assign(_.cloneDeep(this.defaultDomainPageProps), this.domainPageProps)
			}
		},

		methods: {

			openSelector() {
				App.modal({
					title: this.title,
					width: this.width || 'large',
					closable: true,
					render: h => {
						h = this.$createElement
						return <domain-page {...{ props: this.selectorProps }} on-on-selected-rows={this.onSelectedRows}></domain-page>
					},
					onOk: () => {
						// 传递选择结果
						this.$emit('on-selected-rows', this.selectedRows)

						// 关闭
						this.autoClosed = true
						this.model = false
					},
					onCancel: () => {
						// 关闭
						this.autoClosed = true
						this.model = false
					},
					onClose: () => {
						// 关闭
						this.autoClosed = true
						this.model = false
					}
				})
			},

			closeSelector() {
				this.selectedRows = []
				if (!this.autoClosed) {
					App.removeModal()
				}
				this.$nextTick(() => {
					this.autoClosed = false
				})
			},

			onSelectedRows(selectedRows) {
				this.selectedRows = selectedRows
			}
		},

		render(h) {
			return h()
		}
	}
}
