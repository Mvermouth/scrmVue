<style lang="less" scoped>
@media screen and (max-width: 768px) {
  .time-range {
    display: none;
  }
  .select-profiles {
    display: none;
  }
}
.extra {
  i {
    cursor: pointer;
    color: hsla(0, 0%, 0%, 0.45);
    font-size: 14px;
    margin-left: 6px;
  }
}
.data-table {
  height: 1000px;
  .select-profiles {
    display: flex;
    align-items: center;
  }
  .table {
    margin-top: 20px;
  }
  .page {
    margin-top: 20px;
    float: right;
  }
  .error {
  }
}
</style>
<template>
  <card :bordered="false" :dis-hover="true">
    <p slot="title" v-if="display.title">{{display.title}}</p>
    <div
      v-if="display.tip || display.enableRefresh !== false || display.customTimeRange"
      class="extra"
      slot="extra"
    >
      <time-range
        class="dpib time-range"
        ref="timeRange"
        v-if="display.customTimeRange"
        :default-time-range="display.defaultTimeRange"
        @value="onTimeRange"
      ></time-range>
      <tooltip v-if="display.tip" transfer>
        <i class="ivu-icon ivu-icon-help-circled"></i>
        <div class="data-item-explain-content" slot="content">{{display.tip}}</div>
      </tooltip>
      <i
        v-if="display.enableRefresh !== false"
        class="ivu-icon ivu-icon-refresh"
        @click="onRefresh"
      ></i>
    </div>
    <div class="data-table">
      <div class="select-profiles">
        <wx-profile-selector @value="onSelectProfiles"></wx-profile-selector>
        <i-button size="small" type="primary" @click="onQuery">查询</i-button>
        <i-button size="small" class="ml4" @click="onExport">导出</i-button>
      </div>
      <div v-if="error" class="error">
        <div class="image"></div>
        <p>暂无数据</p>
      </div>
      <i-table
        class="table"
        v-else
        size="small"
        stripe
        border
        :loading="loading"
        :columns="columns"
        :data="matrix.rows"
      ></i-table>
      <page
        class="page"
        size="small"
        :current="matrix.pageNo"
        :total="matrix.total"
        :page-size="matrix.pageSize"
        @on-change="onPageChange"
      ></page>
    </div>
  </card>
</template>
<script>
import _ from "lodash";
import TimeRange from "../../filters/time-range.vue";
import WxProfileSelector from "../../filters/wx-profile-selector.vue";

const widthStyles = App.options.styles.table.width;
const widthByGranularity = {
  hour: 142,
  day: 142,
  month: 142
};

export default {
  size: "large",
  components: {
    TimeRange,
    WxProfileSelector
  },
  props: {
    type: {
      type: String,
      required: false
    },
    dataSources: {
      type: Array,
      required: true
    },
    display: {
      type: Object,
      required: true
    },
    values: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      required: false
    },
    error: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      timeRange: null,
      profileSelection: null,
      pageNo: 1,
      pageSize: 10,
      sortBy: 0
    };
  },
  computed: {
    matrix() {
      return (
        this.values[0] || {
          fields: [],
          rows: [],
          pageNo: 1,
          pageSize: 10,
          total: 0
        }
      );
    },
    columns() {
      const dataColumns = (this.matrix.fields || []).map(it => {
        const col = _.cloneDeep(it);
        // 列宽
        col.width = widthByGranularity[this.timeRange.granularity];
        // 表头排序
        col.renderHeader = (h, { column, index }) => {
          return (
            <span>
              {column.title}
              <a
                style={{
                  color: `f_${this.sortBy}` === column.key ? "" : "inherit"
                }}
                onClick={() => this.toggleSortByColumn(column)}
              >
                <icon
                  style={{
                    height: "24px",
                    lineHeight: "24px",
                    padding: "0 10px"
                  }}
                  type="arrow-down-b"
                />
              </a>
            </span>
          );
        };
        return col;
      });
      const profileColumns = [
        {
          width: widthStyles.w_22,
          title: "运营号",
          render(h, context) {
            const row = context.row;
            return (
              <div class="tl">
                <div class="avatar-img padding10-0 dpib">
                  <im-avatar url={row.avatar} />
                </div>
                <im-account-ower-info-widget profile={row || {}} />
              </div>
            );
          }
        }
      ];
      return _.concat(profileColumns, dataColumns);
    }
  },
  methods: {
    onRefresh: _.debounce(
      function() {
        this.$emit("refresh");
      },
      300,
      { leading: true }
    ),
    onTimeRange(timeRange) {
      this.timeRange = timeRange;
      this.pageNo = 1;
      this.onQuery();
    },
    onSelectProfiles(selection) {
      this.profileSelection = selection;
      this.pageNo = 1;
    },
    onPageChange(pageNo) {
      this.pageNo = pageNo;
      this.onQuery();
    },
    onQuery: _.debounce(
      function() {
        const query = this.buildQuery();
        query.pageNo = this.pageNo;
        query.pageSize = this.pageSize;
        this.$emit("query-change", query);
      },
      300,
      { leading: true }
    ),
    onExport: _.debounce(
      function() {
        const query = this.buildQuery();
        this.$emit("export", query);
      },
      300,
      { leading: true }
    ),
    toggleSortByColumn: _.debounce(
      function(column) {
        const id = parseInt(column.key.split("_")[1]);
        if (id !== this.sortBy) {
          this.sortBy = id;
        } else {
          this.sortBy = 0;
        }
        this.onQuery();
      },
      300,
      { leading: true }
    ),
    buildQuery() {
      const query = {};
      if (this.timeRange) {
        query.interval = this.timeRange.interval;
        query.granularity = this.timeRange.granularity;
      }
      if (this.profileSelection) {
        query.profileSelection = this.profileSelection;
      }
      query.sortBy = this.sortBy;
      return query;
    }
  }
};
</script>
