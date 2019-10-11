<template>
    <div>
        <div class="list-item-num">
            {{ sessionNums!==null ? `共查找到${sessionNums}个会话` : ''}}
        </div>
        <item-list-container
            :height="height" 
            :selectedIndex="selectedIndex"
            :items="sessions"
            :itemComponent="itemComponent"
            :placeholder="placeholder"
            :onReachBottom="handleReachBottom"
            v-on:item-changed="handleSessionClick"/>
        <Spin v-if="isLoading" class="spin" size="large" fix></Spin>
    </div>
</template>
<script>
import ItemListContainer from './item-list-container.vue'
import SessionListItem from './session-list-item.vue'

import Session from '../../../../../models/im/session'

export default {
	props: {
		filter: {
			type: Object,
			default: () => {}
		}
	},
	components: {
		ItemListContainer,
		SessionListItem
	},
	data() {
		return {
			selectedIndex: -1,
			itemComponent: SessionListItem,
			sessions: [],
			sessionNums: null,
			pageNo: 1,
			isLoading: false,
			placeholder: '',
			height: window.frameElement.contentWindow.innerHeight - 82
		}
	},
	async mounted() {
		await this.fetchMoreSessions()
		this.selectedIndex = 0 // 初次进入，要默认选中第0条
	},
	activated() {
		_.isEmpty(this.sessions) && this.handleSessionClick(null)
	},
	watch: {
		sessions() {
			if (_.isEmpty(this.sessions)) this.placeholder = '找不到会话'
		}
	},
	methods: {
		handleSessionClick(session) {
			// 激发事件
			this.$emit('session-changed', session)
		},
		// 下拉无限加载会话
		handleReachBottom() {
			const debounce = _.debounce(this.fetchMoreSessions, 200, { maxWait: 1000 })
			debounce()
		},
		// 会话列表查询
		async doSearch() {
			this.isLoading = true
			this.selectedIndex = -1
			this.pageNo = 1

			const page = await Session.searchSessions(this.filter.fromId, this.filter.keyword, this.pageNo, 30, [])
			this.sessions = page.content
			this.sessionNums = page.total
			this.isLoading = false

			this.selectedIndex = 0 // 重新搜索后，要默认选中第0条
			++this.pageNo
		},
		async fetchMoreSessions() {
			const filter = [
				{
					filterType: 'EQ',
					property: 'fromContact.id',
					value: this.filter.fromId
				}
			]
			if (this.filter.keyword) {
				filter.push({
					filterType: 'EQ',
					property: 'toContact.id',
					value: this.filter.keyword
				})
			}
			const page = await Session.page(this.pageNo, 30, filter, [])
			this.sessions = _.concat(this.sessions, page.content)
			this.sessionNums = page.total
			++this.pageNo
		}
	}
}
</script>

