<template>
    <div>
        <domain-page v-bind="pageProps"></domain-page>
        <add-shop v-model="bindModal"></add-shop>
    </div>
</template>

<script>
import Constant from "../../../../configs/constant"
import Shop from "../../../../models/ecommerse/shop"
import formItems from "./table/form-items"
import columns from "./table/columns"
import DomainPage from "../../../../views/domain/page.vue"
import AddShop from "./add-shop.vue"
import { findComponentDownward } from "../../../../scripts/utils/ui"

const bindShopAction= {
        bindShop: {
            title: "绑定店铺",
            type: "info",
            unauthorize: true,
            onAction: function($list) {
              const shopListView = findComponentDownward(
                $list.$root,
                "ShopListView"
              );
              shopListView.doAddShop();
            }
        }
}

export default {
  name: "ShopListView",
  components: {
    DomainPage,
    AddShop
  },
  data() {
    return {
      bindModal:false,
      pageProps: {
        domain: Shop,
        columns,
        formItems,
        formProps: {
          labelWidth: 150
        },
        actions:['view',bindShopAction]
      }
    };
  },
  methods: {
    doAddShop(criterias, sort) {
      this.bindModal = true
    }
  }
};
</script>
