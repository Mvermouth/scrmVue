import Modal from './modal'

let instance

const getInstance = function() {
	instance = instance || Modal.newInstance()
	return instance
}

export default {

	open(options) {
		const instance = getInstance()
		instance.open(options)
	},

	remove() {
		instance = getInstance()
		if (instance) {
			instance.remove()
			instance = null
		}
	}
}
