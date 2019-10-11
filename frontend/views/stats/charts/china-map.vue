<template>
  <div ref="chart" class="w100p h100p"></div>
</template>
<script>
import _ from "lodash";
import echarts from "echarts";
import "echarts/theme/shine";
import "echarts/map/js/china";
import customTitle from "../utils/custom-title";
import format from "../utils/format";

const states = [
  "新疆",
  "西藏",
  "甘肃",
  "青海",
  "四川",
  "云南",
  "内蒙古",
  "宁夏",
  "陕西",
  "重庆",
  "贵州",
  "广西",
  "山西",
  "河南",
  "湖北",
  "湖南",
  "广东",
  "海南",
  "香港",
  "澳门",
  "台湾",
  "河北",
  "北京",
  "天津",
  "山东",
  "江苏",
  "上海",
  "安徽",
  "浙江",
  "江西",
  "福建",
  "黑龙江",
  "吉林",
  "辽宁"
];

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

      const nameFormat = this.customDisplay.dimensionFormat[keyField];
      const valueFormat = this.display.format;

      const seriesData = values
        .map(it => {
          const name = nameFormat
            ? format(it[keyField], nameFormat)
            : it[keyField];
          const value = valueFormat
            ? format(it[valueField], valueFormat)
            : it[valueField];
          // 过滤掉非法的地区
          return states.indexOf(name) >= 0 ? { name, value } : null;
        })
        .filter(it => !!it);

      // 补充没有数据的地区
      const dataMap = _.keyBy(seriesData, "name");
      states.forEach(it => {
        if (!dataMap[it]) seriesData.push({ name: it, value: 0 });
      });

      const min =
        seriesData.length > 0 ? _.minBy(seriesData, "value").value : 0;
      const max =
        seriesData.length > 0 ? _.maxBy(seriesData, "value").value : 0;

      let title;
      if (this.display.customChartTitle && this.timeRange) {
        title = customTitle(
          this.display.customChartTitle,
          this.timeRange.interval,
          this.timeRange.granularity
        );
      }

      const chartOptions = _.cloneDeep(this.display.chartOptions);
      chartOptions.visualMap.max = max;
      chartOptions.visualMap.min = min === max ? 0 : min;
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

