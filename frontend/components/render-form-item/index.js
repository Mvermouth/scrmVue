/**
 * 自定义 render 的 form-item 表单项，支持v-model
 */
export default {

	props: {

		value: {
			type: [String, Number, Object, Array, Date, Boolean]
		},

		render: {
			type: Function,
			required: true
		}
	},

	data() {
		return {
			model: this.value
		}
	},

	watch: {

		model() {
			this.$emit('input', this.model)
		},

		value() {
			this.model = this.value
		}
	},

	/**
     * 渲染实际的表单项，v-model透传
     *
     * @param {*} h
     */
	render(h) {
		return this.render.call(this, h)
	}
}
