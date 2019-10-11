<style lang="less" scoped>
    .multiple-spec-select{
        border: 1px solid #0088fe;
        background: #fff;
        width: 200px;
        min-width: 30px;
        position: absolute;
        left: 10px;
        top: 15px;
        overflow: hidden;
    }
    .multiple-tag{
        display:flex;
        flex-wrap:wrap;
        padding:2px 4px;
        .tag{
            height:30px;
            line-height:30px;
        }
    }
    .multiple-spec-select-search{
        .multiple-spec-select-input{
            width:100%;
            border:none;
            height:30px;
            line-height:30px;
            padding:4px;
            outline:none;
        }
        .spec-select-search-item {
            padding: 4px;
            text-align: left
        }
    }
</style>
<template>
    <div class="spec-select-wrap">
        <div class="multiple-spec-select">
            <div class="multiple-tag">
                <tag  class="tag" v-for="(item, index) in model" :key="`item_${index}`" closable @on-close="deleSpecValue(index)">{{item.name}}</tag>
            </div>
            <div  class="multiple-spec-select-search" style="width: 200px">
                <input v-model="inputVal" class="multiple-spec-select-input" type="text" @input="remote" @keypress.enter.prevent="onEnter(inputVal)" @focus="remote" placeholder="请输入规格值名称，回车后生成">
                <transition name="transition-drop">
                    <div v-if="loading" class="loading">加载中......</div>
                    <div v-if="!loading" class="spec-select-search-list">
                        <div v-for="(item, key) in remoteList" :key="`value_${key}`" class="spec-select-search-item"  @click="clickItem(item)">{{item.name}}</div>
                    </div>
                </transition>
            </div>
        </div>
        <div>
            <i-button type="primary" @click="submitSpecVal">确认</i-button>
            <i-button @click="cancle">取消</i-button>
        </div>
    </div>
</template>
<script>
import Spec from '../../../../../models/ecommerse/spec'
export default {
	directives: {
		focus: {
			inserted: function(el, { value }) {
				if (value) {
					el.focus()
				}
			}
		}
	},
	props: {
		value: {
			type: Boolean,
			required: false
		},
		name: {
			type: String,
			required: true
		},
		specId: {
			type: Number,
			required: false
		}
	},
	data() {
		return {
			visible: this.value,
			inputVal: '',
			model: [],
			loading: false,
			// remoteList: this.spec ? JSON.parse(this.spec.value).map(it => { return it.name }) : []
			remoteList: []
		}
	},
	watch: {
		value(val) {
			this.visible = val
		},

		visible(val) {
			if (!val) {
				this.remoteList = []
			}
			this.$emit('input', this.visible)
		}
	},
	methods: {
		onEnter(val) {
			if (val === '' || _.some(this.model, { name: val })) {
				this.$Notice.error({ title: '不能添加相同的规格值'})
				return
			}
			this.model.push({ name: val, img: '' })
			this.remoteList.splice(0, 0, { name: val, img: '' })
			this.updateSpecValue(JSON.stringify(this.remoteList))
			this.inputVal = ''
		},
		async updateSpecValue(value) {
			await Spec.update({ id: this.specId, value: value })
		},
		async loadSpecValues() {
			if (this.specId) {
				const spec = await Spec.retrieve(this.specId)
				if (spec.value) {
					this.remoteList = JSON.parse(spec.value)
				}
			}
		},
		// 对输入框支持远程搜索
		remote() {
			console.log('this.remoteList: ', this.remoteList)
			if (!_.isEmpty(this.remoteList)) {
				return
			}
			this.loadSpecValues()
		},
		deleSpecValue(index) {
			this.model.splice(index, 1)
		},

		clickItem(item) {
			if (_.some(this.model, { name: item.name })) {
				this.$Notice.error({ title: '不能添加相同的规格值'})
				return
			}
			this.model.push({ name: item.name, img: '' })
			this.inputVal = ''
		},

		submitSpecVal() {
			this.$emit('on-ok', this.model, this.name)
			this.model = []
			this.visible = false
		},
		cancle() {
			this.model = []
			this.visible = false
		}
	}
}
</script>


