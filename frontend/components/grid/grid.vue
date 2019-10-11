<template>
    <div :class="`${clsPrefix}`">
        <row v-if="listType === 'grid'" v-bind="rowProps">
            <i-col v-for="row in objData" :key="`grid-${row._rowKey}}`" v-bind="colProps" :class="`${clsPrefix}-${listType}-grid`">
                <grid-item :render-grid="renderGrid" :row="row" :data="data[row._index]"
                    :selection-type="selectionType" @on-select="onSelect"></grid-item>
            </i-col>
        </row>
        <div v-else-if="listType === 'flex'" :class="`${clsPrefix}-${listType}`">
            <div v-for="row in objData" :key="`flex-${row._rowKey}}`" :class="`${clsPrefix}-${listType}-grid`">
                <grid-item :render-grid="renderGrid" :row="row" :data="data[row._index]"
                    :selection-type="selectionType" @on-select="onSelect"></grid-item>
            </div>
        </div>
        <Spin size="large" fix v-if="loading"></Spin>
    </div>
</template>
<script>
import _ from 'lodash'
import GridItem from './grid-item.vue'

// 用于分配数据唯一key
let rowKey = 0

export default {

    components: {
        GridItem
    },

    props: {

        // 列表数据
        data: {
            type: Array,
            required: true
        },

        /**
         * Grid渲染逻辑
         * 
         * (h, row, $grid) => { ... }
         */
        renderGrid: {
            type: Function,
            required: true
        },

        selection: {
            type: [Boolean, String],
            required: false,
            default: false
        },

        // 是否加载中
        loading: {
            type: Boolean,
            required: false,
            default: false
        },

        /**
         * 列表展示模式
         * 
         * 可选值
         *      flex        flex模式，renderGrid需要固定宽度，通过flex自适应布局
         *      grid        grid模式，通过row/col控制grid的大小，renderGrid需要自适应容器宽度
         */
        listType: {
            type: String,
            required: false,
            default: 'flex'
        },

        /**
         * Grid 模式下，row的属性
         */
        rowProps: {
            type: Object,
            required: false,
            default() {
                return {
                    gutter: 16
                }
            }
        },
        
        /**
         * Grid 模式下，col的属性
         */
        colProps: {
            type: Object,
            required: false,
            default() {
                return {
                    xs: 2,
                    sm: 3,
                    md: 4,
                    lg: 6
                }
            }
        },

        // 样式前缀
        clsPrefix: {
            type: String,
            required: false,
            default: 'grid'
        }
    },

    data() {

        return {
            // 实际渲染数据
            objData: this.makeData()
        }
    },

    computed: {

        // 选择方式
        selectionType() {
            if (this.selection === true || this.selection === 'checkbox') {
                return 'checkbox'
            }
            if (this.selection === 'radio') {
                return this.selection
            }
            return false
        },
    },

    watch: {

        data() {
            this.objData = this.makeData()
        }
    },

    methods: {

        makeData() {
            const data = _.cloneDeep(this.data)
            data.forEach((row, index) => {
                row._index = index;
                row._rowKey = rowKey++;
            });
            return data;
        },

        onSelect(idx) {
            if (this.selectionType === 'checkbox') {
                this.toggleSelect(idx)
            } else if (this.selectionType === 'radio') {
                this.selectSingle(idx)
            }
        },

        toggleSelect(idx) {
            const data = this.objData[idx]
            const checked = !data._checked
            data._checked = checked

            // 刷新显示
            this.objData = _.cloneDeep(this.objData)

            const selection = this.getSelection()
            this.$emit(checked ? 'on-select' : 'on-select-cancel', selection, _.cloneDeep(this.data[idx]))
            this.$emit('on-selection-change', selection)
        },

        selectAll(checked) {
            // 刷新显示
            const data = this.makeData()
            data.forEach(it => {
                if (it._disabled) return
                it._checked = checked
            })
            this.objData = data
            
            const selection = this.getSelection()
            if (checked) {
                this.$emit('on-select-all', selection);
            }
            this.$emit('on-selection-change', selection);
        },

        getSelection() {
            return this.objData.filter(it => it._checked).map(it => _.cloneDeep(this.data[it._index]))
        },

        selectSingle(idx) {
            const row = this.objData[idx]
            const ctx = {
                index: row._index,
                row: _.cloneDeep(this.data[row._index])
            } 
            this.$emit('on-select-single', ctx)

            this.selectAll(false)
            this.toggleSelect(row._index)
        }
    },

}
</script>

