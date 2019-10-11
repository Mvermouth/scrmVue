<template>
  <div>
        <div class="list-item-num">
            {{groupNums !==null ? `共查找到${groupNums}个群` : ''}}
        </div>
        <item-list-container 
            :height="height"
            :selectedIndex="selectedIndex" 
            :items="groups" 
            :itemComponent="itemComponent" 
            :placeholder="placeholder" 
            :onReachBottom="handleReachBottom" 
            v-on:item-changed="handleGroupClick" />
        <Spin v-if="isLoading" class="spin" size="large" fix></Spin>
    </div>
</template>
<script>
import ItemListContainer from './item-list-container.vue'
import GroupListItem from './group-list-item.vue'
import Group from '../../../../../models/im/group'

export default {
    props: {  
        filter: {
            type: Object,
            default: () => {}
        },
    },
    components: {
        ItemListContainer,
        GroupListItem
    },
    async mounted() {
        await this.fetchMoreGroups()
        this.selectedIndex = 0          // 初次进入，要默认选中第0条
    },
    data() {
        return {
            placeholder: '',
            selectedIndex: -1,
            itemComponent: GroupListItem,
            groups: [],
            groupNums: null,
            pageNo: 1,
            isLoading: false,
            height: window.frameElement.contentWindow.innerHeight - 82
        }
    },
    activated() {
        _.isEmpty(this.groups) && this.handleGroupClick(null)
    },
    watch: {
        groups() {
            if (_.isEmpty(this.groups)) this.placeholder = '没有找到群组'
        }
    },
    methods: {
        handleGroupClick(group) {
            // 激发事件
            this.$emit('group-changed', group)
        },
        // 下拉无限加载
        handleReachBottom() {
            const debounce =_.debounce(this.fetchMoreGroups, 200, {maxWait: 1000})
            debounce()
        },
        // 关键字查询
		async doSearch() {            
            this.isLoading = true
            this.selectedIndex = -1
            this.pageNo = 1

            const page = await Group.searchGroups(this.filter.fromId, this.filter.keyword, this.pageNo, 30, [])
            this.groups = page.content
            this.groupNums = page.total
            this.isLoading = false
			this.selectedIndex = 0
			++this.pageNo
        },
        async fetchMoreGroups() {
			console.log('this.pageNo：',this.pageNo)
            const page = await Group.searchGroups(this.filter.fromId, this.filter.keyword, this.pageNo, 30, [])
            this.groups = _.concat(this.groups, page.content)
            this.groupNums = page.total
            ++this.pageNo
        },
    }
}
</script>

