import Vue from 'vue'

const Modal = {

	newInstance() {
		const instance = new Vue({
			data: {
				images: [],
				options: {}
			},
			render(h) {
				return <viewer options={this.options} trigger={this.images}>{this.images.map(it => <img src={it} key={it}/>)}</viewer>
			},
			methods: {
				destroy() {
					this.$destroy()
					document.body.removeChild(this.$el)
				}
			}
		})

		const component = instance.$mount()
		document.body.appendChild(component.$el)
		const modal = component.$children[0]

		return {

			open(options) {
				if (options.images) component.images = options.images
				if (options.options) component.options = options.options

				const index = Math.max(0, Math.min(options.index || 0, options.images ? options.images.length - 1 : 0))

				// 等待dom渲染完毕打开
				setTimeout(() => {
					modal.$viewer.show()
					if (index > 0) {
						modal.$viewer.view(index)
					}
				}, 0)
			},

			remove() {
				setTimeout(() => component.destroy(), 300)
			}
		}
	}
}

export default Modal
