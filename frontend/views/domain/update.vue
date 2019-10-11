<template>
    <div>
        <row>
            <i-col v-bind="layout">
                <render-form ref="form" :form-items="renderFormItems" @on-form="onForm" v-bind="formProps"></render-form>
            </i-col>
        </row>
        <row v-if="target !== 'dialog'">
            <i-col span="8" offset="8" :class="`${clsPrefix}-operations`">
                <i-button type="primary" @click="onSubmit" :loading="loading">确定</i-button>
                <i-button type="ghost" @click="onReset">重置</i-button>
            </i-col>
        </row>
    </div>
</template>
<script>
import _ from 'lodash'
import { setFormItemsDefaults } from '../../scripts/utils/form-utils'
import { parseUrl } from '../../scripts/utils/url'
export default {

    props: {

        /**
         * 一组对domain的操作集合
         * 
         * 接口参考 DomainModel
         */
        domain: {
            type: Object,
            required: true 
        },

        /**
         * 更新domain接口，会覆盖domain的默认接口
         */
        update: {
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
		},

        /**
         * 主键值
         */
        idValue: {
            type: [Number, String],
            required: false
        },

        /**
         * 默认表单数据，可以直接传递数据，或者获取数据的接口，如果是接口，需异步
         * 
         * 如果没有传，默认使用 domain.retrieve 或 retrieve，根据 idValue 获取
         */
        defaults: {
            type: [Object, Function],
            required: false
        }
    },

    data() {

        return {
            target: App.target,

            // 主键值，默认从url获取
            id: this.idValue || (App.route && App.route.params.id) || domainId(),

            // 表单数据
            form: {},

            // 默认表单数据
            defaultForm: {},

            // 数据提交中
            loading: false,

            // 布局
            layout: App.options.styles.form.layout,

            // 样式前缀
            clsPrefix: `${App.options.styles.prefix}form`
        }
    },

    computed: {

        // 创建domain方法
        updateFunc() {
            return this.update || this.domain.update.bind(this.domain)
        },

        renderFormItems() {
            return setFormItemsDefaults(this.formItems, this.defaultForm).map(it => {
                if (it.rule && it.rule.validator) {
                    const validator = it.rule.validator
                    it.rule.validator = (rule, value, callback) => {
                        const form = _.cloneDeep(this.form)
                        validator(rule, value, form, this.defaultForm, callback)
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

        // 获取默认表单
        this.retrieveDefaultForm()
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
                            code:-1,
                            message:'验证失败'
                        }
                    }

                    if (this.updateFunc) {
                        const model = _.cloneDeep(this.form)
                        model[this.domain.primaryKey] = this.id
                        return this.updateFunc(model)
                    } else {
                        console.warn('缺少编辑方法!')
                        throw {
                            code:-1,
                            message:'缺少创建方法'
                        }
                    }
                })
                .then(result => {
                    this.loading = false
                    // this.onReset()
                    this.$Notice.success({title: '编辑成功'})
                    App.closeDialog(App.dialogId)

                    // 更新事件
					if (this.domain) {
                        App.event.$emit(this.domain.events.Update)
					}
                })
                .catch(e => {
                    console.error(e)
                    this.loading = false 
                })
        },

        // 重置表单
        onReset() {
            this.$refs.form.reset()
        },

        retrieveDefaultForm() {
            if (!!this.defaults) {
                if (typeof this.defaults === 'object') {
                    this.defaultForm = this.defaults
                } else if (typeof this.defaults === 'function') {
                    this.defaults(this.id)
                        .then(result => {
                            this.defaultForm = result
                        })
                        .catch(e => {
                            console.error(e)
                        })
                }
                return
            }
            this.domain.retrieve(this.id)
                .then(result => {
                    this.defaultForm = result
                })
                .catch(e => {
                    console.error(e)
                })
        }
    }
}

const domainId = function() {
    const parsed = parseUrl(window.location.href)
    return _.last(parsed.path.split('/'))
}

</script>