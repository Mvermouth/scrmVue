<template>
    <div class="category-layer">
        <div class="category-btn-group">
            <i-button type="success" icon="refresh" @click="refresh">刷新</i-button>
            <i-button type="success" icon="android-add" @click="addCategory({name: '顶级分类', id: 0})">添加分类</i-button>
            <i-button type="primary" :icon="isOpen?'android-remove':'android-add'" @click="openAllCategoryList">{{isOpen?'全部折叠':'全部展开'}}</i-button>
        </div>
        <div class="product-category-list">
            <table style="width:100%" cellspacing="0" cellpadding="0" border="0">
                <thead>
                    <tr>
                        <th>权重</th>
                        <th>分类名称</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(value, index) in handledproductCategoryVal" :key="index" v-show="!value.parentId || value.visible">
                        <td style="width:300px">
                            <div>
                                <div v-if="!value.editStatus" class="sort">
                                    <div class="num" :class="value.length>1?'num-have-children':''" :style="{'margin-left':value.length*60+'px'}">{{value.weight}}</div>
                                </div>
                                <input-number v-else :max="10000" :min="-10000" v-model="value.weight" class="w100"></input-number>
                                <span @click="editSort(value)">{{value.editStatus?'保存':'修改'}}</span>
                            </div>
                        </td>
                        <td>
                            <div class="name-layer" :class="value.length>1?'name-have-children':''" :style="{'margin-left':(value.length-1)*50+'px'}">
                                <div class="icon" @click="openCategoryList(value.open ,value.path,value.length)"><Icon :type="value.open?'ios-minus-outline':'ios-plus-outline'" size="16"></Icon></div>
                                <div class="name">{{value.name}}</div>
                                <div class="add-btn" @click="addCategory(value)"><span>+添加子分类</span></div>
                            </div>
                        </td>
                        <td style="width:120px;">
                            <div class="opration-btn">
                                <span @click="editCategory(value)">编辑</span>
                                <span @click="deleteProductCategoryList(value.id)">删除</span>    
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import CreateCategory from './components/create-category.vue'
import UpdateCategory from './components/update-category.vue'

import Category from '../../../../models/ecommerse/category'
export default {
	components: {
		CreateCategory,
		UpdateCategory
	},
	data() {
		return {
			isOpen: true,
			handledproductCategoryVal: []
		}
	},
	watch: {
		
	},
	mounted() {
		this.$nextTick(() => {
			this.handleProductCategory()
		})
	},
	methods: {
		handleProductCategory() {
			this.initData()
		},
		async initData() {
			const path = {}
			const id = ''
			const productCategory = await Category.expand()
			this._recursion(productCategory, this.handledproductCategoryVal, path, id)
		},
		_recursion(data, resultArray, map, id) {
			data.sort(this._compare('weight'))
			data.forEach((item, index) => {
				const params = {}
				params.weight = item.weight
				params.id = item.id
				params.name = item.name
				params.visible = true
				params.open = true
				params.editStatus = false
				if (item.parentId) {
					params.parentId = item.parentId
				}
				if (id == '') {
					map[item.id] = '/' + item.id
				} else {
					map[item.id] = map[id] + '/' + item.id
				}
				params.length = map[item.id].split('/').length - 1
				params.path = map[item.id]
				resultArray.push(params)
				if (item.children && item.children.length > 0) {
					this._recursion(item.children, resultArray, map, item.id)
				}
			})
		},
		async editSort(value) {
			if(value.editStatus) {
				await Category.update({ id: value.id, weight: value.weight, name: value.name })
					this.$Notice.success({title: '权重编辑成功'})
					this.handledproductCategoryVal = []
					this.handleProductCategory()
			}
			this.handledproductCategoryVal.forEach(async(item, index) => {
				if (item.id === value.id) {
					item.editStatus = !item.editStatus
				}
			})
		},
		openCategoryList(open, path, length) {
			this.handledproductCategoryVal.forEach((item, index) => {
				if (item.path.indexOf(path) > -1 && item.length > length) {
					item.open = !open
					if (!open) {
						item.visible = true
					} else {
						item.visible = false
					}
				}
				if (item.path === path) {
					item.open = !open
				}
			})
		},
		openAllCategoryList() {
			this.isOpen = !this.isOpen
			this.handledproductCategoryVal.forEach((item, index) => {
				item.visible = this.isOpen
				item.open = this.isOpen
			})
		},
		// 数组对象排序，通用函数，后续可以移到公共方法类
		_compare(prop) {
			return function(obj1, obj2) {
				let val1 = obj1[prop]
				let val2 = obj2[prop]
				if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
					val1 = Number(val1)
					val2 = Number(val2)
				}
				if (val2 > val1) {
					return -1
				} else if (val1 === val2) {
					return 0
				} else {
					return 1
				}
			}
		},
		/**
		 * 增加分类
		 */
		addCategory(value) {
			App.modal({
				title: '添加分类',
				width: 600,
				loading: true,
				render: h=> {
					h = this.$createElement
					return <create-category parentCategory={value}></create-category>
				},
				onOk: async(comp, modal) => {
					try {
						await comp.submit()
						this.$Notice.success({title: '添加分类成功'})
						App.removeModal()
						this.handledproductCategoryVal = []
						this.handleProductCategory()
					}catch(e) {
						modal.cancelLoading()
					}
				}
				
			})
		},
		/**
		 * 编辑分类
		 */
		editCategory(value) {
			console.log('parentId:', value.parentId, value)
			if(!value.parentId) {
				value.parentId = 0
				value.parentName = '顶级分类'
			}else{
				const parent = _.find(this.handledproductCategoryVal, {id: value.parentId})
				value.parentName = parent.name
			}
			App.modal({
				title: '编辑分类',
				width: 600,
				loading: true,
				render: h=> {
					h = this.$createElement
					return <update-category categoryDate={value}></update-category>
				},
				onOk: async(comp, modal) => {
					try {
						await comp.submit()
						this.$Notice.success({title: '编辑分类成功'})
						App.removeModal()
						this.handledproductCategoryVal = []
						this.handleProductCategory()
					}catch(e) {
						modal.cancelLoading()
					}
				}
				
			})
		},
		deleteProductCategoryList(id) {
			App.modal({
				title: '删除提示',
				content: '确定要删除么？',
				width: 500,
				loading: true,
				onOk: async(comp, modal) => {
					try{
						const result = await Category.delete(id)
						this.$Notice.success({title: '删除分类成功'})
						App.removeModal()
						this.handledproductCategoryVal = []
						this.handleProductCategory()
					}catch(e) {
						this.$Notice.error({title: '删除失败'})
						modal.cancelLoading()
					}
					await Category.delete(id)
				},
				onCancel: () => {

				}
			}, 'confirm')
		},
		refresh() {
			this.handledproductCategoryVal = []
			this.initData()
		}
	}
}
</script>


