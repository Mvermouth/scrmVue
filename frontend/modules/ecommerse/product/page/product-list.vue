<style lang="less" scoped>
.cpc-item-list {
  border: 1px solid #e6e6e6;
  margin-top: -1px;
  border-top-color: #fff;
  padding: 20px 24px;
  min-height: 422px;
}
.cpc-item-list-title {
  background-color: #fafafa;
  overflow: hidden;
  height: 45px;

  div {
    float: left;
    line-height: 45px;
    width: 10%;
    position: relative;
    text-align: center;
    font-size: 14px;
  }
}
</style>
<template>
  <div class="cpc-item-list">
    <!--div v-show="items.length == 0" class="cpc-item-empty-tip">
      		<img src="https://img.geilicdn.com/public_no_1466063273756.jpg?w=106&amp;h=75">
      		<div class="tip-text">暂无商品</div>
    </div-->
    <div v-show="items.length > 0">
      <div class="cpc-item-list-title">
        <div style="width:5%;text-align: left; padding-left:8px">
          <Checkbox v-model="selectAll"/>
        </div>
        <div style="width:35%;">商品描述</div>
        <div>价格</div>
        <div>销量</div>
        <div>库存</div>
        <div>分类</div>
        <div>创建时间</div>
        <!-- ngIf: ! ctrl.itemDisableEdit -->
        <div ng-if="! ctrl.itemDisableEdit" class="ng-scope">操作</div>
        <!-- end ngIf: ! ctrl.itemDisableEdit -->
      </div>
    </div>

    <ProductListItem
      v-for="item in itemsEx"
      :key="item[idKey]"
      :product="item"
      @change="(val) => handleSelected(item, val)"
      @action="handleAction"
    />
  </div>
</template>

<script>
import AppRoutes from "../../../../configs/AppRoutes";
import ProductListItem from "./product-list-item.vue";
import Product from "../../../../models/ecommerse/product";
const commonActions = {
  // 编辑
  update: {
    title: "编辑",
    onAction(product) {
      App.push(AppRoutes.Product.update(product.id));
    }
  },
  down_shelf: {
    title: "下架",
    // onAction(product) {
    //   this.$Message.info("暂未实现!")
    //   // AppProxy.do_push(AppRoutes.OrderRefund.id(order.id, product.sn));
    // }
    onAction(product) {
      App.modal({
        title: "批量下架",
        width: 400,
        content: "下架后，店铺内将不再展示这些商品\n确认下架？",
        loading: true,
        onOk: async (view, modal) => {
          console.log("批量下架 具体逻辑: ", product);
          try {
            const params = {
              ids: [product.id]
            };
            await Product.batchUnSale(params);
            this.$Message.info("下架商品成功");
            App.removeModal();
            App.event.$emit(Product.events.Update);
          } catch (error) {
            this.$Message.error("下架商品失败!");
            modal.cancelLoading();
          }
        }
      });
    }
  },
  delete: {
    title: "删除",
    color: "#ed3f14",
    onAction(product) {
      App.modal({
        title: "批量删除",
        width: 500,
        content:
          " 删除后，店铺内将不再展示这些商品，并且库存以及SKU将全部一并删除,该商品相关的订单将再无法编辑,确认删除？",
        loading: true,
        onOk: async (view, modal) => {
          // TODO
          try {
            const ids = [product.id];
            await Product.batchDelete(ids);
            this.$Message.info("删除商品成功");
            App.removeModal();
            App.event.$emit(Product.events.Delete);
          } catch (error) {
            this.$Message.error("删除商品失败!");
            modal.cancelLoading();
          }
        }
      });
    }
  }
};

export default {
  components: {
    ProductListItem
  },
  props: {
    selections: {
      type: Array
    },
    listDelegator: {
      type: Object
    },
    items: {
      type: Array
    },
    idKey: {
      type: [String, Number]
    }
  },
  computed: {
    // 列表数据
    itemsEx() {
      // 刷新数据后保持选中状态
      this.items.forEach(
        it =>
          (it._checked =
            this.selections.findIndex(
              it2 => it[this.idKey] === it2[this.idKey]
            ) >= 0)
      );

      // TODO 这里可以扩展获取其它的数据进行组装
      console.log("content: ", this.items);
      return this.items;
    }
  },
  data() {
    return {
      selectAll: false
    };
  },
  watch: {
    selectAll() {
      if (this.selectAll) {
        this.listDelegator.selectAll();
      } else {
        this.listDelegator.deselectAll();
      }
    }
  },
  methods: {
    handleSelected(item, val) {
      if (!val) {
        this.listDelegator.deselect && this.listDelegator.deselect(item.id);
      } else {
        this.listDelegator.select && this.listDelegator.select(item.id);
      }
    },
    handleAction(action, item) {
      const actionObj = commonActions[action];
      if (actionObj) {
        actionObj.onAction.call(this, item);
      }
    }
  }
};
</script>
