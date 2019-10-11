<template>
    <div>
        <Tooltip placement="top-start" :disabled="disabledTips" content="由于搜索结果较多，只提供前10000条">
            <Page class="paginator" :total="total" :current="pageNo" :page-size="pageSize" :page-size-opts="pageSizeOpts" v-bind="props"
                @on-change="onPageNoChange" @on-page-size-change="onPageSizeChange"></Page>
            <p class="page-desc" v-if="pageNo > 0 && paginatorDescribe" v-html="paginatorDescription"></p>
            <slot></slot>
        </Tooltip>
    </div> 
</template>
<script>
import _ from 'lodash'

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

        // 翻页配置
        props: {
            type: Object,
            required: false,
            default() {
                return {}
            }
        },

        // 可选的翻页大小
        pageSizeOptions: {
            type: Array,
            required: false,
            default() {
                return [20, 50, 100]
            }
        },

        /**
         * 翻页信息描述
         * 
         *  String: 描述模版，格式参考 lodash.template，参数: pageNo, pageSize, totalCount
         *  Function: (pageNo, pageSize, totalCount) => { return '' }
         */
        paginatorDescribe: {
            type: [String, Function],
            required: false,
            default: '共找到<%= totalCount %>条记录'
        }

    },

    computed: {
        disabledTips(){
            return this.listDataSource.result.total <= 10000
        },
        // 总数
        total() {
            return this.listDataSource.result.total >10000? 10000: this.listDataSource.result.total
        },

        // 当前页码
        pageNo() {
            return this.listDataSource.result.pageNo
        },

        // 当前翻页大小
        pageSize() {
            return this.listDataSource.result.pageSize
        },

        // 翻页大小
        pageSizeOpts() {
            const sizes = _.cloneDeep(this.pageSizeOptions)
            if (sizes.indexOf(this.pageSize) < 0) {
                sizes.push(this.pageSize)
            }
            sizes.sort((a, b) => a - b)
            return sizes
        },

        // 翻页描述
        paginatorDescription() {
            const pageNo = this.pageNo
            const pageSize = this.pageSize
            const totalCount = this.listDataSource.result.total
            const args = { pageNo, pageSize, totalCount }
            if (typeof this.paginatorDescribe === 'string') {
                return _.template(this.paginatorDescribe)(args)
            }
            if (typeof this.paginatorDescribe === 'function') {
                return this.paginatorDescribe(pageNo, pageSize, totalCount)
            }
            return ''
        }

    },

    methods: {

        // 页码变化
        onPageNoChange(pageNo) {
            this.listDelegator.onPageNoChange && this.listDelegator.onPageNoChange(pageNo)
        },

        // 翻页大小变化
        onPageSizeChange(pageSize) {
            this.listDelegator.onPageSizeChange && this.listDelegator.onPageSizeChange(pageSize)
        }

    }
}
</script>

