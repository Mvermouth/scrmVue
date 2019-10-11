<style lang="less" scoped>
	table {
		border-top: 1px solid #ccc;
        border-left:1px solid #ccc;
	}
	th {
		border-bottom: 1px solid #ccc;
        border-right:1px solid #ccc;
	}
    .batch-input{
        label{
            display:inline-block;
            margin-right:5px;
        }
        span{
            margin:0 15px 0 10px;
        }
    }
    .spec-table{
        margin-top:16px;
    }
    thead{
        background:#fff;
        height:40px;
        line-height:40px;
    }
    .spec-table-list{
        flex:auto;
        min-height: 49px;
        text-align:center;
    }
    tr td{
        text-align:center;
        border-bottom: 1px solid #ccc;
        border-right:1px solid #ccc;
        padding:8px 16px;
    }
</style>
<template>
    <div class="spec-layer">
        <div class="spec-table">
            <div class="spec-table-head">
                <table cellspacing="0" cellpadding="0" border="0">
                    <thead v-if="allSkus && allSkus.length > 0">
                        <tr>
                            <th v-for="(list, key) in filteredSpecs" :key="`name_${key}`">{{ list.name }}</th>
                            <th>货号</th>
                            <th>销售价</th>
							<th v-if="warehouses.length===1">库存</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(sku, index) in allSkus" :key="index">
                            <td v-for="(value, index2) in sku.specs" :key="index2" v-if="index%rowspans[index2]===0" :rowspan="rowspans[index2]">
                            {{ value.name }}
                            </td>
                            <td><i-input v-model="sku.code" ></i-input></td>
                            <td><i-input v-model="sku.price" number></i-input></td>
							<td  v-if="warehouses.length === 1" ><i-input v-model="sku.quantity" number></i-input></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
export default {
	data() {
		return {
			formItem: {
				price: ''
			},
			allSkus: [],
			skus: this.value,
			filteredSpecs: [],
			rowspans: []

		}
	},
	props: {
		//默认的销售价
		price: {
			type: Number,
			required: false,
			default: 0.00
		},
		value: {
			type: Array,
			required: false,
			default() { return []}
		},
		specs: {
			type: Array,
			required: false,
			default() { return []}
		},
		warehouses: {
			type: Array,
			required: false,
			default() { return []}
		}
	},
	watch: {
		value: {
			handler(val) {
				this.skus = val
			},
			deep: true
		},
		allSkus: {
			handler(val) {
				// merge allSkus
				this.skus = this.allSkus.filter(it => {return it.code != 0 || it.price != 0})
				this.$emit('input', this.skus)
			},
			deep: true
		},
		// 动态计算规格列表
		specs: {
			handler(val) {
				this.refresh()
			},
			deep: true
		}
	},
	mounted() {
		this.refresh()
	},
	methods: {
		refresh() {
			this.filteredSpecs = _.filter(this.specs, it => { return it.value.length > 0 })
			if (_.isEmpty(this.filteredSpecs)) {
				this.allSkus = []
				return
			}
			let allSkus = this.descartes(this.filteredSpecs)
			this.rowspans = this._rowspans(this.filteredSpecs)
			this.allSkus = this.arraySpecs(allSkus, this.skus)		
		
		},
		// 排列规格
		arraySpecs(allSkus, skus) {
			const result = []

			allSkus.forEach(specs => {
				let skuWrapper = _.find(skus, sku => {
					const r = (sku.specs.length === specs.length) && _.isEmpty(_.differenceBy(sku.specs, specs, 'name'))
					return r
				}) || { specs: specs, code: '', price: 0, quantity: 0 }
				result.push(skuWrapper)
			})
			return result
		},
		// 计算每组规格合并的单元格行数
		_rowspans(specs) {
			let r = 1
			const arr = []
			for (let i = specs.length - 2; i >= 0; i--) {
				if (specs[i + 1].value.length > 0) {
					r *= specs[i + 1].value.length
					arr[i] = r
				}
			}
			arr[specs.length - 1] = 1
			return arr
		},
		// 笛卡尔积处理规格
		descartes(specs) {
			let total = 1
			specs.forEach(spec => { if (spec.value.length > 0) total *= spec.value.length })
			const result = []

			let itemLoopNum = 1
			let loopPerItem = 1
			let now = 1

			specs.forEach(spec => {
				if (spec.value.length > 0) {
					const id = spec.id
					now *= spec.value.length
					let index = 0
					const currentSize = spec.value.length
					itemLoopNum = total / now
					loopPerItem = total / (itemLoopNum * currentSize)

					let myIndex = 0
					spec.value.forEach(value => {
						for (let i = 0; i < loopPerItem; i++) {
							myIndex = myIndex % spec.value.length

							for (let j = 0; j < itemLoopNum; j++) {
								let vector = result[index]
								if (!vector) vector = result[index] = []
								spec.value[myIndex].id = id
								vector.push(spec.value[myIndex])
								index++
							}
							myIndex++
						}
					})
				}
			})
			return result
		},
		//批量填充规格销售价
		// batchFillSpecsValue() {
		// 	this.skus.forEach((item, index) => {
		// 		if (this.formItem.price !== '' && this.formItem.price !== item.price) {
		// 			item.price = this.formItem.price
		// 		}
		// 	})
		// },
		checkInputVal(val) {
			const regep = /^[0-9]*$/
			if (!regep.test(val)) {
			}
		}
	}
}
</script>


