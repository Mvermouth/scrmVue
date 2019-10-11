<style lang="less">
.data-item {
  .value-equal {
    display: inline-block;
    width: 8px;
    height: 2px;
    background: hsla(0, 0%, 0%, 0.85);
    position: relative;
    top: 9px;
  }
  .value-up {
    color: hsl(0, 90%, 62%);
    i {
      margin-right: 4px;
    }
  }
  .value-down {
    color: hsl(120, 82%, 33%);
    i {
      margin-right: 4px;
    }
  }
}
</style>
<style lang="less" scoped>
.data-item {
  height: 120px;
  display: flex;
  flex-direction: column;
  background-color: hsl(0, 0%, 100%);
  padding: 10px 24px 8px;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      color: hsla(0, 0%, 0%, 0.45);
      font-size: 14px;
      line-height: 22px;
    }
    .explain {
      i {
        cursor: pointer;
        color: hsla(0, 0%, 0%, 0.45);
        font-size: 14px;
        margin-left: 6px;
      }
    }
  }
  .value {
    flex-grow: 1;
    p {
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      font-size: 20px;
      color: hsla(0, 0%, 0%, 0.85);
      font-weight: 700;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
    }
  }
  .comparison {
    height: 20px;
    display: flex;
    align-items: center;
    p {
      font-size: 12px;
      .t {
        margin-right: 4px;
        color: hsla(0, 0%, 0%, 0.65);
      }
      .v {
        margin-right: 16px;
        color: hsla(0, 0%, 0%, 0.85);
      }
    }
  }
  .extra {
    margin-top: 4px;
    padding-top: 5px;
    border-top: 1px solid hsl(0, 0%, 91%);
    display: flex;
    align-items: center;
    p {
      font-size: 12px;
      .t {
        color: hsla(0, 0%, 0%, 0.65);
        margin-right: 4px;
      }
      .v {
        margin-right: 16px;
        color: hsla(0, 0%, 0%, 0.85);
      }
    }
  }
}
</style>
<template>
  <card :bordered="false" :dis-hover="true" :padding="0">
    <div class="data-item">
      <div class="title">
        <p>{{display.title}}</p>
        <div class="explain">
          <tooltip v-if="display.tip" transfer>
            <i class="ivu-icon ivu-icon-help-circled"></i>
            <div slot="content">{{display.tip}}</div>
          </tooltip>
          <i
            v-if="display.enableRefresh !== false"
            class="ivu-icon ivu-icon-refresh"
            @click="onRefresh"
          ></i>
        </div>
      </div>
      <div class="value">
        <p>
          <span v-if="error">暂无数据</span>
          <ICountUp v-else :startVal="prevValueDesc" :endVal="currValueDesc" :duration="1"/>
        </p>
      </div>
      <div class="comparison">
        <p v-for="comparison in comparisons" :key="'comparison-' + comparison.title">
          <span class="txt t">{{comparison.title}}</span>
          <span class="txt v" v-html="comparison.html"></span>
        </p>
      </div>
      <div v-if="conclusions.length > 0" class="extra">
        <p v-for="conclusion in conclusions" :key="'conclusion-' + conclusion.title">
          <span class="txt t">{{conclusion.title}}</span>
          <span class="txt v" v-html="conclusion.html"></span>
        </p>
      </div>
    </div>
  </card>
</template>
<script>
import _ from "lodash";
import ICountUp from "vue-countup-v2";
import format from "../../utils/format";

export default {
  size: "small",
  components: {
    ICountUp
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
    error: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      prevValue: 0,
      currValue: 0
    };
  },
  mounted() {
    this.$emit("refresh");
  },
  watch: {
    values(newValues, oldValues) {
      this.currValue = _.values(newValues[0])[0];
      this.prevValue = _.values(oldValues[0])[0];
    }
  },
  computed: {
    currValueDesc() {
      if (this.display.format) {
        return format(this.currValue, this.display.format);
      } else {
        return this.currValue;
      }
    },
    prevValueDesc() {
      if (this.display.format) {
        return format(this.prevValue, this.display.format);
      } else {
        return this.prevValue;
      }
    },
    comparisons() {
      return this.display.comparisons
        .map(it => this.calculate(it))
        .filter(it => !!it);
    },
    conclusions() {
      return (this.display.conclusions || [])
        .map(it => this.calculate(it))
        .filter(it => !!it);
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
    calculate(it) {
      const htmls = {
        value_equal: '<span class="value-equal">&nbsp;&nbsp;</span>',
        value_up:
          '<span class="value-up"><i class="ivu-icon ivu-icon-arrow-up-b"></i>%%</span>',
        value_down:
          '<span class="value-down"><i class="ivu-icon ivu-icon-arrow-down-b"></i>%%</span>'
      };
      const title = it.title;
      if (this.error) return { title, html: htmls.value_equal };
      if (this.values.length === 0) return { title, html: htmls.value_equal };
      switch (it.type) {
        case "value": {
          let value = _.values(this.values[it.valueRef])[0];
          if (it.format) value = format(value, it.format);
          return {
            title,
            html: value > 1 ? Math.round(value) : value
          };
        }
        case "avg": {
          let value = _.values(this.values[it.valueRef])[0] / it.divide;
          if (it.format) value = format(value, it.format);
          return {
            title,
            html: value > 1 ? Math.round(value) : value.toFixed(2)
          };
        }
        case "minus": {
          let value =
            _.values(this.values[it.valueRefs[0]])[0] -
            _.values(this.values[it.valueRefs[1]])[0];
          if (it.format) value = format(value, it.format);
          let html = "";
          if (value === 0) {
            html = htmls.value_equal;
          } else if (value > 0) {
            html = htmls.value_up.replace("%%", value);
          } else {
            html = htmls.value_down.replace("%%", value);
          }
          return { title, html };
        }
        default: {
          return null;
        }
      }
    }
  }
};
</script>