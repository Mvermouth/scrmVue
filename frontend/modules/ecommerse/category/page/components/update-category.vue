<template>
	<div>
		<i-form ref="form" :model="forms" :rules="ruleValidate" :label-width="120">
			<form-item label="分类名称：" prop="name">
				<i-input v-model="forms.name"></i-input>
			</form-item>
			<form-item label="权重：">
				<i-input v-model="forms.weight"></i-input>
			</form-item>
			<form-item label="父级分类：">
				<span>{{forms.parentName}}</span>
			</form-item>
			<form-item label="分类缩略图：">
				<div class="demo-upload-list" v-if="show">
					<template v-if="thumbnails.status === 'finished'">
						<img :src="image">
						<div class="demo-upload-list-cover">
							<Icon type="ios-eye-outline" ></Icon>
							<Icon type="ios-trash-outline" ></Icon>
						</div>
					</template>
					<template v-else>
						<Progress v-if="thumbnails.showProgress" :percent="thumbnails.percentage" hide-info></Progress>
					</template>
				</div>
				<div class="upload-btn" @click="clickUplaod">
					<Icon type="ios-camera" size="20"></Icon>
				</div>
				<Uploader 
				ref="upload" 
				url="/upload" 
				accept="image/*" 
				:multiple="false"
				@beforeUpload="_beforeUpload"
				@onProgress="_onUploadProgress"
				@onSuccess="_onUploadSuccess"
				@onError="_onUploadError"
				@onFormatError="_onFormatError"
				@onExceededSize="_onExceededSize"
				>
				</Uploader>
			</form-item>
		</i-form>
	</div>
</template>
<script>
import Category from '../../../../../models/ecommerse/category'
export default {
	props: {
		categoryDate: {
			type: Object,
			required: false
		}
	},
	data() {
		return {
			forms: {
				name: this.categoryDate.name,
				weight: this.categoryDate.weight,
				parentName: this.categoryDate.parentName,
				imageUrl: ''
			},
			ruleValidate: {
				name: [
					{required: true, message: '名称不能为空', trigger: 'blur'}
				]
			},
			thumbnails: {},
			show: false,
			image: ''

		}
	},
	methods: {
		//触发上传控件
		clickUplaod() {
			this.$refs.upload.handleClick()
		},
		_beforeUpload(file) {
			this.show = true
			this.thumbnails = {}
		},

		_onUploadProgress(event, file) {
			this.thumbnails = file
		},

		async _onUploadSuccess(result, file) {
			if(result.code == 0) {
				this.image = result.url
			}else {
				this.$Notice.error({title: '图片上传失败'})
				this.show = false
			}
		},

		_onUploadError(error, file) {

		},

		_onFormatError(file) {

		},

		_onExceededSize(file) {
			
		},
		async submit() {
			this.$refs.form.validate((valid) => {
				if(!valid) {
					return
				}
			})
			const param={
				id: this.categoryDate.id,
				name: this.forms.name,
				weight: this.forms.weight
			}
			await Category.update(param)
		}
	}
}
</script>

