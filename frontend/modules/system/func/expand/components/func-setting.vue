<style lang="less" scoped>
</style>

<template>
    <card :padding="16">
        <p slot="title">
            菜单设置
        </p>
        <button-group>
            <i-button :class="editType==='rootMenu' ? `${clsPrefix}active` : ''" @click="edit('rootMenu')"><icon type="plus"></icon>新增根菜单</i-button>
            <i-button :class="editType==='subMenu' ? `${clsPrefix}active` : ''" @click="edit('subMenu')" ><icon type="plus"></icon>新增下级菜单</i-button>
            <i-button :class="editType==='currentMenu' ? `${clsPrefix}active` : ''" @click="edit('currentMenu')" ><icon type="edit"></icon>编辑当前菜单</i-button>
            <i-button @click="deleteMenu" ><icon type="close"></icon>删除当前菜单</i-button>
        </button-group>
        <row>
            <i-col span="18" offset="3">
                <i-form  v-model="funcForms"  :rules="ruleValidate" :label-width="80"  style="padding:30px 0" :class="`${clsPrefix}func-form`">
                    <form-item  label="上级菜单" >
                        <i-input  v-model="funcForms.parentName" clearable :disabled="true" v-if="editType !== 'currentMenu'" placeholder="请输入上级菜单"></i-input>
                        <Cascader v-else :data="parentFuncs" v-model="funcParentIds" filterable :change-on-select="changeOnSelect" @on-change="handleParentChange"></Cascader>
                    </form-item>
                    <form-item  label="名称" prop="name">
                        <i-input  v-model="funcForms.name" clearable :disabled="this.editType===''?true: false" placeholder="请输入名称"></i-input>
                    </form-item>
                    <form-item  label="URL" prop="url">
                        <i-input  v-model="funcForms.url" clearable :disabled="this.editType===''?true: false" placeholder="请输入URl"></i-input>
                    </form-item>
                    <form-item  label="权限标识" prop="permissionUri">
                        <i-input  v-model="funcForms.permissionUri" clearable :disabled="this.editType===''?true: false" placeholder="请输入权限标识"></i-input>
                    </form-item>
                    <form-item  label="编码">
                        <i-input  v-model="funcForms.code" clearable :disabled="this.editType===''?true: false" placeholder="请输入编码"></i-input>
                    </form-item>
                    <form-item  label="层级编码">
                        <i-input  v-model="funcForms.levelCode" clearable :disabled="this.editType===''?true: false" placeholder="请输入层级编码"></i-input>
                    </form-item>
					<form-item  label="禁用">
                        <i-switch v-model="funcForms.forbidden" :disabled="this.editType===''?true: false">
							 <span slot="open">是</span>
        					<span slot="close">否</span>
						</i-switch>
                    </form-item>
                    <form-item label="菜单类型" prop="funcType">
                        <radio-group  v-model="funcForms.funcType">
                            <radio label="module">模块</radio>
                            <radio label="catalog">目录</radio>
                            <radio label="menu">菜单</radio>
                            <radio label="button">按钮</radio>
                        </radio-group>
                    </form-item>
                    <form-item label="图标">
						<icon-font v-if="funcForms.icon.name && funcForms.icon.value" v-bind="funcForms.icon" :class="`mr1f ${this.editType === '' ? 'c-disabled' : ''}`"></icon-font>
						<i-button type="primary" @click="changeVisible" :disabled="this.editType===''?true: false"><i class="fas fa-hand-pointer"></i>选择图标</i-button>
                    </form-item>
                    <form-item>
                        <i-input v-model="funcForms.remark" type="textarea" :rows="4" :disabled="this.editType===''?true: false" placeholder="请输入菜单说明"></i-input>
                    </form-item>
                </i-form>
            </i-col>
        </row>
        <row style="text-align: center">
            <button-group v-if="editType!==''">
                <i-button @click="onCancle"><icon type="reply"></icon>取消</i-button>
                <i-button type="primary" @click="onSubmit('funcForms')"><icon type="ios-download"></icon>保存</i-button>
            </button-group>
        </row>
        <select-icon v-model="visible" :icons="icons" :default-icon="funcForms.icon" @on-selected-icon="changeIcon"></select-icon>
    </card>
</template>

<script>
import _ from 'lodash'
import Func from '../../../../../models/system/func'
import SelectIcon from '../../../../../views/selectors/select-icon'
import icons from '../../../../../configs/iconfont.json'

const defaultFuncForm = {
	parentName: '',
	name: '',
	url: '',
	permissionUri: '',
	code: '',
	levelCode: '',
	funcType: '',
	forbidden : false,
	icon: {},
	remark: ''	
}

export default {
	props: {
		value: {
			type: Object
		}
	},
	components: {
		SelectIcon
	},
	data() {
		return {
			icons,	// 候选图标
			visible: false, // 控制字体选择器弹窗
			clsPrefix: `${App.options.styles.prefix}`, // 样式前缀
			editType: '', // 编辑类型,点击菜单的类型
			funcForms: _.cloneDeep(defaultFuncForm), 
			changeOnSelect: true,
			expandFuncs: [],
			parentFuncs: [],
			funcParentIds: [],
			ruleValidate: {

			}
		}
	},
	mounted() {
		this.initData()
	},
	watch: {
		value(value) {
			this.initForm(value)
		}
	},

	methods: {
		async initData() {
			const result = await Func.expand()
			this.expandFuncs = Object.assign(result)
		},

		transData(data) {
			const result = data.filter(it => {
				it.label = it.name
				it.value = it.id
				it.disabled = false
				if (this.value && this.value.funcType === 'menu' && !_.includes(['catalog', 'module'], it.funcType)) {
					it.disabled = true
				} else if (this.value && this.value.funcType === 'catalog' && !_.includes(['catalog', 'module'], it.funcType)) {
					it.disabled = true
				} else if (this.value && this.value.funcType === 'button' && it.funcType === 'button') {
					it.disabled = true
				}
				if (it.children && it.children.length > 0) {
					it.children = this.transData(it.children)
				}
				return it.funcType !== 'button'
			})
			return result
		},
		async initForm(value) {
			this.editType = ''
			if (Object.keys(value).length > 0) {
				value.parentName = '系统根菜单'
				if (value.parentId !== '0') {
					const result = await Func.retrieve(value.parentId)
					value.parentName = result.name
				}

				_.forEach(Object.keys(this.funcForms), it => {
					if (value[it] !== undefined) {
						this.funcForms[it] = value[it]
					}
				})
			} else {
				const defaults = _.cloneDeep(defaultFuncForm)
				_.forEach(Object.keys(this.funcForms), it => {
					this.funcForms[it] = defaults[it]
				})
			}
			if (value && value.funcType === 'button') {
				this.changeOnSelect = false
			} else {
				this.changeOnSelect = true
			}
			this.transformParentIds(value)
		},
		transformParentIds(value) {
			const disabledFuncs = this.transData(this.expandFuncs)
			this.parentFuncs = _.concat([{
				id: '0',
				label: '系统根菜单',
				value: '0'
			}], disabledFuncs)
			if (!value || value.parentId === '0') {
				this.funcParentIds = ['0']
			} else {
				const id2funcMap = {}
				this.expandFuncs.forEach(it => this.tree2Map(it, id2funcMap))
				this.funcParentIds = this.walkUp(value.parentId, id2funcMap, [])
			}
		},
		handleParentChange(pids) {
			if (this.value.funcType === 'button' && pids.length > 0) {
               	const id2funcMap = {}
				this.expandFuncs.forEach(it => this.tree2Map(it, id2funcMap))
				const permissionUri = id2funcMap[_.last(pids)].permissionUri
				const action = _.split(this.funcForms.permissionUri, ':')[1]
				const resource = _.split(permissionUri, ':')[0]
				this.funcForms.permissionUri = resource + ':' + action
				const domainUrl = _.split(resource, '.').join('/')
				this.funcForms.url = '/' + domainUrl + '/' + action
			}
		},
		tree2Map(node, map) {
			map[node.id] = node
			const children = node.children || []
			children.forEach(it => this.tree2Map(it, map))
		},

		walkUp(id, map, list) {
			list.unshift(id)
			const node = map[id]
			if (!node) {
				return list
			}
			return node.parentId ? this.walkUp(node.parentId, map, list) : list
		},
		edit(type) {
			this.editType = ''
			if ((type === 'subMenu' || type === 'currentMenu') && Object.keys(this.value).length < 1) {
				this.$Modal.info({
					title: '提示',
					content: '<p>请先选择上级菜单</p>'
				})
				return
			}
			this.editType = type
			this.transformData(this.value, type)
		},

		transformData(value, type) {
			if (type === 'rootMenu') {
				_.forEach(Object.keys(this.funcForms), it => {
					this.funcForms[it] = ''
					if (it === 'parentName') {
						this.funcForms[it] = '系统根菜单'
					}
				})
				return
			}
			if (type === 'subMenu') {
				_.forEach(Object.keys(this.funcForms), it => {
					this.funcForms[it] = ''
					if (it === 'parentName') {
						this.funcForms[it] = value.name
					}
				})
				return
			}

			if (type === 'currentMenu') {
				_.forEach(Object.keys(this.funcForms), it => {
					if (value[it] !== '') {
						this.funcForms[it] = value[it]
					}
				})
				return
			}
		},

		deleteMenu() {
			if (Object.keys(this.value).length < 1) {
				this.$Modal.info({
					title: '提示',
					content: '请先选择要删除的菜单'
				})
				return
			}

			this.$Modal.confirm({
				title: '删除提示',
				content: '是否删除该节点',
				onOk: async() => {
					try {
					    await Func.delete(this.value.id)
						this.$Notice.success({
							title: '删除成功'
							})
						this.editType = ''
						this.$emit('on-change-value')
					} catch (err) {
						console.log(err)
					}
				},
				onCancel: () => {}
			})
		},
		// 显示或者隐藏图标选择器
		changeVisible() {
			this.visible = true
		},
		// 更换图标
		changeIcon(params) {
			this.funcForms.icon = params
		},

		onCancle() {
			this.editType = ''
		},

		async onSubmit() {
			if(this.funcForms.name === '') {
				this.$Notice.error({
					title: '名称不能为空'
					})
				return
			}
			if(this.funcForms.url === '') {
				this.$Notice.error({
					title: 'URL不能为空'
					})
				return
			}
			if(this.funcForms.permissionUri === '') {
				this.$Notice.error({
					title: '权限标识不能为空'
					})
				return
			}
			if(this.funcForms.funcType === '') {
				this.$Notice.error({
					title: '请选择菜单类型'
					})
				return
			}
			const params = {
				name: this.funcForms.name,
				url: this.funcForms.url,
				permissionUri: this.funcForms.permissionUri,
				code: this.funcForms.code,
				levelCode: this.funcForms.levelCode,
				funcType: this.funcForms.funcType,
				remark: this.funcForms.remark,
				disabled:this.funcForms.forbidden,
				icon: ''
			}
			if (this.funcForms.icon.name && this.funcForms.icon.value) {
				params.icon = JSON.stringify(this.funcForms.icon)
			}
			try {
				if (this.editType === 'rootMenu') {
					params.parentId = 0
					await Func.create(params)
				}

				if (this.editType === 'subMenu') {
					params.parentId = this.value.id
					await Func.create(params)
				}

				if (this.editType === 'currentMenu') {
					params.id = this.value.id
					const parentId = _.last(this.funcParentIds)
					if (!parentId && parentId !== 0) {
						this.$Notice.error({
							title: '未选择上级菜单!'
							})
						return
					}
					params.parentId = parentId
					await Func.update(params)
				}

				this.$Notice.success({
					title: '保存成功'
					})
				this.editType = ''
				this.$emit('on-change-value')
			} catch (e) {
				
			}
		}
	}
}
</script>

