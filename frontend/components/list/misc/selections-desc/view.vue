<template>
    <p class="selection-info" v-if="selections.length > 0 && selectionDescribe">
       <icon type="information-circled" size="16" color="#2d8bf0"></icon>
       <span v-html="selectionDescription"></span>
       <span class="clear-all" @click="deselectAll">清空</span>
    </p> 
</template>
<script>
/**
 * 多选描述
 */
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
         * 多选信息描述
         * 
         *  String: 描述模版，格式参考 lodash.template，参数: selectedCount, totalCount
         *  Function: (selections, totalCount) => { return '' }
         */
        selectionDescribe: {
            type: [String, Function],
            required: false,
            default: '已选择<b><%= selectedCount %></b>项'
        }

    },

    computed: {

        // 选中项
        selections() {
            return this.listDataSource.selections
        },

        // 总数
        total() {
            return this.listDataSource.result.total
        },
        
        // 多选描述
        selectionDescription() {
            const selectedCount = this.selections.length
            const totalCount = this.total
            const args = { selectedCount, totalCount }
            if (typeof this.selectionDescribe === 'string') {
                return _.template(this.selectionDescribe)(args)
            }
            if (typeof this.selectionDescribe === 'function') {
                return this.selectionDescribe(this.selections, totalCount)
            }
            return ''
        }
    },

    methods: {

        deselectAll() {
            this.listDelegator.deselectAll && this.listDelegator.deselectAll()
        }
    }
}
</script>

