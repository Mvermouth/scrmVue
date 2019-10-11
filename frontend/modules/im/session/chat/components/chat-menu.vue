<template>
    <div class="list-aside">
        <div class="list-aside-header" ref="listAsideHeader">
            <div class="search-bar">
                <i-input v-model="keyword" clearable @on-enter="handleSearch" placeholder="请输入好友信息" ><i-button slot="append" icon="search" @click="handleSearch"></i-button></i-input>
            </div>
        </div>
        <div class="list-pane" ref="listPane">
            <keep-alive>
                <session-list v-if="filter.currentTab === 'session'"
                    ref="sessionList" 
                    :filter="filter" 
                    v-on:session-changed="handleSessionChanged" />
                <contact-list v-else-if="filter.currentTab === 'contact'" 
                    ref="contactList" 
                    :filter="filter"
                    v-on:contact-changed="handleContactChanged" />
                <group-list v-else-if="filter.currentTab === 'group'" 
                    ref="groupList"
                    :filter="filter" 
                    v-on:group-changed="handleGroupChanged" />
            </keep-alive>
        </div>
    </div>
</template>
<script>
import SessionList from "./session-list.vue";
import ContactList from "./contact-list.vue";
import GroupList from "./group-list.vue";

export default {
  props: {
    filter: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    SessionList,
    ContactList,
    GroupList
  },
  data() {
    return {
      keyword: this.filter.keyword
    };
  },
  mounted() {},
  created() {},
  watch: {
    /*keyword() {
      this.filter.keyword = this.keyword;
      if (this.keyword === "") {
        this.handleSearch();
      }
    },*/
    filter() {
      // TODO 这里为何还要监听改变
      this.keyword = this.filter.keyword;
    }
  },
  methods: {
    handleSearch() {
      this.filter.keyword = this.keyword

      switch (this.filter.currentTab) {
        case "session":
          {
            this.$refs.sessionList.doSearch();
          }
          break;
        case "contact":
          {
            this.$refs.contactList.doSearch();
          }
          break;
        case "group": {
          this.$refs.groupList.doSearch();
        }
      }
    },
    handleSessionChanged(session) {
      this.$emit("item-changed", "session", session);
    },
    handleContactChanged(relation) {
      this.$emit("item-changed", "contact", relation);
    },
    handleGroupChanged(group) {
      this.$emit("item-changed", "group", group);
    }
  }
};
</script>

