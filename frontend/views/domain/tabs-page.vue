<template>
    <div>
        <list-form
            v-if="formItems && formItems.length > 0"
            :class="size === 'small' ? 'mb1f' : 'mb2f'"
            :form-items="formItems"
            :size="size"
            v-bind="formProps"
            @on-criterias="onCriterias"></list-form>

        <tabs v-model="currentTab" size="small" v-show="showTabs">
            <tab-pane v-for="tab in tabs" :key="`tab-pane-${tab.name}`" :name="tab.name" :label="tab.label" :icon="tab.icon"></tab-pane>
        </tabs>

        <div :class="`${clsPrefix}list-page-container`">

            <!-- <keep-alive> -->

                <list-page-loader
                    ref="loader"
                    v-for="tab in tabs"
                    v-if="currentTab === tab.name"
                    :key="`tab-content-${tab.name}`"
                    :load-page="loadListPage[tab.name]"
                    :id-key="idKey"
                    :default-sort="tab.defaultSort"
                    :default-page-no="tab.defaultPageNo"
                    :default-page-size="tab.defaultPageSize"
                    :default-criterias="tab.defaultCriterias"
                    :list-criterias="criterias"
                    :transform-criterias="tab.transformCriterias"
                    @on-selections="onSelections"
                    >

                    <template slot-scope="{ listDataSource, listDelegator }">

                        <row class="row">
                            <i-col span="12">
                                <list-actions
                                    :list-data-source="listDataSource"
                                    :list-delegator="listDelegator"
                                    :actions="tabActions[tab.name]"
                                    :size="tab.size || 'default'"></list-actions>
                            </i-col>
                        </row> 

                        <row class="row">
                            <i-col span="24">
                                <list-paginator 
                                    :list-data-source="listDataSource"
                                    :list-delegator="listDelegator"
                                    :props="tabPageProps[tab.name]">
                                    <list-selections-desc
                                        :list-data-source="listDataSource"
                                        :list-delegator="listDelegator"></list-selections-desc>
                                </list-paginator>
                            </i-col>
                        </row>

                        <row class="row">
                            <i-col span="24">
                                <list-grid-view
                                    v-if="tabDisplay[tab.name] === 'grid'"
                                    :list-data-source="listDataSource"
                                    :list-delegator="listDelegator"
                                    :render-grid="tab.renderGrid"
                                    :props="tab.gridProps || {}"
                                    :selection="tab.selection"
                                    :cls-prefix="clsPrefix"></list-grid-view>

                                <list-table-view
                                    v-if="tabDisplay[tab.name] === 'table'"
                                    :list-data-source="listDataSource"
                                    :list-delegator="listDelegator"
                                    :columns="tab.columns || []"
                                    :props="tab.tableProps || {}"
                                    :selection="tab.selection"
                                    ></list-table-view>
                                <list-container
                                    v-if="tabDisplay[tab.name] === 'custom'"
                                    :list-component="listComponent"
                                    :list-item-component="listItemComponent"
                                    :list-data-source="listDataSource"
                                    :list-delegator="listDelegator"
                                    :selection="tab.selection"
                                    :cls-prefix="clsPrefix">
                                </list-container>

                            </i-col>
                        </row>
                        
                        <row class="row">
                            <i-col span="24">
                                <list-paginator 
                                    :list-data-source="listDataSource"
                                    :list-delegator="listDelegator"
                                    :props="tabPageProps[tab.name]">
                                    <list-selections-desc
                                        :list-data-source="listDataSource"
                                        :list-delegator="listDelegator"></list-selections-desc>
                                </list-paginator>
                            </i-col>
                        </row> 

                    </template>

                </list-page-loader>

            <!-- </keep-alive> -->

        </div>
            
    </div>
</template>
<script>
import _ from "lodash";
import defaultListActions from "./utils/defaultListActions";
import ListContainer from "./list-container.vue";

// Domain授权的操作
const permittedActions = App.data.actions || [];

// 有效的权限格式 => action_xxx 匹配 action
const isActionPermitted = action => {
  return permittedActions.some(it => it.split("_")[0] === action);
};

export default {
  components: {
    ListContainer
  },
  props: {
    listComponent: {
      type: Object
    },
    listItemComponent: {
      type: Object
    },
    display: {
      type: String,
      required: false,
      default: "table"
    },
    // 数据唯一标识字段
    defaultIdKey: {
      type: String,
      required: false
    },

    // 筛选表单项
    formItems: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    },

    // 筛选表单配置，透传给 list-form
    formProps: {
      type: Object,
      required: false,
      default() {
        return {};
      }
    },

    /**
     * 一组对domain的操作集合
     *
     * 接口参考 DomainModel
     */
    domain: {
      type: Object,
      required: false
    },

    // 自定义数据加载接口，覆盖domain默认
    loadPage: {
      type: Function,
      required: false
    },

    // 尺寸规格 small|large|default
    size: {
      type: String,
      required: false,
      default: "default"
    },

    /**
     * Tab配置
     *
     * 参数:
     * {
     *      name: '唯一标识',
     *      label: 'Tab名称',
     *
     *      其它参数参考 page.vue 包括:
     *          display, selection, defaultCriterias, defaultPageNo, defaultPageSize,
     *          defaultSort, transformCriterias, size, actions, renderGrid, gridProps,
     *          columns, tableProps, pageProps, loadPage
     * }
     */
    tabs: {
      type: Array,
      required: true,
      default() {
        [];
      }
    },
    showTabs: {
      type: Boolean,
      required: false,
      default: true
    },
    // 默认选中tab
    defaultSelectTab: {
      type: String,
      required: false
    }
  },

  data() {
    return {
      // 当前tab
      currentTab: this.defaultSelectTab || this.tabs[0].name,

      currentDisplay: this.display === "auto" ? "table" : this.display,

      // 表格筛选条件
      criterias: [],

      // 预定义的列表操作
      defaultListActions: defaultListActions(this.domain),

      // 样式前缀
      clsPrefix: `${App.options.styles.prefix}`
    };
  },

  computed: {
    // 列表加载数据接口
    loadListPage() {
      return this.tabs.reduce((map, it) => {
        map[it.name] = it.loadPage
          ? it.loadPage
          : this.loadPage
            ? this.loadPage
            : this.domain.page.bind(this.domain);
        return map;
      }, {});
    },

    // 数据唯一标识字段
    idKey() {
      return (
        this.defaultIdKey || (this.domain && this.domain.primaryKey) || "id"
      );
    },
    tabDisplay() {
      return this.tabs.reduce((map, it) => {
        map[it.name] = it.display === "auto" ? "table" : it.display || "table";
        return map;
      }, {})
    },
    tabActions() {
      return this.tabs.reduce((map, it) => {
        map[it.name] = (it.actions || [])
          .map(it => {
            if (typeof it === "string" && this.defaultListActions[it]) {
              // 是预定义操作
              return isActionPermitted(it) ? this.defaultListActions[it] : null;
            }

            if (typeof it !== "object") return;

            const actionType = _.keys(it)[0];
            const action = it[actionType];

            // 未授权
            if (!action.unauthorize && !isActionPermitted(actionType)) return;

            // 预定义操作覆盖默认行为
            const defaultAction = this.defaultListActions[actionType];
            return defaultAction
              ? _.assign(_.cloneDeep(defaultAction), action)
              : action;
          })
          .filter(it => !!it);
        return map;
      }, {});
    },

    tabPageProps() {
      return this.tabs.reduce((map, it) => {
        const tabPageProps = it.pageProps
          ? _.cloneDeep(it.pageProps)
          : { showElevator: true, showSizer: true };
        map[it.name] =
          it.size === "small"
            ? _.assign(tabPageProps, { size: "small" })
            : tabPageProps;
        return map;
      }, {});
    }
  },

  mounted() {
    // 监听Domain事件
    if (this.domain) {
      App.event.$on(this.domain.events.Update, () =>
        setTimeout(this.load, 300)
      );
      App.event.$on(this.domain.events.Create, () =>
        setTimeout(this.load, 300)
      );
      App.event.$on(this.domain.events.Delete, () =>
        setTimeout(this.load, 300)
      );
    }
  },

  methods: {
    // 表格筛选查询条件变化
    onCriterias(criterias) {
      this.criterias = criterias;
    },

    onSelections(selections) {
      this.$emit("on-selected-rows", selections);
    },

    // 刷新数据
    load() {
      this.$refs.loader[0].load();
    }
  }
};
</script>