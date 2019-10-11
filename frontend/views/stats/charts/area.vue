<template>
  <div ref="chart" class="w100p h100p"></div>
</template>
<script>
import _ from "lodash";
import echarts from "echarts";
import "echarts/theme/shine";
import format from "../utils/format";
import customTitle from "../utils/custom-title";
import timeInterpolate from "../utils/time-interpolate";

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
      values = this.display.stackInterpolate
        ? this.stackInterpolate(values)
        : values;

      values = this.display.timeInterpolate
        ? this.timeInterpolate(values)
        : values;

      const dataSource = this.dataSources[0];
      const groupBy = _.last(dataSource.groupBy);
      const stackGroupBy = dataSource.groupBy[0];

      const keyField = _.keys(groupBy)[0];
      const valueField = _.keys(_.last(groupBy[keyField].aggregations))[0];
      const stackField =
        typeof stackGroupBy === "string"
          ? stackGroupBy
          : _.keys(stackGroupBy)[0];

      const legends = [];
      const xAxis = [];
      const series = [];

      const keyFormat = this.customDisplay.dimensionFormat[keyField];
      const valueFormat = this.display.format;
      const stackFormat = this.customDisplay.dimensionFormat[stackField];

      values[0].results.forEach(it =>
        xAxis.push(keyFormat ? format(it[keyField], keyFormat) : it[keyField])
      );
      values.forEach(it => {
        const stack = stackFormat
          ? format(it[stackField], stackFormat)
          : it[stackFiel];
        series.push(
          it.results.map(it =>
            valueFormat ? format(it[valueField], valueFormat) : it[valueField]
          )
        );
        legends.push(stack);
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
      chartOptions.legend.data = legends;
      chartOptions.xAxis[0].data = xAxis;
      chartOptions.series = legends.map((it, idx) => {
        const seriesData = _.cloneDeep(
          idx === legends.length - 1
            ? _.last(chartOptions.series)
            : chartOptions.series[0]
        );
        seriesData.name = legends[idx];
        seriesData.data = series[idx];
        return seriesData;
      });
      chartOptions.tooltip.formatter = series => {
        const rows = [];
        rows.push(`&nbsp;${series[0].name}&nbsp;`);
        series.forEach(it =>
          rows.push(`&nbsp;${it.marker}${it.seriesName}: ${it.value}&nbsp;`)
        );
        rows.push(`&nbsp;合计: ${_.sumBy(series, "value")}&nbsp;`);
        return rows.join("<br/>");
      };

      if (title) {
        chartOptions.title = chartOptions.title || {};
        chartOptions.title.text = title;
      }

      this.chartOptions = chartOptions;
    },

    timeInterpolate(values) {
      const dataSource = this.dataSources[0];
      const groupBy = _.last(dataSource.groupBy);

      const keyField = _.keys(groupBy)[0];
      const valueField = _.keys(_.last(groupBy[keyField].aggregations))[0];

      const interval = this.customDisplay.timeInterpolatePolicy.interval;
      const granularity = this.customDisplay.timeInterpolatePolicy.granularity;
      const timeseries = timeInterpolate(interval, granularity);

      return values.map(it => {
        const results = it.results;
        results.forEach(
          it => (it[keyField] = new Date(it[keyField]).getTime())
        );
        const resultMap = _.keyBy(results, keyField);

        it.results = timeseries.map(it => {
          return (
            resultMap[it.getTime()] || {
              [keyField]: it.getTime(),
              [valueField]: 0
            }
          );
        });
        return it;
      });
    },

    stackInterpolate(values) {
      const dataSource = this.dataSources[0];
      const groupBy = dataSource.groupBy[0];
      const keyField =
        typeof groupBy === "string" ? groupBy : _.keys(groupBy)[0];
      const valueMap = _.keyBy(values, keyField);

      const policy = this.display.stackInterpolatePolicy;
      switch (policy.type.toUpperCase()) {
        case "ARRAY": {
          return policy.value.map(
            it => valueMap[it] || { [keyField]: it, results: [] }
          );
        }
        default: {
          return values;
        }
      }
    }
  }
};
</script>

