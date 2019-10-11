<!-- 
** 群和好友都当着运营号的好友处理的，所以left-aside的列表既可以是群也可以好友，变量命名统称contact 
-->
<template>
    <div class="message-wrapper" ref="messageWrapper" v-resize="onResize">
		<div class="sider-bar">
			<!-- 运营号相关信息面板， 如好友列表、 会话列表、 群列表， 朋友圈 -->
			<div class="tab-pane-avatar pointer" v-clickoutside="()=>{show = false}" @click="onProfileAvatar">
				<account-info-widget v-show="show" :fromContact="fromContact"></account-info-widget>
				<im-avatar  :url="fromContact.avatar" :size="40"></im-avatar>
			</div>
			<div class="tab-pane">
				<div v-for="tab in tabs" :key="tab.key" :class="['tab-pane-icon', {'hightlight-icon': currentTabInfo.key === tab.key }]" @click="handleTabClick(tab)"><i :class="tab.icon"/></div>
			</div>
		</div>
		<div class="content-pane">
			<keep-alive>
				<component
					v-bind:is="currentTabComponent"
					v-bind:filter="currentFilter">
				</component>
			</keep-alive>
		</div>
    </div>  
</template>
<script>
import ChatMainView from "./components/chat-main-view.vue";
import TimelineView from "../../../../components/im/timeline/timeline-view.vue";

// import Contact from '../../../../models/im/contact'
import Profile from "../../../../models/im/profile";
import AccountInfoWidget from "./components/account-info-widget.vue";

export default {
  props: {},
  components: {
    AccountInfoWidget
  },
  data() {
    return {
      tabs: [
        {
          key: "session",
          icon: "iconfont icon-chat",
          component: ChatMainView,
          filter: {}
        },
        {
          key: "contact",
          icon: "iconfont icon-contacts",
          component: ChatMainView,
          filter: {}
        },
        {
          key: "group",
          icon: "iconfont icon-group",
          component: ChatMainView,
          filter: {}
        },
        {
          key: "timeline",
          icon: "iconfont icon-timeline",
          component: TimelineView,
          filter: {}
        }
      ],
      currentTabInfo: {},
      fromContact: {},
      show: false // 运营号详情
    };
  },
  computed: {
    currentTabComponent() {
      return this.currentTabInfo.component;
    },
    currentFilter() {
      return this.currentTabInfo.filter;
    }
  },
  async mounted() {
    this.$refs.messageWrapper.style.height = `${
      window.frameElement.contentWindow.innerHeight
    }px`;

    _.forEach(this.tabs, tab => {
      tab.filter = {
        fromId: App.data.domain.fromId,
        toId: App.data.domain.toId,
        currentTab: App.data.domain.currentTab,
        keyword: "",
        refId: App.data.domain.refId
      };
    });

    const tabMap = _.keyBy(this.tabs, "key");
    this.currentTabInfo = tabMap[App.data.domain.currentTab] || this.tabs[0];

    this.currentTabInfo.filter.keyword = this.currentTabInfo.filter.toId || "";

    /*
    const data = await Profile.page(
      1,
      10,
      [
        {
          filterType: "EQ",
          property: "contactID",
          value: App.data.domain.fromId
        }
      ],
      []
    );
	this.fromContact = data.content[0];
	*/
    this.fromContact = await Profile.retrieveByContactID(
      App.data.domain.fromId
    );
  },
  methods: {
    onResize() {
      this.$refs.messageWrapper.style.height = `${
        window.frameElement.contentWindow.innerHeight
      }px`;
    },
    handleTabClick(tab) {
      if (tab === this.currentTabInfo) return;

      this.currentTabInfo = tab;
      this.currentTabInfo.filter.currentTab = tab.key;
    },
    onProfileAvatar() {
      if (!this.show) {
        this.show = !this.show;
      }
    }
  }
};
</script>

