<template>
    <div class="chat-content-view">
        <div class="message-aside">
            <div class="message-header">
                <div class="search-bar">
                    <date-picker class="date-pick" type="datetime" v-model="startDate" placeholder="选择起始时间"></date-picker>
                    <i-input class="keyword-search" v-model="keyword" clearable @on-enter="handleSearchMessages" placeholder="请输入聊天内容"><i-button slot="append" icon="search" @click="handleSearchMessages"></i-button></i-input>
                </div>
            </div>
            <div class="message-pane">
                <template>
                    <message-list 
                        v-if="!showQueryPanel"
                        :height="height"
                        :placeholder="placeholder"
                        :messages="messages" 
                        :session="session"
                        :query="keyword"
                        :on-reach-top="handleMessagesUpward"	
                        :on-reach-bottom="handleMessagesBackward"
                    ></message-list>
                    <search-result-list 
                        v-else
                        :height="height"
                        :messages="messages" 
                        :session="session"
                        :query="keyword"
                        :onViewContext="onViewContext"
                        :on-reach-top="handleMessagesUpward"	
                        :on-reach-bottom="handleMessagesBackward"
                    />
                </template>
                <Spin v-if="isLoading" class="spin" size="large" fix></Spin>
            </div>
        </div>
        <keep-alive>
            <group-profile-panel v-if="session.group" :group="session.group" />
        </keep-alive>
    </div>
</template>
<script>

import MessageList from './message-list.vue'
import SearchResultList from './search-result-list.vue'
import GroupProfilePanel from './group-profile-panel.vue'

import Message from '../../../../../models/im/message'
export default {
    props: {
        filter: {
			type: Object,
			default: () => {}
        },
        session: {
            type: Object,
            required: true
        }
    },
    components: {
        MessageList,
        SearchResultList,
        GroupProfilePanel,
    },
    data() {
        return {
            refId: this.filter.refId,
            startDate: '',
            keyword: '',
            showQueryPanel: false,  
            isLoading: false,
            messages: [],
            placeholder: '',
            height: window.frameElement.contentWindow.innerHeight - 42
        }
    },
    watch: {
        session(oldVal, newVal) {
            if (oldVal.id === newVal.id) return
            this.showQueryPanel = false
            this.keyword = ''
            this.startDate = ''
            this.messages = []
            this.loadMessages()
        }
    },
    methods: {
        async fetchMessages(cursor, direction) {
            if (!this.session.id) {
                this.placeholder = '没有找到会话' 
                return
            }

            this.isLoading = true

            const page = await Message.listBySession(this.session.id, this.keyword, cursor, 10, direction)
            const messages = page.content

            this.isLoading = false

            return messages
        },
        //初始化加载消息
        async loadMessages() {
            this.isLoading = true
            
            if (this.refId) {
                const result = await Message.retrieve(this.refId)
                if (result) {
                    this.messages = [result]
                    this.showQueryPanel = true
                } else {
                    this.messages = []
                }
            } else {
                if (!this.session.id) {
                    this.placeholder = '没有找到会话'
                    this.isLoading = false 
                    return
                }
                const page = await Message.listBySession(this.session.id, this.keyword, null, 10, -1)
                this.messages = page.content
            }

            this.isLoading = false
            
            if (_.isEmpty(this.messages)) this.placeholder = '没有历史消息'

            this.refId = null
        },
        // 消息查询
		async handleSearchMessages() {
            this.placeholder = ''
            this.showQueryPanel = this.keyword !== ''

            if (this.showQueryPanel) {
                this.messages = []  // 先清空，免得影响视觉
            }

			const cursor = this.startDate? this.startDate.getTime() : ''
            this.messages = await this.fetchMessages(cursor, 1)

            if (_.isEmpty(this.messages)) this.placeholder = '没有找到匹配的消息'
        },
        // session 下拉加载消息
        async handleMessagesBackward() {
            const debounce = _.debounce(async ()=> {
                const cursor = _.isEmpty(this.messages) ? '' : _.last(this.messages).sendTime
                const keyword = this.showQueryPanel ? this.keyword : ''
                const page = await Message.listBySession(this.session.id, keyword, cursor, 10, 1)
                const messages = page.content
                this.messages = _.concat(this.messages, messages)            

                this.placeholder =  _.isEmpty(this.messages) ? '没有找到历史消息' : ''
            }, 300, {maxWait: 1000})
            debounce()
            
        },
        // session 上拉刷新消息
		async handleMessagesUpward() {
            const debounce = _.debounce(async ()=> {
                const cursor = _.first(this.messages).sendTime || ''
                const keyword = this.showQueryPanel ? this.keyword : ''
                const page = await Message.listBySession(this.session.id, keyword, cursor, 10, -1)
                const messages = page.content
                this.messages = _.concat(messages, this.messages)
            
                this.placeholder = _.isEmpty(this.messages) ? '没有找到历史消息' : ''
            }, 250, {maxWait: 1000})
            debounce()            
        },
        // 查看上下文
		async onViewContext(sendTime) {
            this.messages = []  // 先清空，免得影响视觉
            this.placeholder = ''
            // TODO 这里要上下各查 10条
            const cursor = sendTime - 2000

            this.isLoading = true

            const page = await Message.listBySession(this.session.id, '', cursor, 10, 1)
            this.messages = page.content

            this.isLoading = false

            if (_.isEmpty(this.messages)) this.placeholder = '没有找到匹配的消息'
            
            this.showQueryPanel = false        
		},
    }
}
</script>

