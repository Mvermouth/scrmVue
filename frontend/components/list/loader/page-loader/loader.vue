<template>
    <div>
        <slot :list-data-source="listDataSource" :list-delegator="listDelegator"></slot>
    </div>
</template>

<script>
import _ from "lodash";

/**
 * 列表数据管理
 */
export default {
  props: {
    // 加载数据方法 async (pageNo, pageSize, filter, sort) => { ... }
    loadPage: {
      type: Function,
      required: true
    },

    // 数据的唯一标识字段
    idKey: {
      type: String,
      required: true
    },

    // 默认筛选条件
    defaultCriterias: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    },

    // 动态的列表筛选条件
    listCriterias: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    },

    // 筛选条件自定义转换
    transformCriterias: {
      type: Function,
      required: false
    },

    // 排序规则
    defaultSort: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    },

    // 初始页码
    defaultPageNo: {
      type: Number,
      required: false,
      default: 1
    },

    // 初始翻页大小
    defaultPageSize: {
      type: Number,
      required: false,
      default: 20
    }
  },

  data() {
    return {
      // 列表选项
      options: {},

      // 列表筛选条件
      criterias: [],

      // 数据加载中
      loading: false,

      // 查询结果
      result: {
        pageNo: this.defaultPageNo,
        pageSize: this.defaultPageSize,
        total: 0,
        content: []
      },

      // 查询条件
      query: {
        filter: this.transformCriterias
          ? this.transformCriterias(
              this.defaultCriterias,
              this.listCriterias,
              []
            )
          : this.defaultCriterias.concat(this.listCriterias),
        sort: this.defaultSort,
        pageNo: this.defaultPageNo,
        pageSize: this.defaultPageSize
      },

      // 选择项
      selections: []
    };
  },
  computed: {
    // 列表数据源
    listDataSource() {
      return {
        target: this,
        options: this.options,
        idKey: this.idKey,
        query: this.query,
        result: this.result,
        loading: this.loading,
        selections: this.selections
      };
    },

    // 列表事件代理
    listDelegator() {
      return {
        setOption: this.setOption.bind(this),
        load: this.load.bind(this),
        select: this.select.bind(this),
        deselect: this.deselect.bind(this),
        selectAll: this.selectAll.bind(this),
        deselectAll: this.deselectAll.bind(this),
        onPageNoChange: pageNo => (this.query.pageNo = pageNo),
        onPageSizeChange: pageSize => (this.query.pageSize = pageSize),
        onSortChange: sort => (this.query.sort = sort),
        onCriteriasChange: criterias => (this.criterias = criterias)
      };
    },

    contentMap() {
      return _.keyBy(this.result.content, this.idKey);
    },

    selectionMap() {
      return _.keyBy(this.selections, this.idKey);
    }
  },
  watch: {
    defaultCriterias() {
      this.query.pageNo = 1;
      this.query.filter = this.transformCriterias
        ? this.transformCriterias(
            this.defaultCriterias,
            this.listCriterias,
            this.criterias
          )
        : this.defaultCriterias.concat(this.listCriterias, this.criterias);
    },

    listCriterias() {
      this.query.pageNo = 1;
      this.query.filter = this.transformCriterias
        ? this.transformCriterias(
            this.defaultCriterias,
            this.listCriterias,
            this.criterias
          )
        : this.defaultCriterias.concat(this.listCriterias, this.criterias);
    },

    criterias() {
      this.query.filter = this.transformCriterias
        ? this.transformCriterias(
            this.defaultCriterias,
            this.listCriterias,
            this.criterias
          )
        : this.defaultCriterias.concat(this.listCriterias, this.criterias);
    },

    defaultSort() {
      this.query.sort = this.defaultSort;
    },

    defaultPageNo() {
      this.query.pageNo = this.defaultPageNo;
    },

    defaultPageSize() {
      this.query.pageSize = this.defaultPageSize;
    },

    // 查询条件变化，重新查询数据
    query: {
      deep: true,
      handler: function() {
        this.load();
      }
    },

    // 选择项变化
    selections() {
      this.$emit("on-selections", _.cloneDeep(this.selections));
    }
  },

  mounted() {
    // 初始加载数据
    this.load();
  },

  methods: {
    /**
     * 追加数据到头部
     */
    prepend(item) {
      this.result.content.unshift(item);
    },

    /**
     * 追加数据到尾部
     */
    append(item) {
      this.result.content.push(item);
    },

    /**
     * 替换数据
     */
    replace(filter, item) {
      const idx = this.result.content.findIndex(filter);
      if (idx >= 0) {
        this.result.content.splice(idx, 1, item);
      }
    },

    /**
     * 选择数据
     */
    select(key) {
      if (!this.selectionMap[key]) this.selections.push(this.contentMap[key]);
    },

    /**
     * 选择所有
     */
    selectAll() {
      this.result.content.forEach(it => {
        const key = it[this.idKey];
        if (!this.selectionMap[key]) this.selections.push(this.contentMap[key]);
      });
    },

    /**
     * 取消选择数据
     */
    deselect(key) {
      if (!Array.isArray(key)) key = [key];
      key.forEach(it => {
        if (this.selectionMap[it]) {
          this.selections.splice(
            this.selections.findIndex(it2 => it2[this.idKey] === it),
            1
          );
        }
      });
    },

    /**
     * 取消所有选择
     */
    deselectAll() {
      this.selections = [];
    },

    /**
     * 设置列表选项
     */
    setOption(key, val) {
      this.options[key] = val;
    },

    /**
     * 加载数据
     */
    async load() {
      try {
        // 为了允许loadPage定制query，需要传值而非引用
        const query = _.cloneDeep(this.query);

        this.loading = true;
        this.result = await this.loadPage(
          query.pageNo,
          query.pageSize,
          query.filter,
          query.sort
        );
        this.result.content = this.result.content || [];
        this.loading = false;
      } catch (e) {
        console.error("loader load error: ", e);
        this.loading = false;
      }
    }
  }
};
</script>

