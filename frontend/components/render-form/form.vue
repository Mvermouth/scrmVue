<template>
    <i-form ref="form" :model="model" :label-width="labelWidth">
        <form-item v-for="(formItem, idx) in formItems" :key="`form-item-${idx}`"
            :rules="formItem.rule"
            :label="formItem.label" :prop="formItem.prop">
            <render-form-item :value="vmodel(formItem)" @input="value => onVModel(formItem, value)"
                :render="formItem.render"></render-form-item>
        </form-item>
    </i-form>
</template>
<script>
import _ from 'lodash'
import RenderFormItem from '../render-form-item'

const transformFormItems = formItems => {
    return formItems.reduce((model, it) => {
        _.set(model, it.prop, it.default === undefined ? '' : _.cloneDeep(it.default))
        return model
    }, {})
}

export default {

    components: {
        RenderFormItem
    },

    props: {

        /**
         * 表单项目
         * 
         * 结构:
         *  [
         *      {
         *          {
         *              // 必须 表单绑定字段
         *              prop: 'name'
         * 
         *              // 必须 表单项标题
         *              label: '姓名',
         * 
         *              // 可选 表单默认值，如果表单值是 Object/Array，必须要设置
         *              default: '',
         * 
         *              // 可选 如果表单值是string, 是否进行trim
         *              trim: true, 
         * 
         *              // 可选 校验规则
         *              rule: {required: true, message: '请填写姓名'},
         * 
         *              // 必须 表单条目的渲染，注意必须绑定 v-model 到 this.model 来传递表单值
         *              render: h => { return (<i-input v-model={this.model} placeholder="请输入"/>) }
         *          }
         *      },
         *      ...
         *  ]
         */
        formItems: {
            type: Array,
            required: true
        },

        // 表单项目的标题宽度
        labelWidth: {
            type: Number,
            required: false,
            default: 80
        }
    },

    data() {
        const model = transformFormItems(this.formItems)

        return {
            // 表单双向绑定
            model,

            // 默认的表单值
            defaultModel: _.cloneDeep(model)
        }
    },

    watch: {

        model: {
            deep: true,
            handler: function() {
                const result = _.cloneDeep(this.model)
                this.formItems.forEach(it => {
                    if (!it.transform || !_.isFunction(it.transform)) {
                        return
                    }
                    const prop = it.prop
                    const value = it.transform(_.get(result, prop))
                    _.set(result, prop, value)
                })
                this.$emit('on-form', result)
            }
        },

        formItems: {
            deep: true,
            handler: function() {
                const model = transformFormItems(this.formItems)
                this.model = model
                this.defaultModel = _.cloneDeep(model)
                this.$refs.form.resetFields()
            }
        }
    },

    methods: {

        // 重置为默认值
        reset() {
            this.$refs.form.resetFields()
            this.model = _.cloneDeep(this.defaultModel)
        },

        // 校验表单
        async validate() {
            return await this.$refs.form.validate()
        },

        // 获取对应的model值
        vmodel(formItem) {
            return _.get(this.model, formItem.prop)
        },

        // 更新model的值
        onVModel(formItem, value) {
            if (typeof value === 'string' && formItem.trim) {
                value = value.trim()
            }
            _.set(this.model, formItem.prop, value)
        }

    }
}
</script>