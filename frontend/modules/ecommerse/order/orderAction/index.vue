<template>
    <div>
      <Tabs size="small">
        <TabPane v-for="(action, key) in actions" :key="key" :label="action.text" >
          <div :style="{padding: '7px'}">
            <priviledge-selector v-model='action.permission' ></priviledge-selector>
          </div>
        </TabPane>
      </Tabs>

      <div>
        <Button :loading='loading' @click="onClick">确定</Button>
        <Button :disabled='loading' type="text" @click="onReset" >重置</Button>
      </div>
    </div>
</template>

<script>
import _ from 'lodash'
import Constant from "../../../../configs/constant"
import Order from "../../../../models/ecommerse/order"
// import TabsPage from "../../../../views/domain/tabs-page.vue"
// import { findComponentDownward } from "../../../../scripts/utils/ui"

import PriviledgeSelector from '../../../auth/role/create/components/priviledge-selector.vue'

const orderActionOrig = App.data.domain;

export default {
  name: "OrderActionView",
  components: {
    PriviledgeSelector,
  },
  data() {
    return {
      actions: _.cloneDeep(orderActionOrig),
      model: [],
      loading: false,
    };
  },

  async created() {
  },

  methods: {
    async onClick() {
      if(this.loading){
        return;
      }

      this.loading = true;
      // console.log('onClick', this.actions);
      await Order.orderAction({actions: this.actions});
      this.loading = false;
    },
    onReset() {
    }
  }
};
</script>
