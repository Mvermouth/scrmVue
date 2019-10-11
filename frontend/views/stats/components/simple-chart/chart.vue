<style lang="less" scoped>
@media screen and (max-width: 768px) {
  .time-range {
    display: none;
  }
}
.extra {
  text-align: right;
  i {
    cursor: pointer;
    color: hsla(0, 0%, 0%, 0.45);
    font-size: 14px;
    margin-left: 6px;
  }
}
.data-chart {
  height: 250px;
  .error {
    display: flex;
    flex-direction: row;
    align-items: center;
    .image {
      height: 160px;
      background-image: url(../../../../images/404.svg);
      background-repeat: no-repeat;
      background-position: 100% 50%;
      background-size: contain;
      flex: 1;
    }
    p {
      flex: 1;
      height: 48px;
      line-height: 48px;
      text-align: left;
      font-size: 24px;
      font-weight: 600;
      padding-left: 20px;
      color: hsla(0, 0%, 0%, 0.45);
    }
  }
}
</style>
<template>
  <card :bordered="false" :dis-hover="true">
    <p slot="title" v-if="display.title">{{display.title}}</p>
    <div
      v-if="display.tip || display.enableRefresh !== false || display.customTimeRange"
      class="extra"
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
    <div class="data-chart">
      <div v-if="error" class="error">
        <div class="image"></div>
        <p>暂无数据</p>
      </div>
      <component
        v-else
        :is="chartComp"
        :data-sources="dataSources"
        :display="display"
        :values="values"
        :time-range="timeRange"
        :custom-display="customDisplay"
      ></component>
    </div>
  </card>
</template>
<script>
import _ from "lodash";
import TimeRange from "../../filters/time-range.vue";
import customDisplay from "../../utils/custom-display";
import Charts from "../../charts";

export default {
  components: {
    TimeRange
  },
  props: {
    type: {
      type: String,
      required: true
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
    error: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      chartComp: Charts[this.type.split("/")[1]],
      timeRange: null,
      customDisplay: {}
    };
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
      const display = customDisplay(
        this.display,
        timeRange.interval,
        timeRange.granularity
      );
      this.timeRange = timeRange;
      this.customDisplay = display;
      this.$emit("query-change", timeRange);
    }
  }
};
</script>

