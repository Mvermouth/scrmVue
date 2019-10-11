<template>
    <div>
        <tabs-page v-bind="pageProps"></tabs-page>
        <export-order v-model="exportModal" :criterias="exportCriterias" :sort="exportSort"></export-order>
        <import-express v-model="importModal"></import-express>
    </div>
</template>

<script>
import Constant from "../../../../configs/constant"
import Order from "../../../../models/ecommerse/order"
import formItems from "../page/table/form-items"
import columns from "../page/table/columns"
import OrderList from "../page/order-list.vue"
import TabsPage from "../../../../views/domain/tabs-page.vue"
import ExportOrder from "../page/export-order.vue"
import ImportExpress from "../page/import-express.vue"
import { findComponentDownward } from "../../../../scripts/utils/ui"

const defaultSort = [
  {
    ignoreCase: false,
    property: "ctime",
    type: "DSC"
  }
];

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
                "OrderListView"
              );
              orderListView.exportOrder(criterias, defaultSort);
            }
          }
    }
const importAction= {
        importExpress: {
            title: "导入物流单",
            type: "info",
            unauthorize: true,
            onAction: function($list) {
              const orderListView = findComponentDownward(
                $list.$root,
                "OrderListView"
              );
              orderListView.importOrder();
            }
        }
}
// 动态获取订单类型
const createTabs = () => {
  const OrderStatus = Constant.OrderStatus;
  const keys = Object.keys(Constant.OrderStatus)
  const deletedfilter = {
            filterType: "EQ",
            property: "deleted",
            value: false
    }
  const tabs = keys.map(it => {
    const orderFilter = {
            filterType: "EQ",
            property: "orderStatus",
            value: OrderStatus[it].value
    }
    if(OrderStatus[it].value === 'refund'){
        orderFilter['filterType'] = 'IN'
        orderFilter['property'] = 'refundStatusList'
        orderFilter['value']= ['pending','refunding','unconfirmed','completed']
    }
    return {
      display: "custom",
      name: OrderStatus[it].value,
      label: OrderStatus[it].text,
      columns,
      defaultSort,
      defaultCriterias:[orderFilter,deletedfilter],
      actions: [
        "view",
        "create",
        exportAction,
        importAction
      ]
    };
  });
  // 追加所有显示所有订单列表的类型（all）
  tabs.unshift({
    display: "custom",
    name: "all",
    label: "全部",
    columns,
    defaultSort,
    actions: [
      "view",
      "create",
      exportAction
    ]
  });
  return tabs;
};
const tabs = createTabs()
const orderStatus = App.route.path.split("/")[App.route.path.split("/").length - 1];

export default {
  name: "OrderListView",
  components: {
    TabsPage,
    ExportOrder,
    ImportExpress
  },
  data() {
    return {
      exportModal: false,
      importModal:false,
      exportCriterias: [],
      exportSort: [],
      pageProps: {
        domain: Order,
        formItems,
        formProps: {
          labelWidth: 150
        },
        tabs,
        showTabs: false,
        defaultSelectTab: orderStatus,
        listComponent: OrderList
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
