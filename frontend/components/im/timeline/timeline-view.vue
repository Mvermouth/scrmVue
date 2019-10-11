<template>
    <div class="discovery-wrapper" v-resize="onResize">
		<div class="header">
			<date-picker class="date-pick" type="datetime" v-model="startDate" placeholder="选择起始时间"></date-picker>
            <i-input class="keyword-search" v-model="keyword" placeholder="请输入朋友圈内容"><i-button slot="append" icon="search" @click="handleSearchTimeline"></i-button></i-input>
		</div>
		<div ref="timelinePanel" class="timeline-panel">
			<timeline-list :height="timelineListHeight" :placeholder="placeholder" 
				:timelines="timelines" 
				:contact="contact"
				v-on:reach-top="handleReachTop"
				v-on:reach-bottom="handleReachBottom"/>
			<Spin v-if="isLoading" fix></Spin>
		</div>
	</div>
</template> 

<script>
import Timeline from '../../../models/im/timeline'
import TimelineList from './timeline-list.vue'

import Contact from '../../../models/im/contact'

export default {
	components: {
		TimelineList,
	},
	props: {
		filter: {
			type: Object,
			required: true
		},
	},
	data() {
		return {
			startDate: '',
			keyword: '',
			contact: App.data.domain,
			timelines: [],
			isLoading: false,
			timelineListHeight: 0,
			placeholder: '',
		}
	},
	async mounted() {
		this.onResize()

		const ownerId = this.filter.ownerType === 'to' ? this.filter.toId : this.filter.fromId
		this.contact = await Contact.retrieve(ownerId)
		this.filter.cursor = this.filter.cursor || new Date()

		// 查小于当前时间的，最近的 10 条 朋友圈
		this.timelines = await this.getData(this.contact.id, -1, 10, this.filter.cursor, [])
	
		if (_.isEmpty(this.timelines)) this.placeholder = '没有找到记录'
	},
	methods: {
		onResize() {
			this.timelineListHeight = window.frameElement.contentWindow.innerHeight - 42
			this.$refs.timelinePanel.style.height = window.frameElement.contentWindow.innerHeight - 42
		},
		// 获取朋友圈数据
		async getData(publisherId, direction, size, cursor = null, query = []) {
			let filter
			filter = [
				{ 'filterType': 'EQ', 'property': 'publisher.id', 'value': publisherId },
				{ 'filterType': 'EQ', 'property': 'profile.contactID', 'value': this.filter.fromId }
			]
			if (query.length > 0) {
				filter = _.concat(filter, query)
			}
			cursor = cursor ? new Date(cursor) : null
			const data = await Timeline.list({ filter: filter, direction: direction, size: size, cursor: cursor })
			return data.content
		},
		obtainRefCommentNickName(refCommentID, comments) {
			const comment = _.find(comments, it => { return it.commentID === refCommentID })
			if (comment === undefined) {
				return null
			} else {
				return comment.nickname
			}
		},

		dateFomat(dateString) {
			return dateformat(dateString, 'yyyy年mm月dd日 HH:MM')
		},
		async handleReachTop() {
			const param = []
			if (!_.isEmpty(this.keyword)) {
				param.push({ property: 'content', filterType: 'LIKE', value: this.keyword })
			}

			let cursor 
			if (!_.isEmpty(this.timelines)) {
				cursor = _.first(this.timelines).publishTime
			} else {
				cursor = new Date()
			}
			console.log('handleReachTop cursor: ', cursor)

			const content = await this.getData(this.contact.id, 1, 10, cursor, param)
			this.timelines = _.concat(content, this.timelines)
		},
		async handleReachBottom() {
			const param = []
			if (!_.isEmpty(this.keyword)) {
				param.push({ property: 'content', filterType: 'LIKE', value: this.keyword })
			}

			let cursor 			
			if (!_.isEmpty(this.timelines)) {
				cursor = _.last(this.timelines).publishTime
			} else {
				cursor = 0
			}
			
			const content = await this.getData(this.contact.id, -1, 10, cursor, param)
			this.timelines = _.concat(this.timelines, content)
		},
		// 搜索朋友圈
	    async handleSearchTimeline() {
			let cursor = null
			this.isLoading = true
			try {
				const param = []
				if (!_.isEmpty(this.keyword)) {
					param.push({ property: 'content', filterType: 'LIKE', value: this.keyword })
				}

				if (this.startDate instanceof Date) {
					cursor = this.startDate
				}
				const timelinesData = await this.getData(this.contact.id, 1, 10, cursor, param)
				this.timelines = timelinesData

				if (_.isEmpty(this.timelines)) this.placeholder = '没有找到记录'

				this.isLoading = false
			} catch (e) {
				this.isLoading = false
			}
		}
	}
}
</script>