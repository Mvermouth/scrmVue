<style lang="less" scoped>
.total-content-green {
  background: linear-gradient(
    to left top,
    hsl(165, 84%, 51%),
    hsl(170, 82%, 57%),
    hsl(175, 79%, 63%),
    hsl(182, 81%, 67%),
    hsl(186, 89%, 72%)
  );
}
.total-content-yellow {
  background: linear-gradient(
    to left top,
    hsl(16, 100%, 73%),
    hsl(22, 100%, 75%),
    hsl(27, 100%, 76%),
    hsl(36, 98%, 78%),
    hsl(43, 96%, 79%)
  );
}
.total-content-purple {
  background: linear-gradient(
    to left top,
    hsl(243, 95%, 78%),
    hsl(247, 94%, 80%),
    hsl(256, 93%, 83%),
    hsl(263, 92%, 85%),
    hsl(267, 92%, 86%)
  );
}
.total-content-pink {
  background: linear-gradient(
    to left top,
    hsl(337, 100%, 72%),
    hsl(335, 100%, 74%),
    hsl(330, 97%, 77%),
    hsl(324, 96%, 80%),
    hsl(319, 93%, 82%)
  );
}
.total-content {
  height: 120px;
  border-radius: 5px;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  .title {
    height: 50px;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      line-height: 50px;
      color: hsl(0, 0%, 100%);
      font-size: 14px;
      opacity: 0.9;
    }
    .explain {
      i {
        cursor: pointer;
        color: hsl(0, 0%, 100%);
        font-size: 14px;
        opacity: 0.9;
        margin-left: 6px;
      }
    }
    .border {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 2px;
      background: hsl(0, 0%, 100%);
      opacity: 0.6;
    }
  }
  .value {
    flex-grow: 1;
    p {
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      color: hsl(0, 0%, 100%);
      font-size: 30px;
    }
  }
}
</style>
<template>
  <card :bordered="false" :padding="0" :dis-hover="true">
    <div :class="`total-content total-content-${display.theme || 'green'}`">
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
        <div class="border"></div>
      </div>
      <div class="value">
        <p>
          <span v-if="error">暂无数据</span>
          <ICountUp v-else :startVal="prevValueDesc" :endVal="currValueDesc" :duration="1"/>
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
    }
  },
  methods: {
    onRefresh: _.debounce(
      function() {
        this.$emit("refresh");
      },
      300,
      { leading: true }
    )
  }
};
</script>

