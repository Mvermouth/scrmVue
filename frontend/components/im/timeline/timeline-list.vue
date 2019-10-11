<template>
	<Scroll :height="height" :on-reach-top="handleReachTop" :on-reach-bottom="handleReachBottom">
		<div class="cover">
			<div class="user-nickname">{{contact.nickname}}</div>
			<div v-if="contact.avatar" class="avatar" :style="{ backgroundImage: `url(${contact.avatar})`}"></div>
		</div>
		<div v-if="timelines.length > 0" class="timeline-list">
			<timeline-list-item v-for="timeline in timelineExts" :key="timeline.id" :timeline="timeline" />
		</div>
		<div v-else class="noData">
			{{ placeholder }}
		</div>
	</Scroll> 
</template> 
<script>
import TimelineListItem from './timeline-list-item.vue'
import Timeline from '../../../models/im/timeline'

export default {
	components: {
		TimelineListItem,
	},
	computed: {
		timelineExts() {
			return _.map(this.timelines, timeline => Object.assign(timeline, { contact: this.contact }))
		}
	},
	props: {
		contact: {
			type: Object,
			default: () => {}
		},
		timelines: {
			type: Array,
			default: () => []
		},
		height: {
			type: [Number, String],
			required: true,
		},
		placeholder: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
		}
	},
	mounted() {
	},
	methods: {
		handleReachTop() {
			this.$emit('reach-top')
		},
		handleReachBottom() {
			this.$emit('reach-bottom')	
		}
	}
}
</script>