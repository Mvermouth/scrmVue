<template>
    <div>
        <Page v-bind="pageProps" />
        <upload action="/upload" ref="uploader" :on-success="handleUploadSuccess"/>
    </div>
</template>
<script>
import Page from '../../../../views/domain/page.vue'
import formItems from './table/form-item'
import Video from '../../../../models/matter/video'
import parseFilename from '../../../../views/asset/utils/parseFilename'
import Constant from '../../../../configs/constant'
import Asset from '../../../../models/matter/asset'

import VideoListItem from './video-list-item.vue'

export default {
	components: {
		Page,
		VideoListItem
	},
	props: {
		defaultCriterias: {
			type: Array
		}
	},
	data() {
		return {
			pageProps: {
				defaultCriterias: this.defaultCriterias,
				display: 'grid',
				formItems: formItems,
				domain: Video,
				actions: [
					{
						upload: {
							title: '上传视频',
							type: 'primary',
							unauthorize: true,
							onAction: ($list, rows) => {
								this.$refs.uploader.handleClick();
							}
						}
					}
				],
				renderGrid: (h, ctx, $grid) => {
					h = this.$root.$createElement

					return <VideoListItem item={ctx.row}/>
				}
			}
		}
	},
	methods: {
		async handleUploadSuccess(result) {
			console.log('result: ', result)
			if (result.code !== 0) {
				this.$Notice.error({ title: `上传文件失败: ${result.msg}` })
				return
			}

			const { name, fileType } = parseFilename(result.name)
			const asset = {
				type: Constant.AssetType.Video.value,
				url: result.url,
				name: result.name,
				fileType: fileType,
				mimeType: fileType,
				metadata: {
				// size: uploadAsset.file.size,
				// lastModified: uploadAsset.file.lastModified
				}
			}
			const upAsset = await Asset.create(asset)
			console.info('upAsset: ', upAsset)
			// this.$refs.domainPage.$refs.list.replace(it => it === uploadAsset, uploadAsset)
		}
	}
}
</script>