<template>
    <div class="group-member-aside">
        <div class="right-header">
            <div>
                <div class="group-info">
                    <p class="c-disabled">群名</p>
                    <p class="c-content ellipsis">{{ group.name || '无名氏' }}</p>
                </div>
                <div class="group-info group-notice">
                    <p class="c-disabled">群公告</p>
                    <p class="c-content" style="white-space: pre-wrap">{{ group.signature || '暂无公告'}}</p>
                </div>
            </div>
        </div>
        <div class="search-bar group-search">
            <i-input class="keyword-search" v-model="keyword" placeholder="搜索群成员">
                <i-button slot="append" icon="search" @click="handleSearchMembers"></i-button>
            </i-input>
        </div>
        <div class="list-item-num">
            {{groupMemberNums!==null ? `共有${groupMemberNums}个群成员` : ''}}
        </div>
        <div class="group-panel" ref="groupPanel"> 
            <group-member-list 
                :placeholder="placeholder"
                :height="height" 
                :groupMembers="groupMembers" 
                :onReachBottom="handleLoadMoreMembers">
            </group-member-list>
            <Spin v-if="isLoadingMembers" class="spin" large fix></Spin>
        </div>
    </div>
</template>
<script>
import GroupMemberList from './group-member-list.vue'
import Group from '../../../../../models/im/group'

export default {
    props: {
        group: {
            type: Object,
            required: true,
        },
    },
    components: {
        GroupMemberList,
    },
    data() {
        return {
            isLoadingMembers: false,
            height: window.frameElement.contentWindow.innerHeight - 212,
            groupMembers: [],
            groupMemberNums: null,
            pageNo: 1,
            keyword: '',
            placeholder: ''
        }
    },
    mounted() {        
        if (this.group) this.fetchMemberPage(1)
    },
    watch: {
        group(oldVal, newVal) {
            if (oldVal.id === newVal.id) return

            this.groupMembers = []
            if (this.group) this.fetchMemberPage(1)
        },
        keyword() {
            if(this.keyword === '') {
                this.handleSearchMembers()
            }
        }
    },
    methods: {
        async fetchMemberPage(pageNo) {
            this.pageNo = pageNo
            this.isLoadingMembers = true

            const page = await Group.searchMembers(this.group.group.id, this.keyword, this.pageNo, 30)
            this.groupMembers = page.content || []
            this.groupMemberNums = page.total
            if (_.isEmpty(this.groupMembers)) this.placeholder = '没有搜索到群成员'

            this.isLoadingMembers = false
        },
        // 下拉无限加载群成员
		async handleLoadMoreMembers() {
            const debounce = _.debounce(async ()=> {
                const groupMembers = await Group.searchMembers(this.group.group.id, this.keyword, this.pageNo, 30)
                this.groupMembers = _.concat(this.groupMembers, groupMembers.content)
                ++this.pageNo
            }, 250, {maxWait: 1000})
            debounce()
            
        },
        // 搜索群成员
        async handleSearchMembers() {

            this.isLoadingMembers = true
			const page = await Group.searchMembers(this.group.group.id, this.keyword, this.pageNo, 30)
            this.groupMembers = page.content
            this.groupMemberNums = page.total
            if (_.isEmpty(this.groupMembers)) this.placeholder = '没有搜索到群成员'

			this.isLoadingMembers = false
        }
    }
}
</script>
