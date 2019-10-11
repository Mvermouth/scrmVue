<template>
    <div>
        <domain-page v-bind="pageProps"></domain-page>
        <export-order v-model="exportModal" :criterias="exportCriterias" :sort="exportSort"></export-order>
    </div>
</template>

<script>
import Constant from "../../../../configs/constant"
import Customer from '../../../../models/ecommerse/customer'
import formItems from './table/form-items'
import columns from './table/columns'
import DomainPage from "../../../../views/domain/page.vue"
import ExportOrder from "./export-customer.vue"
import { findComponentDownward } from "../../../../scripts/utils/ui"

const defaultSort = [
  {
    ignoreCase: false,
    property: "ctime",
    type: "DSC"
  }
]
const defaultCriterias = [
	{
		property: 'deleted',
		filterType: 'EQ',
		value: false
	},
	{
		property: 'orderCount',
		filterType: 'GT',
		value: 0
	}
]
const exportAction = {
          export: {
            title: "批量导出",
            type: "info",
            unauthorize: true,
            onAction: function($list) {
              const form = findComponentDownward($list.$root, "ListForm");
              let criterias = form.criterias;
              const defaultCriterias = $list.defaultCriterias;
              const defaultSort = $list.defaultSort;
              criterias = _.concat(criterias, defaultCriterias);
              const orderListView = findComponentDownward(
                $list.$root,
                "CustomerListView"
              );
              orderListView.exportOrder(criterias, defaultSort);
            }
          }
    }
export default {
  name: "CustomerListView",
  components: {
    DomainPage,
    ExportOrder
  },
  data() {
    return {
      exportModal: false,
      exportCriterias: [],
      exportSort: [],
      pageProps: {
        	formItems,
          columns,
          domain: Customer,
          defaultCriterias,
          actions: ['view', 'create',exportAction]
      }
    };
  },
  methods: {
    exportOrder(criterias, sort) {
      this.exportCriterias = criterias
      this.exportSort = sort
      this.exportModal = true
    },
    importOrder(criterias, sort) {
      this.importModal = true
    }
  }
};
</script>
