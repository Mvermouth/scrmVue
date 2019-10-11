<template>
  <div v-resize="onResize" ref="formWrap" v-if="visible">
    <i-form :label-width="labelWidth">
      <row :gutter="gutter">
        <i-col
          v-for="(formItem, idx) in formItems"
          :key="`formItem-${idx}`"
          v-show="idx < expandCount"
          :span="colSpan"
        >
          <form-item :label="formItem.label" :class="size === 'small' ? 'mb0_5f' : ''">
            <render-form-item :render="formItem.render" v-model="model[formItem.property]"/>
          </form-item>
        </i-col>
        <i-col class="tr" :span="colSpan" :offset="btnColOffset">
          <i-button type="primary" @click="onConfirmCriterias" :size="size">查询</i-button>
          <i-button type="ghost" @click="onResetCriterias" :size="size">重置</i-button>
          <i-button v-if="expandable" type="text" @click="onExpand" :size="size">
            {{ expanded ? '收起' : '展开' }}&nbsp;&nbsp;
            <icon :type="expanded ? 'chevron-up' : 'chevron-down'" color="#1890ff"></icon>
          </i-button>
        </i-col>
      </row>
    </i-form>
  </div>
</template>
<script>
import _ from "lodash";
import RenderFormItem from "../../render-form-item";

export default {
  name: "ListForm",

  components: {
    RenderFormItem
  },

  props: {
    /**
     * 表单条目列表
     * 表单条目结构:
     *  {
     *      // 必须 查询条件字段
     *      property: 'name',
     *
     *      // 必须 查询条件类型 eq/gt/gte/lt/lte/like/in
     *      // 也可以自定函数 (formItem, value) => { return {...} }
     *      filter: 'EQ'
     *
     *      // 必须 表单条目的标题
     *      label: '姓名',
     *
     *      // 可选 表单默认值，如果表单值是 Object/Array，必须要设置
     *      default: '',
     *
     *      // 必须 表单条目的渲染，注意必须绑定 v-model 到 this.model 来传递表单值
     *      render: h => { return (<i-input v-model={this.model} placeholder="请输入"/>) }
     *  }
     */
    formItems: {
      type: Array,
      required: true
    },

    // 表单条目的间隔
    gutter: {
      type: Number,
      required: false,
      default: 16
    },

    // 表单条目的标题宽度
    labelWidth: {
      type: Number,
      required: false,
      default: 80
    },

    // 布局配置，参考iview Grid
    layoutOptions: {
      type: Object,
      required: false,
      default() {
        return {
          xs: 1,
          sm: 2,
          md: 3,
          lg: 4
        };
      }
    },

    // 固定展开的行数
    expandRow: {
      type: Number,
      required: false,
      default: 2
    },

    /**
     * 尺寸规格 large|small|default
     */
    size: {
      type: String,
      required: false,
      default: ""
    },

    /**
     * 初始如果列表是display:none不显示，需要显式通过visible控制，才能正确触发缩放处理
     */
    visible: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  data() {
    // 生成form-item的双向绑定对象，来存储表单的value
    const model = {};
    this.formItems.forEach(it => {
      model[it.property] =
        it.default === undefined ? "" : _.cloneDeep(it.default);
    });

    return {
      // 当前的布局配置
      currentLayout: "",

      // 是否展开
      expanded: false,

      // 用于表单数据双向绑定
      model,

      // 默认的表单值
      defaultModel: _.cloneDeep(model),

      // 生成的查询条件
      criterias: []
    };
  },

  mounted() {
    if (this.visible) {
      /**
       * 需要在Dom Update之后，才能拿到最终的宽度
       * $nextTick是调度进microTask，只处理virtual dom，实际Dom并没有更新
       * 因此需要通过setTimeout调度到下一个macro task执行
       */
      setTimeout(() => this.onResize(), 0);
    }
  },

  computed: {
    // 表单项列布局
    colSpan() {
      if (!this.currentLayout) return 0;
      return Math.floor(24 / this.layoutOptions[this.currentLayout]);
    },

    // 操作列布局
    btnColOffset() {
      if (!this.currentLayout) return 0;
      return (
        (this.layoutOptions[this.currentLayout] -
          (this.expandCount % this.layoutOptions[this.currentLayout]) -
          1) *
        this.colSpan
      );
    },

    // 展开的表单项数量
    expandCount() {
      // 还没有计算布局
      if (!this.currentLayout) return 0;

      // 全部展开
      if (!this.expandable || this.expanded) return this.formItems.length;

      // 折叠时留一列放展开操作按钮
      return Math.min(
        this.layoutOptions[this.currentLayout] * this.expandRow - 1,
        this.formItems.length
      );
    },

    // 是否可以展开关闭
    expandable() {
      if (!this.currentLayout) return false;
      return (
        this.formItems.length >
        this.layoutOptions[this.currentLayout] * this.expandRow
      );
    }
  },

  watch: {
    // 表单值变化，更新查询条件
    model: {
      deep: true,
      handler: function() {
        this.updateCriterias();
      }
    },

    // 通知查询条件变化
    criterias() {
      this.$emit("on-update-criterias", this.criterias);
    },

    visible() {
      // on-resize在display:none时监听不生效，因此无法通过v-show来控制显示，而需要v-if=visible重新创建dom来使监听生效
      if (this.visible) {
        /**
         * 需要在Dom Update之后，才能拿到最终的宽度
         * $nextTick是调度进microTask，只处理virtual dom，实际Dom并没有更新
         * 因此需要通过setTimeout调度到下一个macro task执行
         */
        setTimeout(() => this.onResize(), 0);
      }
    }
  },

  methods: {
    // 展开/关闭切换
    onExpand() {
      this.expanded = !this.expanded;
    },

    // 确认查询条件，进行查询
    onConfirmCriterias() {
      this.$emit("on-confirm-criterias", this.criterias);
      this.$emit("on-criterias", this.criterias);
    },

    // 重置查询条件
    onResetCriterias() {
      this.model = _.cloneDeep(this.defaultModel);
      this.$nextTick(() => {
        this.$emit("on-reset-criterias", this.criterias);
        this.$emit("on-criterias", this.criterias);
      });
    },

    // 设置最新的查询条件
    updateCriterias() {
      const criterias = [];
      this.formItems.forEach(it => {
        const property = it.property;
        const value = this.model[property];
        if (!value || _.isEqual(value, it.default)) {
          return;
        }

        if (typeof it.filter === "string") {
          const filterType = it.filter; //.toUpperCase();
          criterias.push({ property, filterType, value });
          return;
        }

        if (typeof it.filter === "function") {
          let results = it.filter(it, value);
          results = Array.isArray(results) ? results : [results];
          criterias.push(...results);
        }
      });
      this.criterias = criterias;
    },

    // 宽度变化，选择对应布局
    onResize() {
      const w = this.$refs.formWrap.clientWidth;
      if (w < 640) this.currentLayout = "xs";
      else if (w < 992) this.currentLayout = "sm";
      else if (w < 1200) this.currentLayout = "md";
      else this.currentLayout = "lg";
    }
  }
};
</script>
