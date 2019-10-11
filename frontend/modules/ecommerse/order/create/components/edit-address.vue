<template>
  <row>
    <i-col v-bind="layout">
      <i-form :model="form" :label-width="100" :rules="rules" ref="form">
        <form-item label="姓名" prop="consignee">
          <i-input v-model="form.consignee" placeholder="请输入姓名"></i-input>
        </form-item>
        <form-item label="手机号" prop="mobile">
          <i-input v-model="form.mobile" placeholder="请输入手机号"></i-input>
        </form-item>
        <form-item label="地区" prop="areas">
          <cascader :data="areaData" v-model="form.areas" placeholder="请选择地区"></cascader>
        </form-item>
        <form-item label="详细地址" prop="address">
          <i-input
            v-model="form.address"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 3}"
            placeholder="请输入详细地址"
          ></i-input>
        </form-item>
        <form-item label="邮编" prop="zipCode">
          <i-input v-model="form.zipCode" placeholder="请输入邮编"></i-input>
        </form-item>
        <form-item v-if="!!customerId" label="默认地址" prop="default">
          <i-switch v-model="form.default"></i-switch>
        </form-item>
      </i-form>
    </i-col>
  </row>
</template>
<script>
import _ from "lodash";
import areaData from "../../../../../configs/wxaddress.json";
import { isMobile } from "../../../../../scripts/utils/misc";
import Address from "../../../../../models/ecommerse/address";

export default {
  props: {
    // 客户
    customerId: {
      type: [Number, String],
      required: true
    },

    // 默认地址
    address: {
      type: Object,
      required: false,
      default() {
        return {};
      }
    }
  },

  data() {
    const form = _.assign(
      {
        consignee: "",
        mobile: "",
        state: "",
        city: "",
        district: "",
        address: "",
        zipCode: "",
        default: false
      },
      _.pick(this.address || {}, [
        "consignee",
        "mobile",
        "state",
        "city",
        "district",
        "address",
        "zipCode",
        "default"
      ])
    );

    if (form.state || form.city || form.district) {
      form.areas = [form.state, form.city, form.district];
    }

    return {
      // 地址数据配置
      areaData,

      // 地址表单
      form,

      // 校验规则
      rules: {
        consignee: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            validator(rule, value, callback) {
              if (isMobile(value)) {
                callback();
              } else {
                callback(new Error("手机号格式错误"));
              }
            }
          }
        ],
        areas: [
          {
            required: true,
            message: "省市区不能为空",
            trigger: "blur",
            type: "array"
          }
        ],
        address: [
          { required: true, message: "详细地址不能为空", trigger: "blur" }
        ]
      },

      // 布局
      layout: App.options.styles.form.layout
    };
  },

  methods: {
    async submit() {

      // 设置地址信息
      const form = this.getAddress();
      if(!form) {
        return;
      }

      // 提交保存
      if (form.id) {
        return await Address.update(form);
      } else {
        return await Address.create(form);
      }
    },

    async getAddress() {
      const result = await this.$refs.form.validate();
      if (!result) {
        return;
      }

      // 设置地址信息
      const form = _.cloneDeep(this.form);
      form.state = form.areas[0];
      form.city = form.areas[1];
      form.district = form.areas[2];
      delete form.areas;

      // 设置客户信息
      form.customerId = this.customerId;

      // 更新地址设置原地址id
      if (this.address) {
        form.id = this.address.id;
      }

      return form;
    }
  }
};
</script>


