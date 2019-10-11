<template>
  <div>
    <RadioGroup type="button" :size="size" v-model="granularity">
      <Radio v-for="it in granularities" :key="it.type" :label="it.type">{{it.title}}</Radio>
    </RadioGroup>
    <template v-if="granularity === 'hour'">
      <DatePicker
        v-model="timeRange"
        type="datetimerange"
        format="MM-dd HH:00"
        :size="size"
        :clearable="false"
        :options="datePickerOptions"
        style="width: 205px"
      ></DatePicker>
    </template>
    <template v-if="granularity === 'day'">
      <DatePicker
        v-model="timeRange"
        type="daterange"
        format="yyyy-MM-dd"
        :size="size"
        :clearable="false"
        :options="datePickerOptions"
        style="width: 205px"
      ></DatePicker>
    </template>
    <template v-if="granularity === 'month'">
      <DatePicker
        v-model="timeRange"
        type="daterange"
        format="yyyy-MM"
        :size="size"
        :clearable="false"
        :options="datePickerOptions"
        style="width: 205px"
      ></DatePicker>
    </template>
  </div>
</template>
<script>
export default {
  name: "time-range",
  props: {
    size: {
      type: String,
      required: false,
      default: "small"
    },
    /**
     * 初始默认时间范围
     */
    defaultTimeRange: {
      type: Object,
      required: false,
      default() {
        return {
          type: "hour",
          option: 24
        };
      }
    },
    /**
     * 时间范围配置
     */
    granularities: {
      type: Array,
      required: false,
      default() {
        return [
          {
            type: "hour",
            title: "小时",
            options: [
              { title: "8小时", value: 8 },
              { title: "12小时", value: 12 },
              { title: "24小时", value: 24 }
            ]
          },
          {
            type: "day",
            title: "天",
            options: [
              { title: "7天", value: 7 },
              { title: "15天", value: 15 },
              { title: "30天", value: 30 }
            ]
          },
          {
            type: "month",
            title: "月",
            options: [
              { title: "6个月", value: 6 },
              { title: "12个月", value: 12 },
              { title: "18个月", value: 18 }
            ]
          }
        ];
      }
    }
  },
  data() {
    let typeIdx = 0;
    let optionIdx = 0;
    if (this.defaultTimeRange) {
      const idx1 = this.granularities.findIndex(
        it => it.type === this.defaultTimeRange.type
      );
      if (idx1 >= 0) {
        const idx2 = this.granularities[idx1].options.findIndex(
          it => it.value === this.defaultTimeRange.option
        );
        if (idx2 >= 0) {
          typeIdx = idx1;
          optionIdx = idx2;
        }
      }
    }
    const granularity = this.granularities[typeIdx].type;
    const option = this.granularities[typeIdx].options[optionIdx].value;
    const timeRange = this.calcTimeRange(granularity, option);
    return {
      granularity,
      timeRange
    };
  },
  computed: {
    datePickerOptions() {
      const granularityConfig = this.granularities.find(
        it => it.type === this.granularity
      );
      return {
        shortcuts: granularityConfig.options.map(it => {
          return {
            text: it.title,
            value: () => {
              return this.calcTimeRange(this.granularity, it.value);
            }
          };
        })
      };
    }
  },
  watch: {
    granularity() {
      const granularityConfig = this.granularities.find(
        it => it.type === this.granularity
      );
      this.timeRange = this.calcTimeRange(
        this.granularity,
        granularityConfig.options[0].value
      );
    },
    timeRange() {
      this.onValue();
    }
  },
  mounted() {
    this.onValue();
  },
  methods: {
    calcTimeRange(granularity, value) {
      let start = null;
      let end = null;
      switch (granularity) {
        case "hour": {
          end = new Date();
          end.setMinutes(0);
          end.setSeconds(0);
          end.setMilliseconds(0);
          end.setHours(end.getHours() + 1);
          start = new Date(end.getTime());
          start.setHours(start.getHours() - value);
          start.setMinutes(0);
          start.setSeconds(0);
          start.setMilliseconds(0);
          break;
        }
        case "day": {
          end = new Date();
          end.setHours(0);
          end.setMinutes(0);
          end.setSeconds(0);
          end.setMilliseconds(0);
          end.setDate(end.getDate() + 1);
          start = new Date(end.getTime());
          start.setDate(start.getDate() - value);
          break;
        }
        case "month": {
          end = new Date();
          end.setDate(0);
          end.setHours(0);
          end.setMinutes(0);
          end.setSeconds(0);
          end.setMilliseconds(0);
          end.setMonth(end.getMonth() + 1);
          start = new Date(end.getTime());
          start.setMonth(start.getMonth() - value);
          break;
        }
      }
      return [start, end];
    },
    onValue() {
      const granularity = this.granularity;
      const start = this.timeRange[0].getTime();
      const end = this.timeRange[1].getTime();
      const interval = [start, end];
      this.$emit("value", { granularity, interval });
    }
  }
};
</script>
