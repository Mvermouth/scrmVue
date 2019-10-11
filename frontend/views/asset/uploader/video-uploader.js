import parseFilename from '../utils/parseFilename'

import Constant from '../../../configs/constant'

export default {

	// iview upload 配置
	uploadProps: {
		accept: 'video/mp4'
		// format: ['png', 'jpg', 'jpeg', 'bmp', 'gif']
	},

	// 上传成功, 创建图片Asset数据
	onUploadSuccess(result, file, uploadAsset) {
		const { name, fileType } = parseFilename(result.name)
		const asset = {
			type: Constant.AssetType.Video.value,
			url: result.url,
			name,
			fileType,
			mimeType: uploadAsset.file.type,
			metadata: {
				size: uploadAsset.file.size,
				lastModified: uploadAsset.file.lastModified
			}
		}
		return asset
	}
}

