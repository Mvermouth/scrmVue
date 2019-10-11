export default [
	{
		prop: 'name',
		label: '分类名称',
		rule: { required: true, message: '请输入分类名称' },
		render(h) {
			return <i-input v-model={this.model} placeholder='请输入分类名称'></i-input>
		}
	},
	{
		prop: 'weight',
		label: '权重',
		default: 0,
		render(h) {
			return <i-input v-model={this.model} placeholder='请输入排序'></i-input>
		}
	},
	{
		prop: 'parentId',
		label: '父级分类',
		rule: { required: false, message: '请选择父级分类' },
		render(h) {
			const parentCategory = this.$root.parentCategory
			let parentCategoryName = '顶级分类'
			if (parentCategory) {
				parentCategoryName = parentCategory.name
			}
			return <span>{parentCategoryName}</span>
		}
	},
	{
		prop: 'imageUrl',
		label: '分类缩略图',
		render(h) {
			return <i-input v-model={this.model} placeholder='上传'></i-input>
		}
	}
]
