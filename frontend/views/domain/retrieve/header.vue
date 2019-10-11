<template>
  <div :class="`${clsPrefix}-header`">
    <div class="detail">
      <div v-if="logo" class="logo">
        <render-content v-if="typeof logo === 'function'" :render="logo"></render-content>
        <img v-else :src="logo">
      </div>
      <div class="main">
        <div class="row">
          <h1 class="title">{{title}}</h1>
          <div v-if="actions.length > 0" class="actions">
            <button-group v-if="extraActions.length > 0">
              <i-button
                v-for="it in extraActions"
                :key="it.title"
                type="ghost"
                @click="onAction(it)"
              >{{it.title}}</i-button>
            </button-group>
            <i-button
              :key="primaryAction.title"
              type="primary"
              @click="onAction(primaryAction)"
            >{{primaryAction.title}}</i-button>
          </div>
        </div>
        <div class="row">
          <div class="content">
            <row class-name="content-row">
              <i-col
                v-for="it in contentList"
                :key="it.k"
                :xs="24"
                :sm="it.long ? 24 : 12"
                class-name="content-col"
              >
                <div class="term">{{it.k}}</div>
                <div class="value">
                  <render-content v-if="typeof it.v === 'function'" :render="it.v"></render-content>
                  <span v-else>{{it.v}}</span>
                </div>
              </i-col>
            </row>
          </div>
          <div v-if="extraList.length > 0" class="extra">
            <row>
              <i-col v-for="it in extraList" :key="it.k" :xs="24" :sm="12">
                <div class="term">{{it.k}}</div>
                <div class="value">
                  <render-content v-if="typeof it.v === 'function'" :render="it.v"></render-content>
                  <span v-else>{{it.v}}</span>
                </div>
              </i-col>
            </row>
          </div>
        </div>
      </div>
    </div>
    <tabs v-if="tabList.length > 0" size="small" @on-click="onTab">
      <tab-pane v-for="tab in tabList" :key="tab.name" :label="tab.title" :name="tab.name"></tab-pane>
    </tabs>
  </div>
</template>
<script>
import _ from "lodash";

/**
 * 详情页头部
 */
export default {
  props: {
    /**
     * 图标 - 44*44
     */
    logo: {
      type: [String, Function],
      required: false
    },

    /**
     * 标题
     */
    title: {
      type: String,
      required: true
    },

    /**
     * 操作列表，第一个为主操作
     *
     * 格式
     * [
     *      { '编辑': () => {} }
     * ]
     */
    actions: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    },

    /**
     * 信息字段
     *
     * 格式
     * [
     *      // 文本内容
     *      {'标题': '内容'},
     *
     *      // 自定义渲染
     *      {'标题': h => { } },
     *
     *      // 内容 + 属性配置
     *      {'标题': { content: '', long: true } },
     *      {'标题': { content: h => { }, long: true } }
     * ]
     */
    content: {
      type: Array,
      required: true
    },

    /**
     * 附加状态
     *
     * 格式参考信息字段
     */
    extra: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    },

    /**
     * Tab切换
     *
     * 格式 [{'name': '标题'}, ...]
     */
    tabs: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    }
  },

  data() {
    return {
      // 样式前缀
      clsPrefix: `${App.options.styles.prefix}retrieve`
    };
  },

  computed: {
    contentList() {
      return this.content.map(it => {
        const k = _.keys(it)[0];
        let v = it[k];
        let long = false;
        if (typeof v === "object") {
          long = v.long;
          v = v.content;
        }
        return { k, v, long };
      });
    },

    extraList() {
      return this.extra.map(it => {
        const k = _.keys(it)[0];
        const v = it[k];
        return { k, v };
      });
    },

    extraActions() {
      return this.actions.slice(1).map(it => {
        const title = _.keys(it)[0];
        const action = it[title];
        return { title, action };
      });
    },

    primaryAction() {
      const it = this.actions[0];
      const title = _.keys(it)[0];
      const action = it[title];
      return { title, action };
    },

    tabList() {
      return this.tabs.map(it => {
        const title = _.keys(it)[0];
        const name = it[title];
        return { title, name };
      });
    }
  },

  mounted() {
    if (this.tabList.length > 0) {
      this.$emit("on-tab", this.tabList[0].name);
    }
  },

  methods: {
    onTab(name) {
      this.$emit("on-tab", name);
    },
    onAction(it) {
      it.action.call(this);
    }
  }
};
</script>

