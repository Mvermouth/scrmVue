<template>
    <div class="panel">
        <div class="list-aside">
            <div class="list-aside-header">
                <div class="search-bar">
                    <i-input v-model="keyword" placeholder="输入好友信息" ><i-button slot="append" icon="search" @click="searchContacts"></i-button></i-input>
                </div>
            </div>
        
            <div class="list-pane" ref="listPane">
                <!-- 好友列表 -->
                <contact-list 
                    :height="height" 
                    :contacts="contacts" 
                    :onItemClick="onContactClick"
                    :on-reach-bottom="onFetchMoreContacts"
                ></contact-list>
                <!-- 好友列表 -->
                <Spin v-if="contactsLoading" class="spin" size="large" fix></Spin>
            </div>
        </div>
        <div class="message-aside">
            <div class="message-header">
                <div class="search-bar">
                    <date-picker class="date-pick" type="datetime" v-model="startDate" placeholder="选择起始时间"></date-picker>
                    <i-input class="keyword-search" v-model="chatKeyword" placeholder="请输入聊天内容"><i-button slot="append" icon="search" @click="onSearchMessages"></i-button></i-input>
                </div>
            </div>
            <div class="message-pane">
                <message-list 
                    v-if="!showQueryPanel && !messagesLoading" 
                    :height="height" 
                    :messages="messages" 
                    :session="session"
                    :query="query"
                    :on-reach-top="fetchMessagesUpward"	
                    :on-reach-bottom="fetchMessagesBackward"
                ></message-list>
                <search-result-list 
                    v-else-if="showQueryPanel && !messagesLoading" 
                    :height="height" 
                    :messages="searchMessages" 
                    :session="session"
                    :query="query"
                    :onViewContext="onViewContext"
                    :on-reach-top="fetchMessagesUpward"	
                    :on-reach-bottom="fetchMessagesBackward"
                />
                <Spin class="spin" size="large" fix v-else></Spin>
            </div>
        </div>
    </div>
</template>
<script>
import ContactList from './contact-list.vue'
import MessageList from './message-list.vue'
import SearchResultList from './search-result-list.vue'

import Session from '../../../../../models/im/session'
import Message from '../../../../../models/im/message'
import Contact from '../../../../../models/im/contact'
import Relation from '../../../../../models/im/relation'


export default {
    props: {
        filter: {
            type: Object,
            default: () => {}
        },
        cursor: {
			type: [Date, Number],
			default: ''
		}
    },
    components: {
        ContactList,
        MessageList,
        SearchResultList
    },
    data() {
        return {
            startDate: '',
            chatKeyword: '',
            keyword: '',
            contacts: [], 
            relation: {},
            showQueryPanel: false,  
            contactsLoading: true,
            messagesLoading: true,
            contactPage: 1,
            height: 0,
            messages: [],
            session: {},
            query: ''
        }
    },    
    mounted() {
        this.height = window.frameElement.contentWindow.innerHeight - 48
        this.onFetchMoreContacts()
    },
    methods: {
        // 好友列表查询
		async searchContacts() {
			this.contactsLoading = true
			this.contactPage = 1

            const page = await Relation.searchRelations(this.filter.fromId, this.keyword, this.contactPage, 30, [{ ignoreCase: false, property: 'favorite', type: 'ASC' }])
            this.contacts = page.content
			this.contactsLoading = false
        },
        // 下拉无限加载好友
        async onFetchMoreContacts() {
            this.keyword = this.filter.toId
			const page = await Relation.searchRelations(this.filter.fromId, this.keyword, this.contactPage, 30, [{ ignoreCase: false, property: 'favorite', type: 'ASC' }])
            this.contacts = _.concat(this.contacts, page.content)
            this.messagesLoading = this.contacts.length === 0 ? false : true
            ++this.contactPage
            this.contactsLoading = false
        },
        // 消息查询
		async onSearchMessages() {
            if (!this.session) return
            
			this.messagesLoading = true
            
            this.showQueryPanel = this.chatKeyword !== ''
			this.query = this.chatKeyword !== '' ? this.chatKeyword : ''
			const cursor = !this.startDate ? '' : new Date(this.startDate).getTime()
			const messages = await Message.listBySession(this.session.id, this.chatKeyword, cursor, 10, 1)
			this.showQueryPanel ? this.searchMessages = messages.content : this.messages = messages.content
            
            this.messagesLoading = false
        },
        // 点击好友列表item
		async onContactClick(relation) {
			// this.keyword = this.filter.toId ? relation.contact.platformUid : ''		 // 单个好友会话或者群会话，则输入框显示该确定的好友昵称
			this.relation = relation
			this.messagesLoading = true
            this.showQueryPanel = false
            this.startDate = ''
			this.chatKeyword = ''
            this.query = ''
            
            // 后端从go服务获取session，根据expandable传入的参数决定是否展开对应的子对象数据
			this.session = await Session.retrieveByRelation(this.filter.fromId, relation.contact.id, ['profile', 'contact'])
			if (!this.session) {
				this.messages = []
				this.messagesLoading = false
				return
            }
            
			const messages = await Message.listBySession(this.session.id, this.chatKeyword, this.startDate, 10, 1, [])
			this.messages = messages.content
            
            this.messagesLoading = false
        },
        
        // session 下拉加载消息
        async fetchMessagesBackward() {
			if (_.isEmpty(this.messages)) return
                const cursor = _.last(this.messages).sendTime || ''
				const messages = await Message.listBySession(this.session.id, this.chatKeyword, cursor, 10, 1)
				this.messages = _.concat(this.messages, messages.content)
        },
        // session 上拉刷新消息
		async fetchMessagesUpward() {
			if (_.isEmpty(this.messages)) return
				const cursor = _.first(this.messages).sendTime || ''
				const messages = await Message.listBySession(this.session.id, this.chatKeyword, cursor, 10, -1)
				this.messages = _.concat(messages.content, this.messages)
        },
        // 查看上下文
		async onViewContext(sendTime) {
			const cursor = sendTime - 20
			const messages = await Message.listBySession(this.session.id, '', cursor, 10, 1)
			this.messages = messages.content
			this.showQueryPanel = false
        },
    }
}
</script>

