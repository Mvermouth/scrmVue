<template>
    <div class="category-layer">
        <ul class="category-content">
            <li v-for="(item,index) in categoryList" :key="index" v-show="!item.parentId || item.visible" >
                <checkbox v-model="item.checked" :style="{'margin-left':(item.length-1)*50+'px'}">{{item.name}}</checkbox>
                <div v-if="item.isHaveChildren" @click="openCategoryList(item.open ,item.path,item.length)">
                    <Icon :type="item.open?'arrow-up-b':'arrow-down-b'" size="18"></Icon>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
import Category from '../../../../../models/ecommerse/category'
export default {
	props: {
		//选中的分类
		category: {
			type: Array,
			required: false,
			default: () => {
				return []
			}
		}
	},
	data() {
		return {
			categoryList: []
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.initData()
		})
	},
	methods: {
		async initData() {
			const categoryList = await Category.expand()
			const path = {}
			const id = ''
			this._recursion(categoryList, this.categoryList, path, id, this.category)
		},
		_recursion(data, resultArray, map, id, selectedCategory) {
			data.sort(this._compare('weight'))
			data.forEach((item, index) => {
				const params = {}
				params.weight = item.weight
				params.id = item.id
				params.name = item.name
				params.visible = true
				params.open = true
				params.checked = _.some(selectedCategory, {id: item.id})
				if (item.children && item.children.length > 0) {
					params.isHaveChildren = true
				} else {
					params.isHaveChildren = false
				}
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
					this._recursion(item.children, resultArray, map, item.id, selectedCategory)
				}
			})
		},
		openCategoryList(open, path, length) {
			this.categoryList.forEach((item, index) => {
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
		// 数组对象排序，输入通用函数，后续可以移到公共方法类
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
		submit() {
			const result = _.map(_.filter(this.categoryList, it => { return it.checked }), item => { return { id: item.id, name: item.name } })
			return result
		}
	}
}
</script>

