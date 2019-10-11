<template>
    <Scroll :height="height" :on-reach-top="onReachTop" :on-reach-bottom="onReachBottom">
        <ul class="message-list-container message-content" v-if="messages && messages.length > 0">
            <li v-for="message in messages" :key="message.id" :class="['message-list','background-signed', {'contact': message.direction ===1 }, {'self': message.direction===2}]">
                <p class="time"><span>{{dateFormat(message.sendTime)}}</span><a @click="onViewContext(message.sendTime)">(查看上下文)</a></p>
                <!-- 系统消息 -->
                <p class="time" v-if="message.messageType===MessageType.Notification.value"><span>{{message.content}}</span></p>
                <!-- 系统消息结束 -->
                <!--  非系统消息 -->
                <message-list-item :message="message" :session="session" :query="query" :sensitives="sensitives" v-on:message-click="handleMessageClick"/>
                <!-- 非系统消息 -->
            </li>
        </ul>
        <div v-else class="noData">
            {{placeholder}}
        </div>
    </Scroll>
</template>
<script>
import MessageListItem from '../components/message-list-item.vue'
import Constant from '../../../../../configs/constant'
import Sensitive from '../../../../../models/risk/sensitive'
export default {
	components: {
		MessageListItem
	},
	props: {
		height: {
			type: Number,
			required: false,
			default: 300
		},
		messages: {
			type: Array,
			required: true
		},
		session: {
			type: Object,
			default: () => {}
		},
		onReachTop: {
			type: Function,
			default: () => Promise.resolve()
		},
		onReachBottom: {
			type: Function,
			default: () => Promise.resolve()
		},
		onViewContext: {
			type: Function,
			required: true
		},
		query: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			placeholder: '搜索不到结果',
			MessageType: Constant.MessageType,
			defaultAvatar: require('../../../../../images/unknown-avatar.jpg'), // url 外部存储
			sensitives: []
		}
	},
	methods: {
		dateFormat(sendTime) {
			let d = null
			try {
				d = new Date(sendTime)
				return dateformat(d, 'yyyy年mm月dd日 HH:MM')
			} catch (e) {
				return '未知'
			}
		},
		async filterSensitive() {
			const data = await Sensitive.pageNoAuth(1, 1000, [], [])
			this.sensitives = data.content
		},
		handleMessageClick(message) {
			if(message.messageType === Constant.MessageType.Image.value || message.messageType === Constant.MessageType.Animation.value) {
				if(/^http/.test(message.objectContent.url)) {
					const images = this.messages.filter(it => {
						return (it.messageType === Constant.MessageType.Image.value || it.messageType === Constant.MessageType.Animation.value)
							&& /^http/.test(message.objectContent.url)
					}).map(it => it.objectContent.url)

					App.viewImages(images, images.indexOf(message.objectContent.url))
				}
			}
		}
	}
}
</script>

