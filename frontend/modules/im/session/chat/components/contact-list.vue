<style>
    [v-cloak] {
        display: none;
    }
</style>

<template>
    <div>
        <div v-cloak class="list-item-num">
            {{ relationNums!==null ? `共查找到${relationNums}个好友` : ''}}
        </div>
        <item-list-container
            :height="height" 
            :selectedIndex="selectedIndex" 
            :items="relations" 
            :itemComponent="itemComponent" 
            :placeholder="placeholder" 
            :onReachBottom="handleReachBottom" 
            v-on:item-changed="handleRelationClick" />
        <Spin v-if="relationsLoading" class="spin" size="large" fix></Spin>
    </div>
</template>
<script>
import ItemListContainer from './item-list-container.vue'
import ContactListItem from './contact-list-item.vue'

import Relation from '../../../../../models/im/relation'

export default {
    props: {
        filter: {
            type: Object,
            default: () => {}
        },
    },
    components: {
        ItemListContainer,
        ContactListItem,
    },
    data() {
        return {
            selectedIndex: -1,
            itemComponent: ContactListItem,
            relations: [],
            relationNums: null,
            pageNo: 1,
            relationsLoading: false,
            placeholder: '',
            height: window.frameElement.contentWindow.innerHeight - 82
        }
    },
    async mounted() {
        await this.fetchRelations()
        this.selectedIndex = 0          // 初次进入，要默认选中第0条
    },
    activated() {
        _.isEmpty(this.relations) && this.handleRelationClick(null)
    },
    watch: {
        relations() {
            if (_.isEmpty(this.relations)) this.placeholder = '没有找到好友'
        }
    },
    methods: {
        handleRelationClick(relation) {
            // 激发事件
            this.$emit('contact-changed', relation)
        },
        // 下拉无限加载会话
        handleReachBottom() {
            const debounce = _.debounce(this.fetchRelations, 250, {maxWait: 1000}) 
            debounce()
        },
        // 好友列表查询
		async doSearch() {
            this.relations = []
            this.relationsLoading = true
            this.selectedIndex = -1
            this.pageNo = 1
            await this.fetchRelations()
            this.relationsLoading = false
            this.selectedIndex = 0
        },
        async fetchRelations() {
            const page = await Relation.searchRelations(this.filter.fromId, this.filter.keyword, this.pageNo, 30, [{ ignoreCase: false, property: 'favorite', type: 'ASC' }])
            this.relations = _.concat(this.relations, page.content)
            this.relationNums = page.total
            ++this.pageNo
        },
    }
}
</script>

