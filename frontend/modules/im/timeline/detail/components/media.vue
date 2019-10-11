<template>
    <div class="image-list">
		<div class="image-li" v-if="images.length>0" v-for="(image, index) in images" :key="index" >
			<div class="image" :style="{backgroundImage: `url(${image})`}" @click="zoomImage(index)">
			</div>
		</div>
		<div class="video-li" v-if="videos.length>0" v-for="(video, index) in videos" :key="index">
			<video class="video" controls :src="video" width="100%" @click="playVideo($event)">your browser does not support the video tag</video>
		</div>
		<div class="link-li" v-if="links.length>0 "  v-for="(link, index) in links" :key="index">
			<div class="link">{{`${nickname}分享的链接`}}</div>
		</div>
    </div> 
</template>
<script>
import Constant from "../../../../../configs/constant.js";

export default {
  props: {
    nickname: {
      type: String,
      required: true
    },
    media: {
      type: [Array, String, Number, Object],
      required: true
    }
  },
  computed: {
    images() {
      const images = [];
      this.media.forEach(item => {
        if (item.MIMEType === Constant.MIMEType.image) {
          images.push(item.url);
        }
      });
      return images;
    },
    videos() {
      const videos = [];
      this.media.forEach(item => {
        if (item.MIMEType === Constant.MIMEType.video) {
          videos.push(item.url);
        }
      });
      return videos;
    },
    links() {
      const links = [];
      this.media.forEach(item => {
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

