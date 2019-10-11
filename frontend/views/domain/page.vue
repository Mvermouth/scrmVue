<template>
  <div>
    <list-form
      v-if="formItems && formItems.length > 0"
      :class="size === 'small' ? 'mb1f' : 'mb2f'"
      :form-items="formItems"
      :size="size"
      v-bind="formProps"
      @on-criterias="onCriterias"
    ></list-form>

    <div :class="`${clsPrefix}list-page-container`">
      <list-page-loader
        ref="list"
        :load-page="loadListPage"
        :id-key="idKey"
        :default-sort="defaultSort"
        :default-page-no="defaultPageNo"
        :default-page-size="defaultPageSize"
        :default-criterias="defaultCriterias"
        :list-criterias="criterias"
        :transform-criterias="transformCriterias"
        @on-selections="onSelections"
      >
        <template slot-scope="{ listDataSource, listDelegator }">
          <row class="row">
            <i-col span="12">
              <list-actions
                :list-data-source="listDataSource"
                :list-delegator="listDelegator"
                :actions="listActions"
                :size="size"
              ></list-actions>
            </i-col>
          </row>

          <row class="row">
            <i-col span="24">
              <list-paginator
                :list-data-source="listDataSource"
                :list-delegator="listDelegator"
                :props="listPageProps"
              >
                <list-selections-desc
                  :list-data-source="listDataSource"
                  :list-delegator="listDelegator"
                ></list-selections-desc>
              </list-paginator>
            </i-col>
          </row>

          <row class="row">
            <i-col span="24">
              <list-grid-view
                v-if="currentDisplay === 'grid'"
                :list-data-source="listDataSource"
                :list-delegator="listDelegator"
                :render-grid="renderGrid"
                :props="gridProps"
                :selection="selection"
                :cls-prefix="clsPrefix"
              ></list-grid-view>
              <list-table-view
                v-if="currentDisplay === 'table'"
                :list-data-source="listDataSource"
                :list-delegator="listDelegator"
                :columns="columns"
                :props="tableProps"
                :selection="selection"
              ></list-table-view>
              <list-container
                v-if="currentDisplay === 'custom'"
                :list-component="listComponent"
                :list-item-component="listItemComponent"
                :list-data-source="listDataSource"
                :list-delegator="listDelegator"
                :selection="selection"
                :cls-prefix="clsPrefix"
              ></list-container>
            </i-col>
          </row>

          <row class="row">
            <i-col span="24">
              <list-paginator
                :list-data-source="listDataSource"
                :list-delegator="listDelegator"
                :props="listPageProps"
              >
                <list-selections-desc
                  :list-data-source="listDataSource"
                  :list-delegator="listDelegator"
                ></list-selections-desc>
              </list-paginator>
            </i-col>
          </row>
        </template>
      </list-page-loader>
    </div>
  </div>
</template>
<script>
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

    // 列表展示方式: table|grid|auto
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

    /**
     * 开启列表选择
     *
     * 可选值
     *      true        多选
     *      checkbox    多选
     *      radio       单选
     */
    selection: {
      type: [Boolean, String],
      required: false,
      default: false
    },

    // 默认筛选规则
    defaultCriterias: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    },

    // 默认页码
    defaultPageNo: {
      type: Number,
      required: false,
      default: 1
    },

    // 默认翻页大小
    defaultPageSize: {
      type: Number,
      required: false,
      default: 20
    },

    // 默认排序
    defaultSort: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    },

    // 用户自定义设置筛选条件
    transformCriterias: {
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
     * 列表操作配置
     *
     * 预定义的操作配置
     *  {type: '预定义操作类型', onAction: () => {} }
     *
     * 自定义的操作配置: 参考 list-actions
     *
     * 附加参数:
     *  unauthorize:        是否跳过action的权限校验
     */
    actions: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    },

    // 列表的卡片渲染
    renderGrid: {
      type: Function,
      required: false
    },

    // 列表的配置
    gridProps: {
      type: Object,
      required: false,
      default() {
        return {};
      }
    },

    // 列表的表格列配置
    columns: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    },

    // 列表的参数，透传给 list-container
    tableProps: {
      type: Object,
      required: false,
      default() {
        return {};
      }
    },

    // 翻页配置
    pageProps: {
      type: Object,
      required: false,
      default() {
        return {
          showElevator: true,
          showSizer: true
        };
      }
    }
  },
  data() {
    return {
      // 当前列表展示方式
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
      return this.loadPage ? this.loadPage : this.domain.page.bind(this.domain);
    },

    idKey() {
      return (
        this.defaultIdKey || (this.domain && this.domain.primaryKey) || "id"
      );
    },

    // 列表的操作
    listActions() {
      return this.actions
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
    },

    listPageProps() {
      return this.size === "small"
        ? _.assign(_.cloneDeep(this.pageProps), { size: "small" })
        : this.pageProps;
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
      this.$refs.list.load();
    }
  }
};
</script>
