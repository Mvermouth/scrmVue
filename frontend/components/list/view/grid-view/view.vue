<template>
    <grid
        ref="grid"
        v-bind="props"
        :render-grid="renderGrid"
        :data="content"
        :loading="loading"
        :selection="selectionType"
        :cls-prefix="`${clsPrefix}grid`"
        @on-select-single="onSelectSingle"
        @on-select="onSelectMultiple"
        @on-select-all="onSelectMultiple"
        @on-selection-change="onSelectMultiple"></grid>
</template>
<script>
export default {

    props: {

        // 列表数据源
        listDataSource: {
            type: Object,
            required: true
        },

        // 列表事件处理
        listDelegator: {
            type: Object,
            required: true
        },

        /**
         * 开启列表选择
         * 
         * 可选值
         *      true        多选
         *      checkbox    多选
         *      radio       单选
         */
        selection: {
            type: [Boolean, String],
            required: false,
            default: false
        },

        // Grid列表展示卡片渲染
        renderGrid: {
            type: Function,
            required: true 
        },
        
        // Grid属性
        props: {
            type: Object,
            required: false,
            default() {
                return {}
            }
        },

        // 样式前缀
        clsPrefix: {
            type: String,
            required: false,
            default: ''
        }

    },

    computed: {

        // 数据源加载中
        loading() {
            return this.listDataSource.loading
        },

        // 列表数据
        content() {
            const content = _.cloneDeep(this.listDataSource.result.content)

            // 刷新数据后保持选中状态
            content.forEach(it => it._checked = this.selections.findIndex(it2 => it[this.idKey] === it2[this.idKey]) >= 0)

            return content
        },

        // 数据的唯一标识字段
        idKey() {
            return this.listDataSource.idKey
        },

        // 当前选中数据
        selections() {
            return this.listDataSource.selections
        },

        // 列表选择方式
        selectionType() {
            if (this.selection === true || this.selection === 'checkbox' || this.listDataSource.options.multiSelection) {
                return 'checkbox'
            }
            if (this.selection === 'radio') {
                return this.selection
            }
            return false
        },
    },

    methods: {

        // 单选
        onSelectSingle(ctx) {
            this.listDelegator.deselectAll && this.listDelegator.deselectAll()
            this.listDelegator.select && this.listDelegator.select(ctx.row[this.idKey])
        },

        // 多选选择操作
        onSelectMultiple(selections) {
            const prevSelectionMap = _.keyBy(this.selections, this.idKey)
            const currSelectionMap = _.keyBy(selections, this.idKey)

            // 变更当前页数据的选择状态
            this.content.forEach(it => {
                const prevSel = !!prevSelectionMap[it[this.idKey]]
                const currSel = !!currSelectionMap[it[this.idKey]]
                if (prevSel === currSel) return

                if (prevSel) {
                    this.listDelegator.deselect && this.listDelegator.deselect(it[this.idKey])
                } else {
                    this.listDelegator.select && this.listDelegator.select(it[this.idKey])
                }
            })
        }
    }
}
</script>

