import '../../../../scripts/common/app'
import View from '../../../../views/asset/asset-manager'
import Constant from '../../../../configs/constant'
import ImageUploader from '../../../../views/asset/uploader/image-uploader'

new Vue({
	el: '#app',
	render: h => {
		const v = h(View, {
			props: {
				type: Constant.AssetType.Image.value,
				actions: ['view', 'delete'],
				uploadText: '上传图片',
				uploadProps: ImageUploader.uploadProps,
				onUploadSuccess: ImageUploader.onUploadSuccess
			}
		})
		return <card>{v}</card>
	}
})

