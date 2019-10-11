<template>
    <Scroll :height="height" v-if="messages && messages.length > 0" :on-reach-top="onReachTop" :on-reach-bottom="onReachBottom">
        <ul class="message-list-container message-content">
            <li v-for="message in messages" :key="message.id" :class="['message-list',{'contact': message.direction ===1 }, {'self': message.direction===2}]">
                <p class="time"><span style="word-break:break_all;">{{dateFormat(message.sendTime)}}</span></p>
                <!-- 系统消息 -->
                <p class="time" v-if="message.messageType===MessageType.Notification.value"><span>{{message.textContent}}</span></p>
                <!-- 系统消息结束 -->
                <!--  非系统消息 -->
                <message-list-item :message="message" :session="session" :query="query" :sensitives="sensitives" v-on:message-click="handleMessageClick"/>
                <!-- 非系统消息 -->
            </li>
        </ul>
    </Scroll>
    <div v-else class="noData">
        {{placeholder}}
    </div>
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
			default: 300
		},
		messages: {
			type: Array,
			required: false
		},
		session: {
			type: Object,
			required: false,
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
		query: {
			type: String,
			default: ''
		},
		placeholder: {
			type: String,
			default: ''
		}
	},
	created() {
		this.filterSensitive()
	},
	data() {
		return {
			MessageType: Constant.MessageType,
			sensitives: []
		}
	},
	watch: {
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

