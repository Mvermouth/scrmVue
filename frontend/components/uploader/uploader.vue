<template>
	<upload
	ref="upload"  
	:action="url"
	:multiple="multiple"
	:accept="accept"
	:max-size="maxSize"
	:showUploadList="false"
	:beforeUpload="beforeUpload"
	:onProgress="onUploadProgress"
	:onSuccess="onUploadSuccess"
	:onError="onUploadError"
	:onFormatError="onFormatError"
	:onExceededSize="onExceededSize"
	@click="handleClick"
	>
	</upload>
</template>

<script>
export default {
	props: {
		url: {
			type: String,
			required: true
		},
		accept: {
			type: String,
			required: false
		},
		multiple: {
			type: Boolean,
			required: false,
			default: false
		},
		maxSize: {
			type:Number,
			required: false,
			default: 1024
		}
	},
	data() {
		return {

		}
	},
	methods: {
		/*
		* 外面点击事件透传
		*/
		handleClick() {
			this.$refs.upload.handleClick()
		},
		beforeUpload(file) {
			this.$emit('beforeUpload', file)
		},

		onUploadProgress(event, file) {
			this.$emit('onProgress', event, file)
		},

		onUploadSuccess(result, file) {
			this.$emit('onSuccess', result, file)
		},

		onUploadError(error, file) {
			this.$emit('onError', error, file)
		},

		onFormatError(file) {
			this.$emit('onFormatError', file)
		},

		onExceededSize(file) {
			this.$emit('onExceededSize', file)
		}
	}
}
</script>

