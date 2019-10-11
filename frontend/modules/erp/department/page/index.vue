<template>
  <row :gutter="16">
    <i-col :xs="8" :sm="6" :md="7" :lg="7">
      <department-tree v-model="value"></department-tree>
    </i-col>
    <i-col :xs="16" :sm="18" :md="17" :lg="17">
      <card>
        <domain-page
          :formItems="formItems"
          :columns="columns"
          :domain="domain"
          :actions="actions"
          :default-criterias="defaultCriterias"
        ></domain-page>
      </card>
    </i-col>
  </row>
</template>
<script>
import AppRoutes from "../../../../configs/AppRoutes";
import Department from "../../../../models/erp/department";
import formItems from "./table/form-items";
import columns from "./table/columns";
import DomainPage from "../../../../views/domain/page.vue";
import DepartmentTree from "./components/department-tree.vue";
export default {
  components: {
    "domain-page": DomainPage,
    "department-tree": DepartmentTree
  },
  data() {
    return {
      value: {},
      id: 0,
      formItems: [],
      columns: columns,
      domain: Department,
      defaultCriterias: [
        {
          filterType: "EQ",
          property: "deleted",
          value: false
        }
      ],
      actions: [
        "view",
        {
          create: {
            onAction: () => {
              App.push(AppRoutes.Department.create());
            }
          }
        },
        "update"
      ]
    };
  },
  watch: {
    value(value) {
      if (value.id) {
        this.id = this.value.id;
      } else {
        this.id = 0;
      }
    }
  },
  mounted() {
    this.getFormItems();
  },
  methods: {
    async getFormItems() {
      this.formItems = await formItems();
    }
  }
};
</script>

