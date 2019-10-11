<template>
  <div style="height: 100%;">
    <iframe
      v-for="frame in frames"
      :key="frame.id"
      :id="`frame-${frame.id}`"
      v-show="frame.id === currentFrame"
      :src="frame.redirect || frame.src"
      width="100%"
      height="100%"
      frameborder="no"
      border="0"
      marginwidth="0"
      marginheight="0"
      scrolling-x="no"
      scrolling-y="auto"
      allowtransparency="yes"
      target="iframe"
    ></iframe>
  </div>
</template>
<script>
import _ from "lodash";
import { parsePath } from "../../util/path";
import { parseQuery, stringifyQuery } from "../../util/query";

// 分配tab id
let frameId = 0;
const assignFrameId = () => {
  return ++frameId;
};

const normalizePath = fullPath => {
  const { path, query, hash } = parsePath(fullPath);
  const queryObj = parseQuery(query);
  delete queryObj._tgt;
  const queryStr = stringifyQuery(queryObj);
  const src = path + queryStr + hash;
  const parsed = { path, query: queryObj };
  const redirect = /^((https|http|ftp|rtsp|mms)?:\/\/)/.test(queryObj._r || "")
    ? queryObj._r
    : "";
  return { src, parsed, redirect };
};

const iframeScrollPosition = id => {
  try {
    const iframe = document.getElementById("frame-" + id);
    const win = iframe.contentWindow || iframe;
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    const left =
      win.pageXOffset === undefined ? doc.scrollLeft || 0 : win.pageXOffset;
    const top =
      win.pageYOffset === undefined ? doc.scrollTop || 0 : win.pageYOffset;
    return { left, top };
  } catch (e) {
    // cross domain
    return { left: 0, top: 0 };
  }
};

const iframeScrollTo = (id, pos) => {
  try {
    const iframe = document.getElementById("frame-" + id);
    const win = iframe.contentWindow || iframe;
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    if (win) win.scrollTo(pos.left, pos.top);
    else if (doc) doc.body.scrollTo(pos.left, pos.top);
  } catch (e) {
    // cross domain
  }
};

const iframeReload = id => {
  try {
    const iframe = document.getElementById("frame-" + id);
    const win = iframe.contentWindow || iframe;
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.location.reload(true);
  } catch (e) {
    // cross domain
  }
};

export default {
  name: "MultiIframeRouterView",

  props: {
    // 保持打开的 iframe src 列表
    activeSrcs: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    }
  },

  data() {
    return {
      currentFrame: -1,
      frames: [],
      frameScrolls: {},
      frameReadyHooks: {},
      frameReadyStates: {}
    };
  },

  watch: {
    $route: function(_, prevRoute) {
      this.updateRoute(prevRoute);
    },
    activeSrcs() {
      this.prune();
    }
  },

  methods: {
    prune() {
      const current = normalizePath(this.$route.fullPath);
      const actives = this.activeSrcs.map(it => normalizePath(it));
      this.frames = this.frames.filter(it => {
        if (it.src === current.src) return true;
        const isActive =
          actives.findIndex(it2 => _.isEqual(it.parsed, it2.parsed)) >= 0;
        if (!isActive) {
          delete this.frameScrolls[it.id];
          delete this.frameReadyStates[it.id];
          delete this.frameReadyHooks[it.id];
        }
        return isActive;
      });
    },

    snapshotPrev(prevRoute) {
      const prev = normalizePath(prevRoute.fullPath);
      const prevFrame = this.frames.find(it => it.src === prev.src);
      if (prevFrame) {
        this.frameScrolls[prevFrame.id] = iframeScrollPosition(prevFrame.id);
        if (this.frameReadyHooks[prevFrame.id]) {
          try {
            document
              .getElementById("frame-" + prevFrame.id)
              .removeEventListener("load", this.frameReadyHooks[prevFrame.id]);
          } catch (e) {}
        }
        delete this.frameReadyHooks[prevFrame.id];
        this.$emit("load-complete");
      }
    },

    newFrame() {
      const route = this.$route;
      const current = normalizePath(route.fullPath);
      let frame = this.frames.find(it => it.src === current.src);
      if (!frame) {
        this.$emit("load-start");
        const id = assignFrameId();
        frame = _.assign({ id, route }, current);
        this.frames.push(frame);
        this.watchReady(id);
      }
      return frame;
    },

    watchReady(id) {
      this.frameReadyStates[id] = false;
      this.frameReadyHooks[id] = () => {
        this.frameReadyStates[id] = true;
        try {
          document
            .getElementById("frame-" + id)
            .removeEventListener("load", this.frameReadyHooks[id]);
        } catch (e) {}
        delete this.frameReadyHooks[id];
        this.$emit("load-complete");
      };
      this.$nextTick(() => {
        try {
          document
            .getElementById("frame-" + id)
            .addEventListener("load", this.frameReadyHooks[id]);
        } catch (e) {
          delete this.frameReadyHooks[id];
        }
      });
    },

    restoreFrame(id) {
      const reload = !this.frameReadyHooks[id] && !this.frameReadyStates[id];
      if (reload) this.$emit("load-start");
      this.$nextTick(() => {
        iframeScrollTo(id, this.frameScrolls[id] || { left: 0, top: 0 });
        if (reload) {
          // 被中断加载的页面，强制重新加载
          this.watchReady(id);
          iframeReload(id);
        }
      });
    },

    updateRoute(prevRoute) {
      if (prevRoute) this.snapshotPrev(prevRoute);
      const frame = this.newFrame();
      this.prune();
      this.currentFrame = frame.id;
      this.restoreFrame(frame.id);
    }
  }
};
</script>
