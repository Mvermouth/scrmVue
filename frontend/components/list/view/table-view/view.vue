<template>
    <div v-if="visible" v-resize="onResize">
        <i-col span="24" ref="listWrap">
            <i-table
                ref="table" stripe border
                :columns="tableColumns"
                :data="content"
                :loading="loading"
                :size="viewSize"
                :width="tableWidth"
                v-bind="props"
                @on-sort-change="onSort"
                @on-select="onSelectMultiple"
                @on-select-all="onSelectMultiple"
                @on-selection-change="onSelectMultiple"></i-table>
        </i-col>
    </div>
</template>
<script>
import _ from 'lodash'

const SORTS = {
    DESC: 'DSC',
    ASC: 'ASC'
}

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

        // 表格列配置，参考iview table文档
        columns: {
            type: Array,
            required: true
        },

        // 表格属性，透传给iview table
        props: {
            type: Object,
            required: false,
            default() {
                return {
                    stripe: true,
                    border: true
                }
            }
        },

        // 尺寸规格 large|small|default
        size: {
            type: String,
            required: false,
            default: ''
        },

        /**
         * 初始如果列表是display:none不显示，需要显式通过visible控制，才能正确触发缩放处理
         */
        visible: {
            type: Boolean,
            required: false,
            default: true
        }
    },

    data() {
        return {
            // 表头筛选的结果
            tableHeadFilters: [],

            // 表格的显示宽度
            tableWidth: 0
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

            // 嵌套属性展开到第一层
            this.columns.forEach(it => {
                if (it.key && it.key.indexOf('.') > 0) {
                    content.forEach(it2 => it2[it.key] = _.get(it2, it.key))
                }
            })

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

        // 表格列
        tableColumns() {
            const tableColumns = _.cloneDeep(this.columns)

            // 开启了列表选择，添加选择列
            switch(this.selectionType) {
                case 'checkbox': {
                    // 多选
                    tableColumns.unshift({
                        type: 'selection',
                        width: 60,
                        align: 'center',
                        fixed: this.columns.some(it => it.fixed === 'left') ? 'left' : ''
                    })
                    break
                }
                case 'radio': {
                    // 单选
                    tableColumns.unshift({
                        title: '选择',
                        width: 64,
                        align: 'center',
                        fixed: this.columns.some(it => it.fixed === 'left') ? 'left' : '',
                        render: (h, ctx) => {
                            // iview table内部clone了数据，这里直接绑定到iview table内部，避免绑定外部导致全量clone重绘
                            const data = this.$refs.table.objData[ctx.index]
                            return <radio value={data._isChecked} disabled={data._isDisabled} on-on-change={ () => this.onSelectSingle(ctx) }></radio>
                        }
                    })
                    break
                }
            }

            tableColumns.forEach(it => {
                // 自定义渲染绑定在 list 上
                if (it.render) it.render = it.render.bind(this.listDataSource.target)

                // 默认表格内容居中
                if (!it.align) it.align = 'center'

                // 开启了表头筛选，变更筛选条件
                if (it.filters) it.filterRemote = this.onTableHeadFilterChange.bind(this)

                // 宽度不够导致没有设置宽度的被压缩，因此统一设置最小宽度保证列可见
                if (!it.width && !it.minWidth) {
                    it.minWidth = Math.min(it.maxWidth || Number.MAX_SAFE_INTEGER, 80)
                }
            })

            return tableColumns
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

        // 视图尺寸
        viewSize() {
            return this.size === 'small' ? this.size : undefined
        }

    },

    watch: {

        visible() {
            // on-resize在display:none时监听不生效，因此无法通过v-show来控制显示，而需要v-if=visible重新创建dom来使监听生效
            if (this.visible) {
                /**
                 * 需要在Dom Update之后，才能拿到最终的宽度
                 * $nextTick是调度进microTask，只处理virtual dom，实际Dom并没有更新
                 * 因此需要通过setTimeout调度到下一个macro task执行 
                 */
                setTimeout(() => this.onResize(), 0)
            }
        },

        columns() {
            // 列变化重新计算表格宽度
            this.onResize()
        }
    },

    mounted() {
        if (this.visible) {
            /**
             * 需要在Dom Update之后，才能拿到最终的宽度
             * $nextTick是调度进microTask，只处理virtual dom，实际Dom并没有更新
             * 因此需要通过setTimeout调度到下一个macro task执行 
             */
            setTimeout(() => this.onResize(), 0)
        }
    },

    methods: {

        // 单选
        onSelectSingle(ctx) {
            this.deselectAll()
            this.$refs.table.toggleSelect(ctx.index)
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
        },

        // 取消全部选择
        deselectAll() {
            this.listDelegator.deselectAll && this.listDelegator.deselectAll()
            this.$refs.table.selectAll(false)
        },

        // 表头查询变更
        onTableHeadFilterChange(values, key, column) {
            const idx = this.tableHeadFilters.findIndex(it => it.property === key)
            if (values.length === 0) {
                // 清除条件
                if (idx >= 0) {
                    this.tableHeadFilters.splice(idx, 1)
                    this.listDelegator.onCriteriasChange && this.listDelegator.onCriteriasChange(_.cloneDeep(this.tableHeadFilters))
                }
            } else {
                // 设置条件
                const filter = {
                    property: key,
                    filterType: 'IN',
                    value: values
                }
                if (idx >= 0) {
                    this.tableHeadFilters.splice(idx, 1, filter)
                } else {
                    this.tableHeadFilters.push(filter)
                }
                this.listDelegator.onCriteriasChange && this.listDelegator.onCriteriasChange(_.cloneDeep(this.tableHeadFilters))
            }
        },

        // 排序
        onSort({column, key, order}) {
            const sort = _.cloneDeep(this.listDataSource.query.sort)
            const idx = sort.findIndex(it => it.property === key)
            switch(order) {
                case 'normal': {
                    // 清除排序
                    if (idx >= 0) {
                        sort.splice(idx, 1)
                        this.listDelegator.onSortChange && this.listDelegator.onSortChange(sort)
                    }
                    break
                }
                default: {
                    // 指定顺序
                    if (idx >= 0) {
                        sort[idx].type = SORTS[order.toUpperCase()]
                    } else {
                        // 新的排序优先级最高
                        sort.unshift({
                            property: key,
                            ignoreCase: false,
                            type: SORTS[order.toUpperCase()]
                        })
                    }
                    this.listDelegator.onSortChange && this.listDelegator.onSortChange(sort)
                    break
                }
            }
        },

        // 处理缩放
        onResize() {
            const colWidth = this.tableColumns.reduce((sum, it) => sum + (it.width || 50), 0) + 2 
            const wrapWidth = this.$refs.listWrap.$el.offsetWidth - 1
            this.tableWidth = Math.min(colWidth, wrapWidth)
        }
    }
}
</script>

