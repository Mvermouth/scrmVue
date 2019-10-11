<template>
    <div class="message-list-item messages" v-if="message.messageType!==MessageType.Notification.value">
        <div v-if="session.type === 1" class="avatar">
            <im-avatar :url="message.direction === 1 ? session.toContact.avatar : session.fromContact.avatar" :size="40"></im-avatar>
        </div>
        <div v-else-if="session.type === 2" class="avatar">
            <im-avatar :url="message.direction === 1 ? message.avatar : session.fromContact.avatar" :size="40" ></im-avatar>
        </div>
        <message-content :message="message" :sensitives="sensitives" :query="query" @click.native="handleMessageClick(message)"></message-content>
		<div v-if="message.deleteStatus === 1" class="tils">
            被删除!
        </div>
        <div v-if="message.revoke === 1" class="tils">
            !被撤回
        </div>
    </div>
</template>
<script>
import MessageContent from '../components/message-content.vue'
import Sensitive from '../../../../../models/risk/sensitive'
import Constant from '../../../../../configs/constant';

export default {
    components: {
        MessageContent
    },
    props: {
        message: {
            type: Object,
            required: true
        },
        //对话详情
        session: {
            type: Object,
            required: false,
            default: () => {}
        },
        //标记关键字
        query: {
            type: String,
            default: ''
        },
        //标记敏感词
        sensitives: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            MessageType: Constant.MessageType
        }
	},
	methods: {
		handleMessageClick(message) {
			this.$emit('message-click', message)
		}
	}
}
</script>