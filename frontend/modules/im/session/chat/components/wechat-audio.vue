<template>
    <div>
        <audio :ref="message.id" :src="message.objectContent.url" @loadedmetadata="loadedmetadata" hidden="hidden" ></audio>
        <div class="audio-bg" :ref="`play_${message.id}`" @click="togglePlayAudio">
            <div :class="['play-icon', 'pause', {'play': play}]"></div>
        </div>
        <div v-if="parseInt(duration) !== 0" class="duration">{{`${duration}"`}}</div>
    </div> 
</template>

<script>
export default {
	props: {
		message: {
			type: Object,
			required: true
		},
	},
	data() {
		return {
			duration: 0,
			loaded: false,
			play: false,
			setTo: null
		}
	},
	mounted() {
		this.initData()
	},
	methods: {
		initData() {
		},
		loadedmetadata(){
			const me = this
			const audio = this.$refs[this.message.id]
			const audio_bg = this.$refs[`play_${this.message.id}`]
			console.log("loadedmetadata callback duration:",audio.duration)
			me.loaded = true
			if (isNaN(audio.duration)) {
				audio_bg.style.cursor = 'not-allowed'
			} else {
				audio_bg.style.width = `${70 + (audio.duration / 60) * (180 - 70)}px`
				me.duration = Math.round(audio.duration)
			}
		},
		togglePlayAudio(id, event) {
			this.play = !this.play
			const audio = this.$refs[this.message.id]
			if (!this.loaded) {
				return
			}

			if (this.play) {
				audio.play()
				this.setTo = setTimeout(() => {
					audio.pause()
					this.play = false
    				}, (this.duration || 0) * 1000)
			} else {
				audio.pause()
				audio.currentTime = 0
				clearTimeout(this.setTo)
			}
		}
	}
}
</script>

