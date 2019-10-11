<style lang="less">
.wx-profile-selector {
  .ivu-form-item {
    margin-bottom: 0;
  }
  .ivu-select-multiple .ivu-select-input {
    height: 22px;
  }
  .ivu-select-small.ivu-select-multiple .ivu-tag {
    font-size: 12px;
    line-height: 14px;
    height: 18px;
  }
  .ivu-tag .ivu-icon-ios-close-empty {
    font-size: 14px;
  }
}
</style>
<style lang="less" scoped>
.filter {
  width: 90px;
}
.input {
  min-width: 270px;
}
.cascader {
  display: inline-block;
  vertical-align: middle;
}
</style>
<template>
  <i-form inline :model="selection" class="wx-profile-selector">
    <form-item prop="type" label="选择运营号" :label-width="90">
      <i-select size="small" class="filter" v-model="selection.type">
        <i-option value="department">按部门</i-option>
        <i-option value="employee">按员工</i-option>
        <i-option value="profile">按运营号</i-option>
      </i-select>
    </form-item>
    <form-item v-if="selection.type === 'profile'" prop="value" :label-width="1">
      <i-input class="input" size="small" v-model="selection.value" placeholder="请输入运营号，多个运营号以空格分开"></i-input>
    </form-item>
    <form-item v-else-if="selection.type === 'department'" prop="values" :label-width="1">
      <cascader
        v-model="selection.values"
        class="input cascader"
        size="small"
        :data="data.department"
        filterable
        change-on-select
        placeholder="请选择部门"
      ></cascader>
    </form-item>
    <form-item v-else-if="selection.type === 'employee'" prop="values" :label-width="1">
      <i-select
        v-model="selection.values"
        class="input"
        size="small"
        filterable
        clearable
        remote
        multiple
        :remote-method="loadEmployeeData"
        :loading="loading"
      >
        <i-option v-for="it in data.employee" :value="it.value" :key="it.value">{{ it.label }}</i-option>
      </i-select>
    </form-item>
  </i-form>
</template>
<script>
import _ from "lodash";
import Department from "../../../models/erp/department";
import Employee from "../../../models/erp/employee";
export default {
  name: "WxProfileSelector",
  data() {
    return {
      selection: {
        type: "profile",
        value: "",
        values: []
      },
      data: {
        department: [],
        employee: []
      },
      loading: false
    };
  },
  watch: {
    "selection.type": function() {
      this.selection.value = "";
      this.selection.values = [];
      this.data.employee = [];
      this.loadData();
    },
    "selection.value": function() {
      this.onValueChange();
    },
    "selection.values": function() {
      this.onValueChange();
    }
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      if (this.selection.type === "department") {
        await this.loadDepartmentData();
      }
    },
    async loadEmployeeData(value) {
      if (!value) return [];
      this.loading = true;
      const filter1 = [{ filterType: "LIKE", property: "sn", value }];
      const result1 = await Employee.search(1, 20, filter1, [], true);
      const filter2 = [{ filterType: "LIKE", property: "name", value }];
      const result2 = await Employee.search(1, 20, filter2, [], true);
      const result = _.unionWith(result1.content, result2.content, _.isEqual);
      this.data.employee = result.map(it => {
        return { value: it.id, label: `${it.sn}(${it.name})` };
      });
      this.loading = false;
    },
    async loadDepartmentData() {
      if (!_.isEmpty(this.data.department)) {
        return;
      }
      const transform = list => {
        if (_.isEmpty(list)) {
          return [];
        }
        return list.map(it => {
          const v = {};
          v.value = it.id;
          v.label = it.name;
          v.children = transform(it.children);
          return v;
        });
      };
      const result = await Department.expand();
      this.data.department = transform(result);
    },
    onValueChange() {
      let value;
      if (this.selection.type === "profile") {
        value = this.selection.value.split(" ").filter(it => !!it);
      } else if (this.selection.type === "employee") {
        value = this.selection.values;
      } else if (this.selection.type === "department") {
        value = _.last(this.selection.values);
      }
      if (_.isEmpty(value)) {
        this.$emit("value", null);
      } else {
        this.$emit("value", { type: this.selection.type, value });
      }
    }
  }
};
</script>

