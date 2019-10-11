export default [
	{
		prop: 'content',
		label: '分享内容',
		rule: { required: true, message: '分享内容为必填项', trigger: 'blur' },
		render(h) {
			h = this.$root.$createElement
			const uploadType = [{ icon: 'document-text', label: '文字', name: 'text' }, { icon: 'image', label: '图片', name: 'image' }, { icon: 'android-image', label: '图文', name: 'imageText' }, { icon: '', label: '活动', name: 'activity' }]
			return <share-content v-model={ this.model } uploadType={ uploadType }></share-content>
		}
	}
]

