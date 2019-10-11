<template>
	<div>
        <row>
            <i-col v-bind="layout">
                <render-form ref="form" :form-items="renderFormItems" @on-form="onForm" v-bind="formProps"></render-form>
            </i-col>
        </row>
		<row v-if="target !== 'dialog'">
            <i-col span="12" offset="6" :class="`${clsPrefix}-operations`">
                <i-button type="primary" @click="onSubmit" :loading="loading">确定</i-button>
                <i-button type="ghost" @click="onReset">重置</i-button>
            </i-col>
        </row>
	</div>
</template>
<script>
export default {

	props: {

		/**
         * 一组对domain的操作集合
         *
         * 接口参考 DomainModel
         */
		domain: {
			type: Object,
			required: false
		},

		/**
         * 创建domain接口，会覆盖domain的默认接口
         */
		create: {
			type: Function,
			required: false
		},

		/**
         * 表单项
         */
		formItems: {
			type: Array,
			required: true
		},

		/**
		 * 表单属性，透传给 render-form
		 */
		formProps: {
			type: Object,
			required: false,
			default() {
				return {}
			}
		}

	},

	data() {
		return {
			target: App.target,

			// 表单数据
			form: {},

			// 数据提交中
			loading: false,

			// 表单布局
			layout: App.options.styles.form.layout,

			// 样式前缀
			clsPrefix: `${App.options.styles.prefix}form`
		}
	},

	computed: {

		// 创建domain方法
		createFunc() {
			return this.create || this.domain.create.bind(this.domain)
		},

		renderFormItems() {
			return this.formItems.map(it => {
				if (it.rule && it.rule.validator) {
					const validator = it.rule.validator
					it.rule.validator = (rule, value, callback) => {
						const form = _.cloneDeep(this.form)
						validator(rule, value, form, null, callback)
					}
				}
				return it
			})
		}
	},

	mounted() {
		// 如果在dialog中打开，注册action钩子
		if (App.target === 'dialog') {
			[
				{
					title: '确定',
					type: 'primary',
					isAsync: true,
					onAction: () => {
						return this.onSubmit()
					}
				},
				{
					title: '重置',
					type: 'ghost',
					onAction: () => {
						return this.onReset()
					}
				}
			].forEach(it => {
				App.registerDialogAction(App.dialogId, it)
			})
		}
	},

	beforeDestroy() {
		// 如果在dialog中打开，清除action钩子
		if (App.target === 'dialog') {
			App.unregisterDialogActions(App.dialogId)
		}
	},

	methods: {

		// 表单数据更新
		onForm(form) {
			this.form = form
		},

		// 提交表单
		onSubmit() {
			this.loading = true

			return this.$refs.form.validate()
				.then(result => {
					if (!result) {
						this.loading = false
						throw {
							code: -1,
							message: '验证失败'
						}
					}

					if (this.createFunc) {
						return this.createFunc(this.form)
					} else {
						console.warn('缺少创建方法!')
						throw {
							code: -1,
							message: '缺少创建方法'
						}
					}
				})
				.then(result => {
					this.loading = false
					this.$Notice.success({title: '添加成功'})
					if(App && App.closeDialog && App.dialogId)
					App.closeDialog(App.dialogId)

					// 创建事件
					if (this.domain) {
						App.event.$emit(this.domain.events.Create)
					}
					this.$emit('on-submit', this.onReset);
				})
				.catch(e => {
					console.error(e)
					this.loading = false
				})
		},

		// 重置表单
		onReset() {
			this.$refs.form.reset()
		}
	}
}
</script>