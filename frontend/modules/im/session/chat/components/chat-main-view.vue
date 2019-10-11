<template>
    <div class="panel">
		<chat-menu 
			:filter="filter"
			v-on:item-changed="handleItemChanged"
			/>
        <chat-content-view :filter="filter" :session="session" />
    </div>
</template>
<script>
import ChatMenu from "./chat-menu.vue";
import ChatContentView from "./chat-content-view.vue";

import Session from "../../../../../models/im/session";
import Group from "../../../../../models/im/group";

export default {
  props: {
    filter: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    ChatMenu,
    ChatContentView
  },
  data() {
    return {
      session: {},
      sessionMap: {} // 备忘录
    };
  },
  computed: {
    currentTab() {
      return this.filter.currentTab;
    }
  },
  mounted() {},
  watch: {
    currentTab() {
      const session = this.sessionMap[this.filter.currentTab];
      if (session) this.session = session;
    }
  },
  methods: {
    async handleItemChanged(type, item) {
      //item为空
      if (!item) {
        this.session = {};
        return;
      }
      switch (type) {
        case "session":
          {
            // 触发chat-view
            const session = item;
            if (item && item.type == 2) {
              session.group = await Group.retrieve(item.toId);
            }

            this.session = session;
            this.sessionMap[this.filter.currentTab] = session;
          }
          break;
        case "contact":
          {
            // 后端从go服务获取session，根据expandable传入的参数决定是否展开对应的子对象数据
            let session = await Session.retrieveByRelation(
              item.profile.contactID,
              item.contact.id,
              ["profile", "contact"]
            );
            session = session || { sessionType: 1 };
            // 触发chat-view
            this.session = session;
            this.sessionMap[this.filter.currentTab] = session;
          }
          break;
        case "group":
          {
            // 后端从go服务获取session，根据expandable传入的参数决定是否展开对应的子对象数据
            let session = await Session.retrieveByRelation(
              item.profile.contactID,
              item.group.id,
              ["profile", "group"]
            );
            session = session || { sessionType: 2 }; // local temp session
            session.group = item; // 挂载 group 在 session 对象上
            // 触发chat-view
            this.session = session;
            this.sessionMap[this.filter.currentTab] = session;
          }
          break;
      }
    }
  }
};
</script>

