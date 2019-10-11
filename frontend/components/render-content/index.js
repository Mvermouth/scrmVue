/**
 * 自定义 render
 */
export default {

	functional: true,

	props: {
		render: {
			type: Function,
			required: true
		}
	},

	render(_, ctx) {
		const h = ctx.parent.$createElement
		return ctx.props.render(h, ctx)
	}
}
