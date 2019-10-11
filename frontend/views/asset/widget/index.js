import ImageWidget from './image-widget.vue'
import VideoWidget from './video-widget.vue'
import ImageUploadWidget from './image-upload-widget.vue'
import ImageErrorWidget from './image-error-widget.vue'

export default {

	components: {
		ImageWidget,
		ImageUploadWidget,
		ImageErrorWidget
		,VideoWidget
	},

	// 素材数据
	props: {
		asset: {
			type: Object,
			required: true
		}
	},

	methods: {

		renderAsset(h, asset) {
			switch (asset.type) {
				case 'image': {
					return <image-widget asset={asset}></image-widget>
				}
				case 'video': {
					return <video-widget asset={asset}></video-widget>
				}
			}
			return h()
		},

		renderError(h, asset) {
			const type = asset.file.type.split('/')[0]
			switch (type) {
				case 'image': {
					return <image-error-widget asset={asset}></image-error-widget>
				}
			}
			return h()
		},

		renderUploading(h, asset) {
			const type = asset.file.type.split('/')[0]
			switch (type) {
				case 'image': {
					return <image-upload-widget asset={asset}></image-upload-widget>
				}
			}
			return h()
		}
	},

	render(h) {
		if (this.asset.file && this.asset.file.constructor && this.asset.file.constructor.name === 'File') {
			if (this.asset.asset) {
				// 上传成功
				return this.renderAsset(h, this.asset.asset)
			}

			if (this.asset.error) {
				// 上传失败
				return this.renderError(h, this.asset)
			}

			// 上传中
			return this.renderUploading(h, this.asset)
		}

		// 已上传素材信息
		return this.renderAsset(h, this.asset)
	}

}
