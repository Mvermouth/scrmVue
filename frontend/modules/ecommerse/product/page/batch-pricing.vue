<style lang="less">
.price-manage-table {
  border: 1px solid #e6e6e6;
}

.price-manage-table .table-hd {
  background-color: #f8f8f8;
}

.price-manage-table .table-bd,
.price-manage-table .table-hd {
  overflow: hidden;
  color: #333;
  line-height: 40px;
  text-indent: 15px;
  height: 40px;
}

.price-manage-table .table-cell {
  float: left;
  width: 25%;
  height: 40px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.price-manage-modal .price-option {
  margin-top: 18px;
  color: #333;
}

.price-manage-modal .price-option-1 {
  overflow: hidden;
}

.price-manage-modal input[type="radio"] {
  width: 30px;
}

.price-manage-modal label {
  float: left;
  margin: 0;
  line-height: 38px;
  margin-right: 10px;
}

.price-manage-modal .cal-option-select {
  font-size: 14px;
  height: 33px;
  width: 65px;
  line-height: 20px;
  margin: 2px;
}

.price-manage-modal input {
  width: 140px;
  height: 34px;
  border: 1px solid #ededed;
  position: relative;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  margin: 2px;
  padding: 0 9px;
  font-size: 14px;
  margin-right: 0;
  float: left;
  background: #fff;
}

.price-manage-modal .price-cal-option {
  position: relative;
  float: left;
}
</style>

<template>
    <div class="price-manage-modal">
        <div class="price-manage-table">
            <div class="table-hd">
                <div class="table-cell" style="width:50%;">商品名称</div>
                <div class="table-cell">原价</div>
                <div class="table-cell">修改后价格</div>
            </div>
            <div v-for="product in products" :key="product.id" class="table-bd">
                <div class="table-cell" style="width:50%;">{{product.name}}</div>
                <div class="table-cell">
                    <span v-if="product.skuMinPrice == product.skuMaxPrice">{{product.skuMaxPrice}}</span>
                    <div v-else-if="product.skuMinPrice < product.skuMaxPrice">
                        <span>{{product.skuMinPrice}}</span>-<span>{{product.skuMaxPrice}}</span>
                    </div>
                </div>
                <div class="table-cell">
                    <span v-if="product.skuNewMinPrice == product.skuNewMaxPrice">{{product.skuNewMaxPrice}}</span>
                    <div v-else-if="product.skuNewMinPrice < product.skuNewMaxPrice">
                        <span>{{product.skuNewMinPrice}}</span>-<span>{{product.skuNewMaxPrice}}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="price-option">
            <div class="price-option-1">
                <input type="radio" name="change_type" v-model="changeType" checked value="1"/>
                <label>直接修改价格：设置统一价格</label>
                <input onkeyup="value=value.replace(/[^\.\d]/g,'')" :disabled="changeType != 1" v-model="newPrice" type="text" style="width:194px;"/>
            </div>
            <div class="price-option-2">
                <input type="radio" v-model="changeType" name="change_type" value="2">
                <label>运用统一公式修改价格：原价</label>
                <div class="price-cal-option">
                    <Select v-model="calType" class="cal-option-select" @on-change="changeCalType" :disabled="changeType != 2">
                        <Option v-for="cal in calOptions" :value="cal.value" :key="cal.value">{{ cal.title }}</Option>
                    </Select>
                </div>
                <input :disabled="changeType != 2"  onkeyup="value=value.replace(/[^\.\d]/g,'')" type="text" v-model="calValue"/>
                <div style="clear:both;height:1px;line-height:1px;"></div>
            </div>
        </div>
    </div>
</template>
<script>
import Product from '../../../../models/ecommerse/product' 
export default {
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  watch: {
    newPrice() {
      const val = parseFloat(this.newPrice || 0);
      const products = _.cloneDeep(this.products);

      products.forEach(it => {
        it.skus.forEach(it1 => {
          it1.newPrice = val || it1.price ;
        });

        it.skuNewMinPrice = _.minBy(it.skus, "newPrice").newPrice;
        it.skuNewMaxPrice = _.maxBy(it.skus, "newPrice").newPrice;
      });

      this.products = products;
    },
    changeType(){
      if(this.changeType == 2){
        this.newPrice = ''
      }else{
        this.calValue = ''
      }
    },
    calValue() {
      const val = parseFloat(this.calValue|| 0);
      const products = _.cloneDeep(this.products);
      if(this.changeType === 1){
        return
      }
      const calValue = this.calValue
      
      products.forEach(it => {
        it.skus.forEach(it1 => {
        let value = 0
        if(this.calType === 'add'){
            value = it1.price + val
        } 
        else if(this.calType === 'subtract'){
            value = it1.price - val
        }
        else if(this.calType === 'multiply'){
            value = it1.price * (val|| 1)
        }
        else if (this.calType === 'divide'){
            value = it1.price/(val || 1)
        }
            it1.newPrice = value;
        });
        it.skuNewMinPrice = _.minBy(it.skus, "newPrice").newPrice;
        it.skuNewMaxPrice = _.maxBy(it.skus, "newPrice").newPrice;
      });

      this.products = products;
    }
  },
  data() {
    return {
      calType: "add",
      calValue: "",
      calOptions: [
        { title: "加", value: "add" },
        { title: "减", value: "subtract" },
        { title: "乘", value: "multiply" },
        { title: "除", value: "divide" }

      ],
      changeType: 1,
      newPrice: "",
      products: this.items.map(it => {
        const skuMinPrice = _.minBy(it.skus, "price").price
        const skuMaxPrice = _.maxBy(it.skus, "price").price

        return Object.assign(it, {
          skuMinPrice: skuMinPrice,
          skuMaxPrice: skuMaxPrice,
          skuNewMinPrice: skuMinPrice,
          skuNewMaxPrice: skuMaxPrice
        });
      })
    };
  },
  methods: {
    changeCalType(){
      this.calValue = ""
    },
    async submit() {
      // validation
      if (this.changeType == 1) {
        if (this.newPrice <= 0) {
          this.$Message.error({ content: "请输入大于0的数字" });
          return false;
        }
      } else if (this.changeType == 2) {
        if (this.calValue <= 0) {
          this.$Message.error({ content: "请输入大于0的数字" });
          return false;
        }
      }
      const params = {
        ids:this.products.map(it => it.id)
      }
      if(this.changeType == 1){
        params.type = "set",
        params.value = this.newPrice
      }else {
        params.type = this.calType,
        params.value = this.calValue
      }
      await Product.batchChangePrice(params)
      return true;
    }
  }
};
</script>
