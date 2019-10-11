<style lang="less" scoped>
    .spec-content{
        width:100%;
        position: relative;
    }
    .spec-select{
        display: flex;
        align-items: center;
        margin-bottom:20px;
    }
    .spec-wrapper{
        span{
            color:red;
        }
    }
    .spec-list{
        padding: 15px;
        background: #f5f5f5;
        margin-bottom: 10px;
    }
    .delete-btn{
        position: absolute;
        right: 20px;
        top:0;
        cursor: pointer;
        height: 30px;
        color: red;
    }
    .spec-add{
        position: relative;
        cursor: pointer;
        color: #0089ff;
        display: inline-block;
    }
    .spec-value{
        text-align:right;
        .value{
            position: absolute;
            border: 1px solid #0088fe;
            background: #fff;
            width: 200px;
            min-width: 30px;
            left: 10px;
            top: 15px;
        }
    }
</style>
<template>
    <div class="spec-layer">
        <div class="spec-list" v-for="item in specList" :key="item.id">
            <div class="spec-content">
                <div class="delete delete-btn" @click="dele(item)">
                    删除
                </div>
                <div class="spec-select">
                    <select-spec v-model="item.name" :specList="specList" :selectSpecCallback="selectSpecCallback" placeholder="输入规格"></select-spec>
                    <!-- <div class="img-checkbox"><Checkbox v-model="item.isHaveImg" style="margin-left:8px;">添加规格图片&nbsp;&nbsp;仅支持为第一个规格设置图片， 建议尺寸：<span class="red-tils">300 x 300</span> 像素</Checkbox></div> -->
                </div>
            </div>
            <show-spec-value v-model="item.value" :isHaveImg="item.isHaveImg||false"></show-spec-value> 
            <div v-show="item.name!==''" >
                <Poptip v-model="item.allowed" placement="bottom" width="400" trigger="click">
                    <span class="spec-add">+添加规格值</span>
                    <div class="spec-value" slot="content">
                        <add-spec-value :name="item.name" :specId="item.id" v-model="item.allowed" @on-ok="onOk"></add-spec-value>
                    </div>
                </Poptip>
            </div>
        </div>
        <div class="spec-wrapper">
            <i-button type="primary" icon="plus" @click="addSpecListItem">添加规格</i-button> &nbsp;&nbsp;添加/删除规格后将影响原有规格值数据<span>（货号、销售价、库存、重量等数据将清零）</span>，请谨慎操作。
        </div>
    </div>
</template>

<script>
import SelectSpec from './select-spec.vue'
import ShowSpecValue from './show-spec-value.vue'
import AddSpecValue from './add-spec-value.vue'
export default {
	components: {
		SelectSpec,
		ShowSpecValue,
		AddSpecValue
	},
	props: {
		specs: {
			type: Array,
			required: false,
			default: () => { return [] }
		}
	},
	data() {
		return {
			specList: this.specs
		}
	},
	watch: {
		value: {
			handler(val) {
				this.specList = val
			},
			deep: true
		},
		specList: {
			handler(val) {
				this.$emit('specsChanged', this.specList)
			},
			deep: true
		}
	},
	methods: {
		selectSpecCallback(spec) {
			this.specList.forEach(it => {
				if (it && it.name === spec.name) {
					it.id = spec.id
					it.value = []
				}
			})
		},
		addSpecListItem() {
			const params = {
				name: '',
				value: [],
				isHaveImg: false,
				allowed: false
			}
			this.specList.push(params)
		},
		dele(item) {
			this.$Modal.confirm({
				title: '确认删除',
				content: '是否删除该条数据？',
				loading: true,
				onOk: () => {
					this.specList = _.without(this.specList, item)
					this.$Modal.remove()
				}
			})
		},
		onOk(val, name) {
			_.forEach(this.specList, item => {
				if (item.name === name) {
					item.allowed = false
					item.value = _.uniqBy(_.concat(item.value, val), 'name')
				}
			})
		}

	}
}
</script>


