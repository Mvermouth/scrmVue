
<template>
    <Card :padding="16">
        <p slot="title">
            功能菜单
        </p>
        <a href="#" slot="extra" @click.prevent="expand">
            {{isExpand?'收起':'展开'}}
        </a>
        <Tree :class="clsPrefix+'tree'" :data="datas" :render="renderNode" @on-select-change="onSelectChange" empty-text="暂无菜单"></Tree>
    </Card>
</template>
<script>
import Func from '../../../../../models/system/func.js'
export default {
	props: {
		value: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			clsPrefix: `${App.options.styles.prefix}`, // 样式前缀
			datas: [],
			isExpand: false,
			model: this.value
		}
	},
	mounted() {
		this.initData()
	},
	watch: {
		isExpand(val) {
			this.expandTree(this.datas, val)
		},
		model(val) {
			if (Object.keys(val).length < 1) {
				this.initData()
			}
			this.$emit('input', this.model)
		},
		value(value) {
			this.model = value
		}
	},
	methods: {
		async initData() {
			const result = await Func.expand()
			this.tranformData(result)
			this.datas = result
		},
		tranformData(data) {
			data.forEach(it => {
				it.title = it.name
				it.expand = false
				it.selected = false
				if (it.children && it.children.length > 0) {
					this.tranformData(it.children)
				}
			})
		},
		expandTree(data, isExpand) {
			data.forEach(it => {
				it.expand = isExpand
				if (it.children && it.children.length > 0) {
					this.expandTree(it.children, isExpand)
				}
			})
		},
		selectTreeNode(data, isSelect) {
			data.forEach(it => {
				it.selected = isSelect
				if (it.children && it.children.length > 0) {
					this.selectTreeNode(it.children, isSelect)
				}
			})
		},
		expand() {
			this.isExpand = !this.isExpand
		},
		// 给每个树节点加上icon
		renderNode(h, { root, node, data }) {
			const icon = data.icon ? JSON.parse(data.icon) : { name: '', value: '' }
			return	<span onClick={() => { this.selectTreeNode(this.datas, false); data.selected = true; this.onSelectChange(data) }}>
						<icon-font name={icon.name} value={icon.value}></icon-font>
					<span class={{ 'ivu-tree-title-selected': data.selected, 'ivu-tree-title': true }}>{data.name}</span>
			</span>
		},
		// 选中选择的菜单通过v-model传递出去
		onSelectChange(data) {
			this.model = {
				id: data.id,
				parentId: data.parentId,
				name: data.name,
				url: data.url,
				permissionUri: data.permissionUri,
				forbidden: data.forbidden,
				code: data.code,
				levelCode: data.levelCode,
				funcType: data.funcType,
				icon: data.icon === '' ? {} : JSON.parse(data.icon),
				remark: data.remark
			}
		}
	}
}
</script>

