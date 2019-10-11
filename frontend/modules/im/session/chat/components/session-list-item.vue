<template>
    <div class="chat_item slide-left">
        <div class="ext">
            <p class="attr">{{formatTime(item.lastMsg.sendTime || item.ctime)}}</p>
        </div>
        <im-avatar class="avatar" :url="item.toContact.avatar || defaultAvatar" :size="40"  alt=""></im-avatar>
        <div class="info">
            <h3 class="ellipsis nickname">
                <span class="nickname_text">{{ item.alias || item.toContact.nickname || ''}}</span>
            </h3>
             <div class="ellipsis last-message">
                {{ formatMessage(item.lastMsg) }}
            </div>
        </div>
    </div>
</template>
<script>
import Constant from "../../../../../configs/constant";
import { value2Text } from "../../../../../scripts/utils/misc";
const MessageType = Constant.MessageType;
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      defaultAvatar: require("../../../../../images/unknown-avatar.jpg")
    };
  },
  methods: {
    formatTime(timestamp) {
      if (!timestamp) {
        return "未知";
      }
      if (new Date(timestamp).toDateString() === new Date().toDateString()) {
        return dateformat(timestamp, "HH:MM");
      }
      return dateformat(timestamp, "yy/mm/dd HH:MM");
    },
    formatMessage(msg) {
      const type = _.result(msg, "messageType");
      if (!type) {
        return "";
      }
      if (type === MessageType.Text.value) {
        return msg.textContent;
      } else if (type === MessageType.Link.value) {
        let summary = "";
        try {
          summary = msg.objectContent.title;
        } catch (e) {
          console.error("parse link message error: ", msg.objectContent, e);
        }
        return `[链接] ${summary}`;
      } else {
        return `[${value2Text(MessageType, type) || "暂未识别"}]`;
      }
    }
  }
};
</script>

