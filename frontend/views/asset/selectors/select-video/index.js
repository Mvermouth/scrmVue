import _ from 'lodash'
import AssetManager from '../../asset-manager'
import Constant from '../../../../configs/constant'
import VideoUploader from '../../uploader/video-uploader'

export default {

	components: {
		AssetManager
	},

	props: {

		// v-model 控制选择器打开/关闭
		value: {
			type: Boolean,
			required: true
		},

		title: {
			type: String,
			required: false,
			default: '选择图片'
		},

		// 是否多选
		multiple: {
			type: Boolean,
			required: false,
			default: false
		}

	},

	data() {
		return {
			model: this.value,
			// 对话框确定/取消会自动关闭，这样v-model触发关闭时，导致重复关闭，通过该标志保护
			autoClosed: false,

			// 选择的素材
			selectedAssets: []
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

	render(h) {
		return h()
	},

	methods: {

		openSelector() {
			App.modal({
				title: this.title,
				width: 850,
				closable: true,
				render: h => {
					h = this.$createElement
					const props = {
						size: 'small',
						type: Constant.AssetType.Video.value,
						selection: this.multiple ? 'checkbox' : 'radio',
						uploadProps: VideoUploader.uploadProps,
						uploadText: '上传视频',
						onUploadSuccess: VideoUploader.onUploadSuccess,
						defaultCriterias: [
							{
								filterType: 'EQ',
								property: 'type',
								value: Constant.AssetType.Video.value
							}
						]
					}
					return <asset-manager {...{ props: props }} on-on-selected-assets={this.onSelectedAssets}></asset-manager>
				},
				onOk: () => {
					this.$emit('on-selected-assets', _.cloneDeep(this.selectedAssets))

					// 关闭
					this.selectedAssets = []
					this.autoClosed = true
					this.model = false
				},
				onCancel: () => {
					// 关闭
					this.selectedAssets = []
					this.autoClosed = true
					this.model = false
				},
				onClose: () => {
					// 关闭
					this.selectedAssets = []
					this.autoClosed = true
					this.model = false
				}
			})
		},

		closeSelector() {
			if (!this.autoClosed) {
				App.removeModal()
			}
			this.$nextTick(() => {
				this.autoClosed = false
			})
		},

		onSelectedAssets(assets) {
			this.selectedAssets = assets
		}
	}
}

