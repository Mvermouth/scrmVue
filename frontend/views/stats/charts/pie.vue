<template>
  <div ref="chart" class="w100p h100p"></div>
</template>
<script>
import echarts from "echarts";
import "echarts/theme/shine";
import _ from "lodash";
import customTitle from "../utils/custom-title";
import format from "../utils/format";

export default {
  props: {
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
    timeRange: {
      type: Object,
      required: false
    },
    customDisplay: {
      type: Object,
      required: false,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      chart: null,
      chartOptions: null
    };
  },
  watch: {
    values() {
      this.buildChartData(this.values[0] || []);
    },
    chartOptions() {
      if (this.chartOptions) {
        this.$nextTick(() => {
          const chart = echarts.init(this.$refs.chart, "shine");
          chart.setOption(this.chartOptions);
          this.chart = chart;
        });
      } else {
        this.chart && this.chart.dispose();
        this.chart = null;
      }
    }
  },
  methods: {
    buildChartData(values) {
      const dataSource = this.dataSources[0];
      const aggregation = dataSource.aggregations[0];
      const groupBy = dataSource.groupBy;

      const keyField =
        typeof groupBy === "string" ? groupBy : _.keys(groupBy)[0];
      const valueField = _.keys(aggregation)[0];

      const legendData = [];
      const seriesData = [];
      const selected = {};

      const nameFormat = this.customDisplay.dimensionFormat[keyField];
      const valueFormat = this.display.format;

      values.forEach((it, idx) => {
        const name = nameFormat
          ? format(it[keyField], nameFormat)
          : it[keyField];

        const value = valueFormat
          ? format(it[valueField], valueFormat)
          : it[valueField];

        legendData.push(name);
        seriesData.push({ name, value });
        selected[name] = idx < (this.display.initSelectedCount || 8);
      });

      let title;
      if (this.display.customChartTitle && this.timeRange) {
        title = customTitle(
          this.display.customChartTitle,
          this.timeRange.interval,
          this.timeRange.granularity
        );
      }

      const chartOptions = _.cloneDeep(this.display.chartOptions);
      chartOptions.legend.data = legendData;
      chartOptions.legend.selected = selected;
      chartOptions.series[0].data = seriesData;
      if (title) {
        chartOptions.title = chartOptions.title || {};
        chartOptions.title.text = title;
      }
      this.chartOptions = chartOptions;
    }
  }
};
</script>

