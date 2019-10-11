<template>
    <div class="image-list">
		<div class="image-li" v-if="images.length > 0" v-for="(image, index) in images" :key="timeline.id + '-image-' + index" >
			<div class="image" :style="{backgroundImage: `url(${image})`}" @click="zoomImage(index)">
			</div>
		</div>
		<div class="video-li" v-if="videos.length > 0" v-for="(video, index) in videos" :key="timeline.id + '-video-' + index">
			<video class="video" controls :src="video" width="100%" @click="playVideo($event)">your browser does not support the video tag</video>
		</div>
		<div class="link-li" v-if="links.length > 0 "  v-for="(link, index) in links" :key="timeline.id + '-link-' + index">
			<div class="link">{{`${nickname}分享的链接`}}</div>
		</div>
    </div> 
</template>
<script>
import Constant from "../../../configs/constant";

export default {
  props: {
    nickname: {
      type: String,
      required: true
    },
    timeline: {
      type: [Object],
      required: true
    }
  },
  computed: {
    images() {
      if (this.timeline.mediaItems == null) return [];

      const images = [];
      this.timeline.mediaItems.forEach(item => {
        if (item.MIMEType === Constant.MIMEType.image) {
          images.push(item.url);
        }
      });
      return images;
    },
    videos() {
      if (this.timeline.mediaItems == null) return [];

      const videos = [];
      this.timeline.mediaItems.forEach(item => {
        if (this.timeline.type == Constant.TimelineType.Video.value) {
          videos.push(item.url);
        } else if (item.MIMEType === Constant.MIMEType.video) {
          videos.push(item.url);
        }
      });
      return videos;
    },
    links() {
      if (this.timeline.mediaItems == null) return [];

      const links = [];
      this.timeline.mediaItems.forEach(item => {
        if (item.MIMEType === Constant.MIMEType.link) {
          links.push(item.url);
        }
      });
      return links;
    }
  },
  data() {
    return {
      MIMEType: Constant.MIMEType
    };
  },
  methods: {
    playVideo(event) {
      event.target.play();
    },
    zoomImage(index) {
      App.viewImages(this.images, index);
    }
  }
};
</script>

