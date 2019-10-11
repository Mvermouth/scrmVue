<style lang="less">
.video-list-item {
  box-shadow: 1px 1px 50px rgba(0, 0, 0, 0.3);
  margin: 4px 4px 4px 4px;
  padding: 0px;
  overflow: hidden;
  border-radius: 8px;
  background: #fff;

  width: 225px;
  height: 400px;
  -webkit-mask-image: -webkit-radial-gradient(circle, white 100%, black 100%);
  -webkit-border-radius: 8px;
  -moz-border-radius: 8px;

  -webkit-transform: translateZ(0);
}
</style>
<template>
  <div class="video-list-item">
    <a :href="play_addr" target="_blank">
      <video
        loop="loop"
        width="100%"
        height="100%"
        @mouseenter="e => e.target.play()"
        @mouseleave="e => e.target.pause()"
        :poster="item.video.dynamic_cover.url_list[0]"
      >
        <source :src="play_addr">浏览器不支持 HTML5 视频.
      </video>
    </a>
  </div>
</template>

<script>
import _ from "lodash";
import AppProxy from "../../../../../../scripts/common/appProxy";
import AppRoutes from "../../../../../../configs/AppRoutes";
import Constant from "../../../../../../configs/constant.js";
import defaultAvatar from "../../../../../../images/default-avatar.png";

const commonActions = {};

export default {
  components: {},
  props: {
    item: {
      type: Object
    },
    product: {
      type: Object
    }
  },
  mounted() {},
  data() {
    return {
      AppProxy: AppProxy,
      AppRoutes: AppRoutes,
      Constant: Constant,
      defaultAvatar: defaultAvatar
    };
  },
  computed: {
    play_addr() {
      let url = this.item.video.play_addr.url_list[0];
      /*
      if (url.startsWith("http:")) {
        url = url.substr(5);
      }
      */
      const proxy_url =
        "//api1.qiaoqiaowan.net/douyin/download_file?url=" +
        encodeURIComponent(url);
      return proxy_url;
    }
  },
  methods: {
    handleAction(action) {
      const actionObj = commonActions[action];
      if (actionObj) {
        actionObj.onAction.call(this, this.product);
      }
    }
  }
};
</script>
